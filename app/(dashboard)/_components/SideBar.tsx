import { Logo } from "./logo"
import { SideBarRoutes } from "./sidebar-routes"

export const  SideBar=()=>{
    return (
        <div className="h-full border-r-2 flex flex-col overflow-y-auto bg-white shadow-sm">
           <div className="p-6 border-b-2">
               <Logo/>
           </div>
           <div className="flex flex-col w-full">
            <SideBarRoutes/>
           </div>
        </div>
    )
}