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
import { cn } from "@/lib/utils"; // Adjust the import path as necessary
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
});

interface PropsType {
  initialData: { description: any };
  courseId: string;
}

const DescriptionForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Values submitted:", values);
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values); // Send payload as { title }

      toast.success("Course description updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating desrciption:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg  mr-10">Course Descirpition</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev: any) => !prev)}
          >
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Description
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <div className="bg-slate-50 px-4 flex items-center justify-center  rounded-md">
            <p className={cn("text-sm text-slate-700 m-2",!initialData.description && "text-center text-slate-500 italic" )}>
              {initialData.description || "No description provided"}
            </p>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">
                    Edit Course description
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="this course is about..." disabled={!isEditing} {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description for your course.
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

export default DescriptionForm;
