import { db } from "@/lib/db";
import { Attachement,Chapter } from "@prisma/client";
interface GetChapterProps{
    userId:string;
    courseId:string;
    chapterId:string;
}

export const getChapter=async({
    chapterId,
    courseId,
    userId,
}:GetChapterProps)=>{
    try {
        const purchase = await db.purchase.findFirst({
          where: {
            userId,
            courseId,
          },
        });

        const course=await db.course.findUnique({
            where:{
                id:courseId,
                isPublished:true,
            },
            select:{
                price:true,
            }
        })

        const chapter=await db.chapter.findUnique({
            where:{
                id:chapterId,
                isPublished:true,
            }
        })

        if(!chapter || !course){
            throw new Error("Chapter not found")
        }

        let muxData=null;
        let attachments:Attachement[]=[];
        let nextChapter:Chapter|null=null;

        if(purchase){
            attachments=await db.attachement.findMany({
                where:{
                    courseId:courseId,
                }
            })
        }

        if(chapter.isFree || purchase){
            muxData=await db.muxData.findFirst({
                where:{
                    chapterId:chapterId,
                }
            })
            nextChapter=await db.chapter.findFirst({
                where:{
                    courseId:courseId,
                    isPublished:true,
                    position:{
                        gt:chapter?.position,
                    }
                },
                orderBy:{
                    position:"asc"
                }

            })
        }

        const userProgress=await db.userProgress.findFirst({
            where:{
                userId: userId,
                chapterId: chapterId
            }
        })

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        }


    } catch (error) {
        console.log("GET_CHAPTER_ERROR",error);
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:[],
            nextChapter:null,
            userProgress:null,
            purchase:null,
        }
    }
}