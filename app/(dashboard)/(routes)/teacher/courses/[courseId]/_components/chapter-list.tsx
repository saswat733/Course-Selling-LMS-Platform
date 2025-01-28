"use client";
import { Chapter } from "@prisma/client";
import { useEffect, useState, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {  Grip, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Badge} from '@/components/ui/badge'

interface ChapterListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  items: Chapter[];
  onDelete: (chapterId: string) => void;
}

const ChapterList = ({ onEdit, onReorder, items,onDelete }: ChapterListProps) => {
  const [chapters, setChapters] = useState<Chapter[]>(items);

  // Update chapters when the items prop changes
  useEffect(() => {
    setChapters(items);
  }, [items]);

  // Memoize the chapters array to avoid unnecessary renders
  const memoizedChapters = useMemo(() => chapters, [chapters]);

  const handleDragEnd = (result: DropResult) => {
   if(!result.destination){
     return;
   }

   const items=Array.from(chapters);
   const [reorderedItem]=items.splice(result.source.index,1);
   items.splice(result.destination.index,0,reorderedItem);

   const startIndex=Math.min(result.source.index,result.destination.index);
   const endIndex=Math.max(result.source.index,result.destination.index);

   const updatedChapters=items.slice(startIndex,endIndex+1)

   setChapters(items);

   const bulkUpdateData=updatedChapters.map((chapter)=>({
    id:chapter.id,
    position:items.findIndex((item)=>item.id===chapter.id)
   }))

   onReorder(bulkUpdateData)
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {memoizedChapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "flex justify-between items-center p-2 border-b border-gray-200"
                    )}
                  >
                    <Grip className="mx-2 text-slate-500" />
                    <div className="flex items-center gap-x-2">
                      <p className={cn("font-semibold text-slate-500")}>{chapter.title}</p>
                    </div>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge className="text-green-500">Free</Badge>
                      )}
                      <Badge
                        className={cn(
                          "text-white",
                          chapter.isPublished ? "bg-sky-700" : "bg-slate-500"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => onEdit(chapter.id)}
                        className={cn("text-blue-500")}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
        <p className="text-slate-500 italic">Drag and drop to rearrage the chapters.</p>
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
