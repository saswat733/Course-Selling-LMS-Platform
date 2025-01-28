"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import ChapterList from "./chapter-list";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
});

interface PropsType {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const ChapterForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [chapters, setChapters] = useState(initialData.chapters);
  const [editingChapter, setEditingChapter] = useState<{
    id: string;
    title: string;
  }>({ id: "", title: "" });

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast.success("Chapter created successfully");
      setChapters((prev) => [...prev, data]);
      toggleCreating();
    } catch (error) {
      toast.error("Failed to create chapter");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered successfully");
      setChapters((prev) =>
        [...prev].sort(
          (a, b) => (updateData.find((x) => x.id === a.id)?.position ?? 0) - b.position
        )
      );
    } catch (error) {
      toast.error("Failed to reorder chapters");
    }
  };

  const removeChapter = async (chapterId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      toast.success("Chapter removed successfully");
    } catch (error) {
      toast.error("Failed to delete chapter");
    }
  };

  

  const cancelEditing = () => setEditingChapter({ id: "", title: "" });

  const editChapter = async (id: string) => {
     router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    };

  return (
    <div className="flex flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Course Chapters</h3>
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
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
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to course"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      <div className={cn("mt-2", !chapters.length && "text-slate-500 italic")}>
        {!chapters.length ? (
          "No chapters added yet."
        ) : (
          <ChapterList
            items={chapters}
            onEdit={editChapter}
            onReorder={onReorder}
            onDelete={removeChapter}
          />
        )}
      </div>
    </div>
  );
};

export default ChapterForm;
