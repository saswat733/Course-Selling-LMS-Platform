"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Adjust the import path as necessary
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  ImageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

interface PropsType {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        console.log("payload sending:",values)
        console.log("courseId in ImageForm:", courseId);

      const response = await axios.patch(`/api/courses/${courseId}`, values); // Send payload as { title }

      toast.success("Course Image updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }



  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Course Image</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev: any) => !prev)}
          >
            {!initialData.imageUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" /> add an Image
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Image
              </>
            )}
          </Button>
        </div>
        {!isEditing &&
          (!initialData.imageUrl ? (
            <>
              <div className="flex items-center  w-full justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon
                  className={cn(
                    "h-10 w-10  text-slate-500",
                    !initialData.imageUrl && "text-slate-400"
                  )}
                />
              </div>
            </>
          ) : (
            <>
            <div className="flex items-center  w-full justify-center h-60 bg-slate-200 rounded-md">
              <img
                src={initialData.imageUrl}
                alt="Course Image"
                className="h-60 w-full object-cover rounded-md"
              />
            </div>
            </>
          ))}
      </div>

      {isEditing && (
        <div className="">
       <FileUpload
       endpoint="courseImage"
         onChange={(url) => {
            console.log("file uploaded url:",url)
            if(url){
                onSubmit({ImageUrl:url})
            }
        }}
        />
        </div>
      )}
    </div>
  );
};

export default ImageForm;
