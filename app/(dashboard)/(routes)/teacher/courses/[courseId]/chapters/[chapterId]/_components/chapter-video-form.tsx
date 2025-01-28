"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface PropsType {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ initialData, courseId, chapterId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData.videoUrl || "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("payload sending:", values);
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        { values }
      );
      toast.success("Chapter video uploaded successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Chapter Video</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {!initialData.videoUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" /> Add a Video
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Video
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          initialData.muxData?.playbackId ? (
            <div className="relative w-full pb-[56.25%] bg-slate-200 rounded-md">
              <MuxPlayer
                playbackId={initialData.muxData.playbackId}
                className="absolute top-0 left-0 w-full h-full"
                onError={(error) => console.error("Playback error:", error)}
              />
            </div>
          ) : (
            <div className="flex items-center w-full justify-center h-60 bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-400" />
            </div>
          )
        ) : (
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url && url.startsWith("http")) {
                onSubmit({ videoUrl: url });
              } else {
                toast.error("Invalid video URL. Please try again.");
              }
            }}
          />
        )}

        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Please be patient and
          refresh the page.
        </div>
      </div>
    </div>
  );
};

export default ChapterVideoForm;
