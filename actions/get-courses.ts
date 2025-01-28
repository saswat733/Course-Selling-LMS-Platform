import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title = "",
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    // Construct a dynamic `where` clause to handle optional parameters
    const whereClause: any = {
      isPublished: true,
    };

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const courses = await db.course.findMany({
      where: whereClause,
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        Purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.Purchases.length === 0) {
            return {
              ...course,
              progress: null, // Progress is null for courses without purchases
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSES] Error fetching courses:", error);
    return [];
  }
};
