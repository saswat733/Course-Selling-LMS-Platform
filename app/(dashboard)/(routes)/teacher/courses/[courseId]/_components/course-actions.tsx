"use client";

import { ConfirmModal } from "@/components/confirm-modals";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({
  courseId,
  disabled,
  isPublished,
}: CourseActionProps) => {
  const confetti=useConfettiStore();
    const router=useRouter()
    const [isLoading, setisLoading] = useState(false)
    const onDelete =async ()=>{
        try {
            setisLoading(true);
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("course deleted successfully")
            router.push(`/teacher/courses/`)
        } catch (error) {
            toast.error("Failed to delete course")
        }finally{
            setisLoading(false)
        }
    }

    const onPublish=async ()=>{
        try {
            if(isPublished){

                setisLoading(true);
                await axios.patch(`/api/courses/${courseId}/unpublish`)
            }
            else{
                setisLoading(true);
                await axios.patch(`/api/courses/${courseId}/publish`)
                
            }
            toast.success(isPublished?"Course unpublished successfully":"Chapter published successfully")
            router.refresh()
            confetti.onOpen();
        } catch (error) {
            toast.error("Failed to publish Course")
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
