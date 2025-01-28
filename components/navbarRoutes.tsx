"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes=()=>{
    const pathname=usePathname()

    const isTeahcer=pathname?.startsWith("/teacher")
    const isCoursePage=pathname?.startsWith("/course")
    const isSearchPage=pathname==="/search"

    return (
      <>
      {
        isSearchPage && (
            <div className="hidden ml-56 md:block">
                <SearchInput/>
            </div>
        )
      }
        <div className="p-6 flex justify-center gap-x-2 items-center ml-auto">
          {isTeahcer || isCoursePage ? (
            <Link href={"/"}>
              <Button size={"sm"} variant={"ghost"}>
                <LogOut className="h-4 w-4 mr-1" />
                Exit
              </Button>
            </Link>
          ) : (
            <Link href={"/teacher/courses"}>
              <Button size={"sm"} variant={"ghost"}>
                Become a Teacher
              </Button>
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    );
}