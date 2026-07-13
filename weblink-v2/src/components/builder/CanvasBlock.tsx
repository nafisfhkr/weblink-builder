"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import TextBlock from "./blocks/TextBlock";
import ContainerBlock from "./blocks/ContainerBlock";
import ButtonsBlock from "./blocks/ButtonsBlock";
import ImageBlock from "./blocks/ImageBlock";
import DividerBlock from "./blocks/DividerBlock";

interface BlockItem {
  id: string;
  type: "text" | "container" | "buttons" | "image" | "divider";
  content: any;
  order: number;
}

interface CanvasBlockProps {
  block: BlockItem;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}

export default function CanvasBlock({
  block,
  onDelete,
  isSelected,
  onSelect,
  children,
}: CanvasBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(block.type === "divider" ? {
      marginTop: `${block.content?.margin ?? 24}px`,
      marginBottom: `${block.content?.margin ?? 24}px`,
    } : {}),
    ...(isSelected
      ? {
          outline: "2px solid rgba(20, 184, 166, 0.8)",
          outlineOffset: "2px",
        }
      : {}),
  };



  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
      className={`group relative flex items-start gap-2 rounded-2xl transition-all cursor-pointer ${
        isDragging
          ? "opacity-90 shadow-xl"
          : isSelected
          ? "shadow-teal-900/30 shadow-lg"
          : "hover:outline hover:outline-1 hover:outline-zinc-700"
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 p-1 transition-all z-10 shrink-0"
      >
        <GripVertical size={16} />
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0 pointer-events-none select-none w-full">
        {children}
      </div>
    </div>
  );
}
