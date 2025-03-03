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
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const [course, categories] = await Promise.all([
    db.course.findUnique({
      where: { id: params.courseId, userId },
      include: {
        chapters: { orderBy: { position: "asc" } },
        attachements: { orderBy: { createdAt: "desc" } },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const completionText = `complete all the fields (${
    requiredFields.filter(Boolean).length
  }/${requiredFields.length})`;

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published yet. It will not be visible to students until you publish it."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-gray-800">{completionText}</span>
          </div>
          <CourseActions
            disabled={!requiredFields.every(Boolean)}
            isPublished={course.isPublished}
            courseId={course.id}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <ChapterForm initialData={course} courseId={course.id} />
            <PriceForm initialData={course} courseId={course.id} />
            <AttachementForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatedCoursesPage;