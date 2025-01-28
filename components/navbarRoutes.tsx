"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes=()=>{
    const pathname=usePathname()

    const isTeahcer=pathname?.startsWith("/teacher")
    const isChapterPage=pathname?.startsWith("/chapter")

    return (
        <div className="p-6 flex justify-center gap-x-2 items-center ml-auto">
            {
                isTeahcer || isChapterPage?(
                    <Link href={"/"}>

                    <Button size={"sm"} variant={"ghost"}>
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                    </Link>
                ):(
                    <Link href={"/teacher/courses"}>
                        <Button size={"sm"} variant={"ghost"}>
                            Become a
                            Teacher
                        </Button>
                    </Link>
                )

            }
            <UserButton
            afterSignOutUrl="/"
            />
        </div>
    )
}