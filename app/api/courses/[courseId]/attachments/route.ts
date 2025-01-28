import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import next from "next";
import { NextResponse } from "next/server";

export async function POST(req:Request,{params}:{params:{courseId:string}},body:any){
  try {
    const {userId} = await auth();
    const {url}=await req.json();

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

    const attachment=await db.attachement.create({
        data:{
            url,
            name:url.split("/").pop(),
            courseId:params.courseId
        }
    })

    return NextResponse.json("attachment:", attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS_POST_ERROR",error);
    throw new NextResponse("Something went wrong", {status:500});
  }
}