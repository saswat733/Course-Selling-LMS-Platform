"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface CategoryItemProps {
  label: string; // Required for button label and accessibility
  value?: string; // Optional category value
  icon?: IconType; // Optional icon
}

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safely retrieve search params
  const currentCategoryId = searchParams?.get("categoryId") || null;
  const currentTitle = searchParams?.get("title") || "";

  // Check if the current category is selected
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value, // Remove categoryId if already selected
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url); // Navigate to the new URL
  };

  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "py-2 px-3 border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200 text-sky-800"
      )}
      type="button"
    >
      {Icon && <Icon size={20} aria-hidden="true" />} {/* Icon is decorative */}
      <div className="truncate">{label}</div>{" "}
      {/* Ensure label text doesn't overflow */}
    </button>
  );
};
