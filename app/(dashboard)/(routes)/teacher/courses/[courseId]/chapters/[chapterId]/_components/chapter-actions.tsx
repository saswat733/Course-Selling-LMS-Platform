"use client";

import { ConfirmModal } from "@/components/confirm-modals";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: ChapterActionProps) => {

    const router=useRouter()
    const [isLoading, setisLoading] = useState(false)
    const onDelete =async ()=>{
        try {
            setisLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter deleted successfully")
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error("Failed to delete chapter")
        }finally{
            setisLoading(false)
        }
    }

    const onPublish=async ()=>{
        try {
            if(isPublished){

                setisLoading(true);
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
            }
            else{
                setisLoading(true);
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
            }
            toast.success(isPublished?"Chapter unpublished successfully":"Chapter published successfully")
            router.refresh()
        } catch (error) {
            toast.error("Failed to publish chapter")
        }finally{
            setisLoading(false)
        }
    }

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={onPublish}
          // disabled={disabled || isLoading}
          variant="outline"
          size={"sm"}
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <ConfirmModal  onConfirm={onDelete}>
          <Button size={"sm"} disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      </div>
    </>
  );
};
