import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Mux from '@mux/mux-node'
import { auth } from "@clerk/nextjs/server";
const mux=new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
})

const {video}=mux;


// DELETE Method
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    console.log("DELETE API reached"); // Log to confirm API call
    const { userId } = await auth();
    const { courseId, chapterId } = params; // Direct destructuring; no `await` needed

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });
    console.log("Own course:", ownCourse); // Log to confirm course ownership
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        courseId,
      },
    });
    console.log("Chapter found:", chapter); // Log to confirm chapter existence
    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }
    console.log(video)
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      console.log("Existing Mux data:", existingMuxData); // Log to confirm Mux data
      if (existingMuxData?.assetId) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    console.log("Mux data deleted successfully"); // Correct success log
    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });
    console.log("Published chapters in course:", publishedChaptersInCourse); // Log to confirm published chapters
    if (publishedChaptersInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false, // Mark course unpublished
        },
      });
    }

    console.log("Chapter deleted successfully:", chapter); // Correct success log
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /courses/:courseId] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = await params;

    if (!courseId || !chapterId) {
      console.error("Missing route parameters:", { courseId, chapterId });
      return NextResponse.json(
        { error: "Invalid route parameters" },
        { status: 400 }
      );
    }

    const body = await req.json();
     if (!body || typeof body !== "object") {
       throw new TypeError("Invalid payload received.");
     }
    console.log("Received body:", body);

    const { isPublished, values } = body;

    console.log("values:",values)
    if (!values) {
      console.error("Missing values in body:", body);
      return NextResponse.json(
        { error: "Invalid body content" },
        { status: 400 }
      );
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId:courseId,
      },
      data: { ...values },
    });

    console.log("chapter:", chapter);

    if(values.videoUrl){

      console.log("values.videoUrl:",values.videoUrl)
        const existingMuxData=await db.muxData.findFirst({
          where:{
            chapterId:chapterId,
          }
        })

        console.log("existingMuxData:",existingMuxData)



        if(existingMuxData){
          if (existingMuxData.assetId) {
            console.log("Deleting asset with:",existingMuxData.assetId)
            await video.assets.delete(existingMuxData.assetId);
          }
          await db.muxData.delete({
            where:{
              id:existingMuxData.id
            }
          })
        }

        console.log("Creating asset with:",{
          input:values.videoUrl,
          playback_policy:['public'],
          test:false
        })
        const asset=await video.assets.create({
          input:values.videoUrl,
          playback_policy:['public'],
          test:false
        })

        console.log("asset:",asset)
        console.log("Creating muxData with:", {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        });

        const muxi=await db.muxData.create({
          data:{
            chapterId:chapterId || "",
            assetId:asset.id || "",
            playbackId:asset.playback_ids?.[0].id || null,
          }
        })
        console.log("muxi:",muxi)
        
    }
    console.log('checked')
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("PATCH handler error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
