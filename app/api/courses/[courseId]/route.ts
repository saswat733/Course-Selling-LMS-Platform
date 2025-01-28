import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth(); // Get the userId from auth
    const { courseId } = params; // Access params directly (no need for await)
    const values = await req.json(); // Parse request body
    console.log("reached")
    // Check if values is valid
    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("Bad Request: Missing payload", { status: 400 });
    }

    console.log("Received payload:", values);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the course
    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId, // Ensure the user owns this course
      },
      data: {
        ...values, // Make sure values is the correct object to update the course with
      },
    });

    return NextResponse.json(updatedCourse); // Send the updated course back in the response
  } catch (error) {
    console.error("[COURSE_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
