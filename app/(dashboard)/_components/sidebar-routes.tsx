'use client'
import { BarChart, Compass, Layout, List, SearchCheck } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

const guestsroutes: SidebarItemProps[] = [
    { icon: Layout, label: 'Dashboard', href: '/' },
    { icon: Compass, label: 'Browse', href: '/search' },
];


const teacherRoutes: SidebarItemProps[] = [
    { icon: List, label: 'Course', href: '/teacher/courses' },
    { icon: SearchCheck, label: 'Browse', href: '/search' },
];


export const SideBarRoutes = () => {
    const router=useRouter()
    const pathname=usePathname()

    const isTeacherPage=pathname?.startsWith("/teacher")

    const routes=isTeacherPage?teacherRoutes:guestsroutes

    return (
        <div className='flex flex-col w-full'>
            {routes.map((route, index) => {
                const isActive = pathname === route.href;
                return (
                    <div
                        key={index}
                        className={`flex items-center h-full p-4 cursor-pointer ${
                            isActive ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'
                        }`}
                    >
                        <Link href={route.href} className='flex items-center' aria-label={route.label}>
                            <route.icon className='w-6 h-6' />
                            <span className='ml-4'>{route.label}</span>
                        </Link>
                        <div className={cn("ml-auto opacity-0 border-2 border-black h-full transition-all",isActive && "opacity-100")} />
                    </div>
                );
            })}
        </div>
    );
};
