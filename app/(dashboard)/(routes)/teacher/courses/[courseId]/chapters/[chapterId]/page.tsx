import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import { IconBadge } from "@/components/icon-badge";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";

const ChapterPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { courseId, chapterId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect(`/dashboard/teacher/courses/${params.courseId}`);
  }

  const requiredFields = [chapter.description, chapter.title, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete= requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <>
          <Banner
            variant={"warning"}
            label="This chapter is not published yet. It will not be visible to students until you publish it."
          />
        </>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className=" hover:opacity-50 transition flex items-center gap-2"
            >
              <ArrowLeft />
              Back to course edit
            </Link>
            <div className="mt-5 flex items-center gap-x-4">
              <div className="">
                <div className="text-2xl font-semibold ">
                  <h1>Chapter Creation</h1>
                </div>
                <div className="text-slate-600">
                  <span>complete all the fields {completionText}</span>
                </div>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="mt-5 w-1/2">
            <div className="flex items-center gap-4">
              <div className="bg-blue-300 rounded-full p-2 w-fit ">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span>Customize your chapter</span>
            </div>
            <div className="">
              <ChapterTitleForm
                initialData={chapter}
                chapterId={chapter.id}
                courseId={chapter.courseId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                chapterId={chapter.id}
                courseId={chapter.courseId}
              />
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={chapter.courseId}
                chapterId={chapter.id}
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add Video</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ChapterPage;
