import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams?: {
    title?: string;
    categoryId?: string;
  };
}

const SearchPage = async ({ searchParams = {} }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Extract and provide default values for searchParams
  const { title = "", categoryId = "" } = searchParams;

  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch courses
  const courses = await getCourses({
    userId,
    title,
    categoryId,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
