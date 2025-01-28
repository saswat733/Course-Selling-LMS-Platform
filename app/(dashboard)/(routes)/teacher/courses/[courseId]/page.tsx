import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import PriceForm from "./_components/price-form";
import AttachementForm from "./_components/attachement-form";
import ChapterForm from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";
import CategoryForm from "./_components/category-form";

const CreatedCoursesPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  // Fetch authenticated user

  const { userId } = await auth();

  if (!userId) {
    return redirect("/"); // Redirect if the user is not authenticated
  }

  // Fetch course details
  const courseId = await params;
  const course = await db.course.findUnique({
    where: { id: courseId.courseId, userId: userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachements: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/"); // Redirect if the course is not found
  }

  // Calculate completion status
  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `complete all the fields (${completedFields}/${totalFields})`;
  const isCompleted=requiredFields.every(Boolean)
  // if(course.isPublished){
  //   return redirect(`/teacher/courses/`) 
  // }

  return (
    <>
     {!course.isPublished && (
            <>
              <Banner
                variant={"warning"}
                label="This course is not published yet. It will not be visible to students until you publish it."
              />
            </>
          )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span>
              <span className="text-sm text-gray-800 ">{completionText}</span>
            </span>
          </div>
          {/* add actions */}
          <CourseActions
          disabled={!isCompleted}
          isPublished={course.isPublished}
          courseId={course.id}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className=" w-fit">
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={LayoutDashboard}
                size={"sm"}
                variant={"success"}
              />
              <h1 className="text-xl font-semibold">Customize your course</h1>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6 ">
            <div className="">
              <div className="flex flex-center items-center gap-x-2">
                <IconBadge icon={ListCheck} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm courseId={course.id} initialData={course} />
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources and attachements</h2>
            </div>
            <AttachementForm courseId={course.id} initialData={course} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatedCoursesPage;
