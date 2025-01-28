"use client"

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
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

interface PropsType {
  initialData: { description: string | null }; // Adjust type to match the data structure
  courseId: string;
  chapterId: string;
}

const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false); // Type it explicitly as boolean

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "", // Ensure default value is a string, not null
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        {values}
      ); // Send payload as { title }

      toast.success("Chapter description updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Chapter Description</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev) => !prev)} // Explicit boolean toggle
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
          <div className="bg-slate-50 px-4 flex items-center justify-center rounded-md">
            <p
              className={cn(
                "text-sm text-slate-700 m-2",
                !initialData.description && "text-center text-slate-500 italic"
              )}
            >
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
                    Edit Chapter Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="this chapter is about..."
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description for your chapter.
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

export default ChapterDescriptionForm;
