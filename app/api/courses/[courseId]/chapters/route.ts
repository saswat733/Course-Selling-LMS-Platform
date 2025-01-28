import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: Request, { params }: { params: { courseId: string } }, body: any) {
    try {
        const {userId}=await auth()
        const {title}=await req.json();

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

        const lastChapter=await db.chapter.findFirst({
            where:{
                courseId:params.courseId
            },
            orderBy:{
                position:"desc"
            }
        })
        let newPosition=1;
        if(lastChapter?.position){
            newPosition=lastChapter?.position+1 || 1;
        }

        const newChapter=await db.chapter.create({
            data:{
                title,
                courseId:params.courseId,
                position:newPosition
            }
        })

        return NextResponse.json(newChapter);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS_POST_ERROR", error);
        throw new NextResponse("Something went wrong", { status: 500 });
        
    }
}