"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

// Import Quill without server-side rendering to prevent hydration errors.
const ReactQuill = dynamic(() => import("react-quill"), {
  // No need for ssr: false since this is a client component
  loading: () => <p>Loading...</p>, // Optional loading state
});

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div className="bg-white dark:bg-slate-700">
      <ReactQuill theme="bubble" value={value} readOnly={true} />
    </div>
  );
};
