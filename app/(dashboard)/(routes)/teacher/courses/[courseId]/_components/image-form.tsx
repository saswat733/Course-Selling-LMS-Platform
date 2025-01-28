"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Adjust the import path as necessary
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
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
    console.log("Values submitted:", values);
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success("Course image updated successfully");
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
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              <>Cancel</>
            ) : initialData.imageUrl ? (
              <>
                <Pencil size={20} />
                <span className="ml-2">Edit Image</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                <span className="ml-2">Add Image</span>
              </>
            )}
          </Button>
        </div>

        {!isEditing ? (
          initialData.imageUrl ? (
            <div className="relative aspect-video mt-2">
              <Image
                alt="Uploaded Image"
                fill
                className="object-cover rounded-md"
                src={initialData.imageUrl}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
          )
        ) : (
          <div className="mt-4">
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
              16:9 aspect ratio is recommended
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageForm;
