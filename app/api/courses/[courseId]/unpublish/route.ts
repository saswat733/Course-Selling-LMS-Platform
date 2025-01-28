import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
    try {
        const {userId}=await auth();
        const {courseId}=await params;

        if(!userId || !courseId ){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse=await db.course.findFirst({
            where:{
                id:courseId,
                userId
            }
        })

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

         if(ownCourse.isPublished){
            await db.course.update({
                where:{
                    id:courseId
                },
                data:{
                    isPublished:false
                }
            })
         }

        return new NextResponse("Chapter published successfully", { status: 200 });
        
    } catch (error) {
        console.log("Failed to publish chapter",error)
        throw new NextResponse("Failed to publish chapter", { status: 500 });
    }
}