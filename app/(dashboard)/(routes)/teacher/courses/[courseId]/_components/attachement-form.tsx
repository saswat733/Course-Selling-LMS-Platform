'use client'

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ImageIcon, PlusCircle } from "lucide-react";
import { Attachement, Course } from "@prisma/client";

const formSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
});

interface PropsType {
  initialData: Course & { attachements: Attachement[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: PropsType) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [resourceList, setResourceList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add new resource to the list
  const handleAddResource = (url: string) => {
    setResourceList((prev) => [...prev, url]);
  };

  // Submit all resources
  const handleSubmitResources = async () => {
    setIsLoading(true);
    try {
      await Promise.all(
        resourceList.map((url) =>
          axios.post(`/api/courses/${courseId}/attachments`, { url })
        )
      );
      toast.success("All resources added successfully");
      setIsEditing(false);
      setResourceList([]); // Clear local state
      router.refresh();
    } catch (error) {
      console.error("Error adding resources:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete=async (id:string)=>{
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Resource deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error deleting resource:",error);
    }
  }

  return (
    <div className="flex w-fit flex-col gap-x-4 mt-10 bg-slate-200 p-4 rounded-md">
      <div className="font-medium flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg mr-10">Course Resources</h3>
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Stop Editing" : "Add or Edit Resources"}
          </Button>
        </div>

        {/* Display existing resources */}
        {!isEditing && (
          <>
            {initialData.attachements.length > 0 ? (
              <ul className="list-disc ml-4 mt-4">
                {initialData.attachements.map((attachment) => (
                  <li key={attachment.id} className="flex items-center gap-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <a
                      href={attachment.url}
                      target="_blank"
                      className="underline text-blue-600"
                    >
                      {attachment.url}
                    </a>
                    <Button variant="ghost" onClick={() => onDelete(attachment.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No resources added yet.</p>
            )}
          </>
        )}
      </div>

      {/* Add new resources */}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              console.log("Uploaded file URL:", url);
              if (url) {
                handleAddResource(url);
              }
            }}
          />
          <div className="text-sm text-gray-600 mt-2">
            Add multiple resources (e.g., PDF, video, link). They will be listed
            below before submitting.
          </div>

          {/* Display the list of resources being added */}
          {resourceList.length > 0 && (
            <ul className="list-disc ml-4 mt-4">
              {resourceList.map((url, index) => (
                <li key={index} className="flex items-center gap-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <a
                    href={url}
                    target="_blank"
                    className="underline text-blue-600"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Submit button */}
          <Button
            onClick={handleSubmitResources}
            disabled={isLoading || resourceList.length === 0}
            className="mt-4"
          >
            {isLoading ? "Submitting..." : "Submit Resources"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
