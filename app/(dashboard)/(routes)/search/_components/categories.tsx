"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import { CategoryItem } from "./category-item";

interface CategoryProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Film: FcFilmReel,
  Photography: FcOldTimeCamera,
  Sports: FcSportsMode,
  Technology: FcMultipleDevices,
  Engineering: FcEngineering,
  Business: FcSalesPerformance,
};

export const Categories = ({ items }: CategoryProps) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-4 overflow-x-auto pb-2">
      {items.map((category: Category) => (
        <div key={category.id} className="w-1/2 md:w-1/3 lg:w-1/4">
          <CategoryItem
            label={category.name}
            icon={iconMap[category.name] ?? FcEngineering} // Fallback icon
            value={category.name}
          />
        </div>
      ))}
    </div>
  );
};
