"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import HeadingBlock from "./blocks/HeadingBlock";
import TextBlock from "./blocks/TextBlock";
import LinkBlock from "./blocks/LinkBlock";
import ImageBlock from "./blocks/ImageBlock";
import DividerBlock from "./blocks/DividerBlock";
import SocialBlock from "./blocks/SocialBlock";

interface BlockItem {
  id: string;
  type: "heading" | "text" | "link" | "image" | "divider" | "social";
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
  cardStyle?: React.CSSProperties;
  cardShowHeadingCard?: boolean;
}

export default function CanvasBlock({ 
  block, 
  onDelete, 
  isSelected, 
  onSelect, 
  isPreviewMode, 
  uploadingBlockIds,
  cardStyle,
  cardShowHeadingCard
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

  const combinedStyle = {
    ...style,
    ...cardStyle,
    ...(isSelected ? {
      borderColor: "#14b8a6",
      boxShadow: "0 0 0 1px rgba(20, 184, 166, 0.4), 0 10px 15px -3px rgba(20, 184, 166, 0.3)",
    } : {}),
  };

  const renderBlock = () => {
    switch (block.type) {
      case "heading":
        if (block.content?.useCard === true || (block.content?.useCard !== false && cardShowHeadingCard)) {
          return (
            <div 
              style={cardStyle}
              className="w-full text-center border p-5 rounded-2xl mb-1 transition-all shadow-md"
            >
              <HeadingBlock content={block.content || {}} textColor={cardStyle?.color} textSize={block.content?.textSize} />
            </div>
          );
        }
        return <HeadingBlock content={block.content || {}} textColor={cardStyle?.color} textSize={block.content?.textSize} />;
      case "text":
        if (block.content?.useCard === true) {
          return (
            <div 
              style={cardStyle}
              className="w-full text-center border p-5 rounded-2xl mb-1 transition-all shadow-md"
            >
              <TextBlock content={block.content || {}} textColor={cardStyle?.color} textSize={block.content?.textSize} />
            </div>
          );
        }
        return <TextBlock content={block.content || {}} textColor={cardStyle?.color} textSize={block.content?.textSize} />;
      case "link":
        return <LinkBlock content={block.content || {}} cardStyle={cardStyle} />;
      case "image":
        return (
          <ImageBlock
            content={block.content || {}}
            isUploading={uploadingBlockIds?.has(block.id)}
            cardStyle={cardStyle}
            useCard={block.content?.useCard}
          />
        );
      case "divider":
        return <DividerBlock data={block.content || {}} onChange={() => {}} />;
      case "social":
        return <SocialBlock content={block.content || {}} cardStyle={cardStyle} useCard={block.content?.useCard} />;
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
      style={combinedStyle}
      onClick={() => onSelect(block.id)}
      className={`group flex items-start gap-3 border p-4 rounded-2xl mb-4 transition-all cursor-pointer ${
        isDragging
          ? "opacity-90 shadow-xl"
          : isSelected
          ? "ring-1 ring-teal-500/40 shadow-teal-900/30 shadow-lg"
          : "hover:border-zinc-700"
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
