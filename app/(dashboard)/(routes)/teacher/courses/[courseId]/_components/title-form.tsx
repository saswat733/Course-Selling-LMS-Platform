"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

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

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required",
    })
    .max(100, { message: "Title cannot exceed 100 characters" }),
});

interface PropsType {
  initialData: { title: string };
  courseId: string;
}

const TitleForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`,values); // Send payload as { title }
      
      toast.success("Course title updated successfully");
      setIsEditing(false); 
      router.refresh(); 
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex  flex-col  mt-10 bg-slate-200 p-4  rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Course Title</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev: any) => !prev)}
          >
            {isEditing ? (
              'Cancel'
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Title
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <div className="bg-slate-50 px-4 flex items-center justify-center  rounded-md">
            <p className=" text-sm m-2 text-center text-gray-700 ">{initialData.title}</p>
          </div>
        )}
      </div>

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Edit Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a meaningful title for your course.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TitleForm;
