import { db } from "@/lib/db";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

type CoursePayload = {
  title?: string; // Optional to handle undefined gracefully
};

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    let body: CoursePayload;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }

    // Validate payload
    const { title } = body;

    if (!title || typeof title !== "string") {
      return new NextResponse("Invalid title", { status: 400 });
    }

    // Create course in the database
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    // Return success response
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);

    // Return internal server error response
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function DELETE(req:NextRequest,
  { params }: { params: { courseId: string;}}
){
  try {
    const {userId}=await auth()
    const {courseId}=await params

    if(!userId || !courseId){
      return new NextResponse("Unauthorized",{status:401})
    }

    const course=await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    })

    if(!course){
      return new NextResponse("Unauthorized",{status:401})
    }

    await db.course.delete({
      where:{
        id:courseId
      }
    })

    console.log("Course deleted successfully")

    throw new NextResponse("Course deleted",{status:200})
    
  } catch (error) {
    console.log("error delete course",error)
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function GET(req:NextRequest,
  { params }: { params: { courseId: string;}}
){
  try {
    const {userId}=await auth()
    const {courseId}=await params

    if(!userId || !courseId){
      return new NextResponse("Unauthorized",{status:401})
    }

    const courses=await db.course.findMany({
      where:{
        userId,
      },
      orderBy:{
        createdAt:"desc"
      }
    })
    
    return NextResponse.json({success:true,courses})
  } catch (error) {
    console.log("error get course",error)
    return new NextResponse("Internal server error", { status: 500 });
  }
}