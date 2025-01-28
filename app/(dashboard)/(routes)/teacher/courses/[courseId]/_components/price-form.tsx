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

const formSchema = z.object({
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(10000, "Price cannot exceed 10,000"), // Add upper limit as needed
});

interface PropsType {
  initialData: { price: any };
  courseId: string;
}

const PriceForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price ?? 0, // Fallback to 0 if undefined or null
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("payload sending:", values);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course price updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const { isSubmitting, errors } = form.formState;

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Course Price</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit Price
              </>
            )}
          </Button>
        </div>
        {!isEditing && (
          <div className="bg-slate-50 px-4 flex items-center justify-center rounded-md">
            <p
              className={cn(
                "text-sm text-slate-700 m-2",
                !initialData.price && "text-center text-slate-500 italic"
              )}
            >
              {initialData.price
                ? `$${initialData.price}`
                : "No price provided"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="price">Edit Course Price</FormLabel>
                  <FormControl>
                    <Input
                      step="0.01"
                      disabled={isSubmitting}
                      {...field}
                      value={field.value || ""} // Ensure value is defined
                      type="number"
                      onChange={(e)=>field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.price.message}
                    </p>
                  )}
                  <FormDescription>
                    Provide a fair price for your course.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
