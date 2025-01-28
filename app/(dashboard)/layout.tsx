import React from 'react'
import { SideBar } from './_components/SideBar'
import { Navbar } from './_components/Navbar'
const DashBoardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='h-full'>
      <div className="w-full h-[74px] ">
        <Navbar/>
      </div>
        <div className="h-full w-56 hidden md:flex flex-col fixed inset-y-0 z-50">
            <SideBar/>
        </div>
        <main className='md:pl-56'>
          {children}
        </main>
    </div>
  )
}

export default DashBoardLayout