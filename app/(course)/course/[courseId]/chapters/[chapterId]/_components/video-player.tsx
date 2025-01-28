"use client"

import axios from "axios"
import MuxPlayer from "@mux/mux-player-react"
import { useEffect, useState } from "react"
import { Toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Loader2,Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfettiStore } from "@/hooks/use-confetti-store"

interface VideoPlayerProps {
    courseId:string;
    chapterId:string;
    nextChapterId?:string;
    isLocked:boolean;
    completeOnEnd:boolean;
    title:string;
    playbackId:string;
};

export const VideoPlayer=({
     courseId,
     chapterId,
        nextChapterId,
        isLocked,
        completeOnEnd,
        title,
        playbackId,
}:VideoPlayerProps)=>{

    const [isReady ,setisReady]=useState(false)
    const [isLoading, setisLoading] = useState(false)

    useEffect(()=>{
        setisLoading(true)
    },[])

    if(!isLoading){
        return (
            <div className="felx flex-col items-center justify-center gap-4 p-4 text-4xl">
            Loading...
            </div>
        )
    }

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                </div>
            )}
            {
                isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                        <Lock className="h-8 w-8"/>
                        <p className="text-sm">
                            This chapter is locked
                        </p>
                    </div>
                )
            }
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={()=>setisReady(true)}
                    onEnded={()=>{}}
                    autoPlay
                    playbackId={playbackId}
                />
            )
            
            }
        
        </div>
    )
}