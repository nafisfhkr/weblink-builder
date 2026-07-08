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
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPreviewMode: boolean;
  uploadingBlockIds?: Set<string>;
}

export default function CanvasBlock({ block, onDelete, isSelected, onSelect, isPreviewMode, uploadingBlockIds }: CanvasBlockProps) {
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

  const renderBlock = () => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock content={block.content || {}} />;
      case "link":
        return <LinkBlock content={block.content || {}} />;
      case "image":
        return (
          <ImageBlock
            content={block.content || {}}
            isUploading={uploadingBlockIds?.has(block.id)}
          />
        );
      case "divider":
        return <DividerBlock data={block.content || {}} onChange={() => {}} />;
      case "social":
        return <SocialBlock content={block.content || {}} />;
      default:
        return null;
    }
  };

  if (isPreviewMode) {
    return (
      <div ref={setNodeRef} style={style}>
        {renderBlock()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(block.id)}
      className={`group flex items-start gap-3 border p-4 rounded-2xl mb-4 transition-all cursor-pointer ${
        isDragging
          ? "border-teal-500 shadow-xl opacity-90 bg-[#121212]"
          : isSelected
          ? "border-teal-500 ring-1 ring-teal-500/40 bg-[#0f1f1f] shadow-teal-900/30 shadow-lg"
          : "border-zinc-900 bg-[#121212] hover:border-zinc-700"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab hover:text-white text-zinc-600 active:cursor-grabbing p-1.5 mt-2 transition-colors shrink-0"
      >
        <GripVertical size={20} />
      </div>

      {/* Block Content */}
      <div className="flex-1 min-w-0 pointer-events-none select-none">
        {renderBlock()}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(block.id);
        }}
        className="text-zinc-700 hover:text-red-500 p-2 mt-2 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
        aria-label="Hapus blok"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
