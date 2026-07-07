"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import InlineEditableField from "./InlineEditableField";

interface CanvasBlockProps {
  link: { id: string; title: string; url: string; order: number };
  onUpdate: (id: string, field: "title" | "url", value: string) => void;
  onDelete: (id: string) => void;
}

export default function CanvasBlock({ link, onUpdate, onDelete }: CanvasBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-3 bg-[#121212] border ${isDragging ? 'border-blue-500 shadow-xl opacity-90' : 'border-gray-800'} p-4 rounded-xl mb-3`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-gray-500 active:cursor-grabbing p-1">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <InlineEditableField 
          value={link.title} 
          onSave={(val) => onUpdate(link.id, "title", val)} 
          placeholder="Enter link title..."
        />
        <div className="text-sm text-gray-400">
          <InlineEditableField 
            value={link.url} 
            onSave={(val) => onUpdate(link.id, "url", val)} 
            placeholder="https://example.com"
            isUrl={true}
          />
        </div>
      </div>

      <button onClick={() => onDelete(link.id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors cursor-pointer">
        <Trash2 size={18} />
      </button>
    </div>
  );
}
