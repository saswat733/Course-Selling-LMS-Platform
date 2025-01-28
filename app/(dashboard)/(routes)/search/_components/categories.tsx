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
  FcCellPhone,
  FcRadarPlot,
  FcHome,
  FcSearch,
  FcList,
  FcPhone,
  FcViewDetails,
  FcBusinessman,
  FcManager,
  FcBarChart,
  FcGraduationCap,
  FcFolder,
  FcMoneyTransfer,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import { CategoryItem } from "./category-item";
import { ChartBarDecreasing, Cloud, Code, Gamepad, MapPinCheckInside, WholeWord } from "lucide-react";

interface CategoryProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Web Development": WholeWord,
  "Mobile Development": FcCellPhone,
  "Data Science": FcRadarPlot,
  "Artificial Intelligence": MapPinCheckInside, // Using FcBrain for AI
  "Machine Learning": FcRadarPlot, // Machine Learning can be represented similarly to Data Science
  Blockchain: FcHome, // Blockchain can be represented with a home-like icon
  "Cyber Security": FcSearch, // Search icon for Cyber Security
  "Cloud Computing": Cloud, // Using Cloud icon for Cloud Computing
  DevOps: FcList, // Using List icon for DevOps
  IoT: FcPhone, // IoT with a phone icon
  "Augmented Reality": FcViewDetails, // View details icon for Augmented Reality
  "Virtual Reality": FcViewDetails, // VR can also use ViewDetails
  "Game Development": Gamepad, // Gamepad for Game Development
  "UI/UX Design": ChartBarDecreasing, // Design Mode for UI/UX Design
  "Digital Marketing": FcMoneyTransfer, // Money icon for Digital Marketing
  Finance: FcMoneyTransfer, // Money icon for Finance
  Entrepreneurship: FcBusinessman, // Businessman for Entrepreneurship
  Business: FcSalesPerformance, // Sales Performance for Business
  Management: FcManager, // Manager icon for Management
  Leadership: FcBusinessman, // Businessman for Leadership
  Productivity: FcBarChart, // Bar Chart for Productivity
  "Personal Development": FcGraduationCap, // Graduation Cap for Personal Development
  "Career Development": FcSearch, // Search icon for Career Development
  Sales: FcSalesPerformance, // Sales Performance for Sales
  "Human Resources": FcBusinessman, // Businessman for HR
  Accounting: FcFolder, // Folder for Accounting
  "Project Management": FcList, // List for Project Management
  Agile: FcRadarPlot, // Radar Plot for Agile
  Scrum: FcRadarPlot, // Radar Plot for Scrum
  "Computer Science": Code, // Code for Computer Science
  Music: FcMusic, // Music icon
  Film: FcFilmReel, // Film Reel for Film
  Photography: FcOldTimeCamera, // Old Time Camera for Photography
  Sports: FcSportsMode, // Sports Mode for Sports
  Technology: FcMultipleDevices, // Multiple Devices for Technology
  Engineering: FcEngineering, // Engineering for Engineering
};

export const Categories = ({ items }: CategoryProps) => {
  return (
    <div className="flex items-center gap-x-2 gap-y-4 overflow-x-auto pb-2">
      {items.map((category: Category) => (
        <div key={category.id} className="w-1/2 md:w-1/3 lg:w-1/4">
          <CategoryItem
            label={category.name} // Use category.name for the label
            icon={iconMap[category.name] ?? FcEngineering} // Fallback icon if not found
            value={category.name}
          />
        </div>
      ))}
    </div>
  );
};
