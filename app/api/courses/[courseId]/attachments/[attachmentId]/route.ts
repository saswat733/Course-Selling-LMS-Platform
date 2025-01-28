import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{courseId:string,attachmentId:string}}){
    try {
        console.log("DELETE_ATTACHMENTS",params.attachmentId);
        console.log("DELETE_COURSE",params.courseId);
        const {userId} = await auth();
        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }


        const courseOwner=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId:userId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized", {status:401});
        }

    const attachment=await db.attachement.delete({
        where:{
            courseId:params.courseId,
            id: params.attachmentId
        }
    })

    return  NextResponse.json("attachment:", attachment);
        
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS_DELETE_ERROR",error);
        throw new NextResponse("Something went wrong", {status:500});
    }
}