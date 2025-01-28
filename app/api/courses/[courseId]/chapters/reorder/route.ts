import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure correct path to your DB utility

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { list }: { list: { id: string; position: number }[] } =
      await req.json();

    // Validate payload
    if (
      !Array.isArray(list) ||
      list.some((item) => !item.id || item.position == null)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid data provided" },
        { status: 400 }
      );
    }

    // Check ownership of the course
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Perform batch updates for chapter positions
    const updatePromises = list.map((item) =>
      db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json(
      { success: true, message: "Chapters reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("COURSE_ID_ATTACHMENTS_PUT_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
