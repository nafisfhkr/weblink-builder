"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import HeadingBlock from "./blocks/HeadingBlock";
import LinkBlock from "./blocks/LinkBlock";
import ImageBlock from "./blocks/ImageBlock";
import DividerBlock from "./blocks/DividerBlock";
import SocialBlock from "./blocks/SocialBlock";

interface BlockItem {
  id: string;
  type: "heading" | "link" | "image" | "divider" | "social";
  content: any;
  order: number;
}

interface CanvasBlockProps {
  block: BlockItem;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export default function CanvasBlock({ block, onUpdate, onDelete }: CanvasBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const renderBlockEditor = () => {
    switch (block.type) {
      case "heading":
        return (
          <HeadingBlock
            data={block.content || { title: "", bio: "" }}
            onChange={(newData) => onUpdate(block.id, newData)}
          />
        );
      case "link":
        return (
          <LinkBlock
            data={block.content || { title: "", url: "" }}
            onChange={(newData) => onUpdate(block.id, newData)}
          />
        );
      case "image":
        return (
          <ImageBlock
            data={block.content || { url: "", alt: "", storageKey: "" }}
            onChange={(newData) => onUpdate(block.id, newData)}
          />
        );
      case "divider":
        return (
          <DividerBlock
            data={block.content || {}}
            onChange={(newData) => onUpdate(block.id, newData)}
          />
        );
      case "social":
        return (
          <SocialBlock
            data={block.content || { items: [] }}
            onChange={(newData) => onUpdate(block.id, newData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-start gap-3 bg-[#121212] border ${isDragging ? 'border-teal-500 shadow-xl opacity-90' : 'border-zinc-900'} p-4 rounded-2xl mb-4 transition-all`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-zinc-600 active:cursor-grabbing p-1.5 mt-2 transition-colors">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        {renderBlockEditor()}
      </div>

      <button onClick={() => onDelete(block.id)} className="text-zinc-600 hover:text-red-500 p-2 mt-2 transition-colors cursor-pointer shrink-0">
        <Trash2 size={18} />
      </button>
    </div>
  );
}
