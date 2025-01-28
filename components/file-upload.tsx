"use client";

import toast from "react-hot-toast";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";

interface FileUploadProps {
  onChange: (url?: string, originalFilename?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

type UploadResponse = {
  url: string;
  name: string;
};

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const handleUploadComplete = (res: UploadResponse[] | undefined) => {
    if (res && res.length > 0) {
      console.log("Upload successful:", res);
      onChange(res[0].url, res[0].name);
    } else {
      toast.error("No files uploaded.");
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    toast.error(`Upload failed: ${error.message}`);
  };

  return (
    <UploadDropzone<typeof ourFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      className="border rounded-md p-4 bg-gray-50"
    />
  );
};
