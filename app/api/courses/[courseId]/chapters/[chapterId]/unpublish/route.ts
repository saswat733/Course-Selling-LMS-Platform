import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("chapter Not found", { status: 404 });
    }
    // const muxData = await db.muxData.findUnique({
    //   where: {
    //     chapterId: chapterId,
    //   },
    // });

    // if (!muxData) {
    //   return new NextResponse("Video not found", { status: 404 });
    // }

    if (chapter.isPublished) {
      await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    console.log("Chapter unpublished successfully");
    return new NextResponse("Chapter unpublished successfully");
  } catch (error) {
    console.error("Unpublsih Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
