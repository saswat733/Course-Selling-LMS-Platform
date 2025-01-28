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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

interface PropsType {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const CategoryForm = ({ initialData, courseId, options }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || "", // Ensure this is handled correctly
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Values submitted:", values);
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, 
       values
      );

      toast.success("Course category updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg  mr-10">Course Category</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Category
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <div className="bg-slate-50 px-4 flex items-center justify-center rounded-md">
            <p
              className={cn(
                "text-sm text-slate-700 m-2",
                !initialData.categoryId && "text-center text-slate-500 italic"
              )}
            >
              {selectedOption?.label || "No category"}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="categoryId">
                    Select Course Category
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a category for your course.
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

export default CategoryForm;
