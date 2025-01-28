import { Menu } from "lucide-react"

import { Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle,SheetTrigger } from "@/components/ui/sheet"
import { SideBar } from "./SideBar"

export const MobileSidebar=()=>{
    return (
        <>
        <Sheet>
         <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
         <Menu/>
         </SheetTrigger>
         <SheetContent side={"left"} className="p-0 bg-white">
            <div className="hidden">

            <SheetTitle >
                Menu
            </SheetTitle>
            </div>
           <SideBar/>
         </SheetContent>

        </Sheet>
        </>
    )
}