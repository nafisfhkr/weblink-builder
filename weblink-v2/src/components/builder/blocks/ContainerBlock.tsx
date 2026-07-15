"use client";

import React from "react";
import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";
import TextBlock from "./TextBlock";
import ButtonsBlock from "./ButtonsBlock";
import ImageBlock from "./ImageBlock";
import DividerBlock from "./DividerBlock";
import { getOptimizedImageUrl } from "src/lib/imageOptimization";

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface ContainerBlockProps {
  blockId?: string; // blockId is passed from renderer
  content: any;
  isEditor?: boolean;
  onUpdate?: (id: string, content: any) => void;
  onSelectChild?: (parentId: string, childId: string) => void;
}

// Sub-component wrapper for container children to handle sorting
interface ContainerChildWrapperProps {
  id: string;
  isEditor: boolean;
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  parentId?: string;
  onSelectChild?: (parentId: string, childId: string) => void;
}

function ContainerChildWrapper({
  id,
  isEditor,
  children,
  wrapperStyle = {},
  parentId,
  onSelectChild,
}: ContainerChildWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    ...wrapperStyle,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  };

  if (!isEditor) {
    return (
      <div style={style} className="w-full">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        if (parentId && onSelectChild) {
          e.stopPropagation();
          onSelectChild(parentId, id);
        }
      }}
      className={`group/child relative flex items-start gap-1 rounded-xl transition-all cursor-pointer ${
        isDragging
          ? "opacity-75 shadow-md bg-zinc-900/30 border border-zinc-800"
          : "hover:outline hover:outline-1 hover:outline-zinc-700/50"
      }`}
    >
      {/* Small drag handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/child:opacity-100 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 p-1 transition-all z-10 shrink-0"
      >
        <GripVertical size={14} />
      </div>

      {/* Child block content */}
      <div className="flex-1 min-w-0 select-none w-full py-1 pl-6">
        {children}
      </div>
    </div>
  );
}

export default function ContainerBlock({ blockId, content, isEditor = false, onUpdate, onSelectChild }: ContainerBlockProps) {
  const layout = content?.layout || "default";
  const columns = content?.columns || 2;
  const mobileStack = content?.mobileStack ?? true;
  const useCard = content?.useCard ?? false;
  const cardStyle = buildCardStyle(content);
  
  const bgType = content?.bgType || "none";
  const backgroundStyle: React.CSSProperties = {};
  if (bgType === "color") {
    backgroundStyle.backgroundColor = content?.bgColor || "#000000";
  } else if (bgType === "gradient") {
    const gradAngle = content?.gradAngle ?? 90;
    const gradColor1 = content?.gradColor1 || "#000000";
    const gradColor2 = content?.gradColor2 || "#333333";
    backgroundStyle.background = `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`;
  } else if (bgType === "image" && content?.bgImage) {
    backgroundStyle.backgroundImage = `url(${getOptimizedImageUrl(content.bgImage, { width: 1000, quality: "auto" })})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  }

  const paddingV = content?.paddingV ?? 16;
  const paddingH = content?.paddingH ?? 16;
  const radius = content?.radius ?? 16;
  const gutter = content?.gutter ?? 16;

  const borderStyle: React.CSSProperties = {
    borderStyle: content?.borderStyle !== "none" ? content?.borderStyle : "none",
    borderWidth: content?.borderStyle !== "none" ? `${content?.borderWidth || 1}px` : 0,
    borderColor: content?.borderColor || "#ffffff",
    borderRadius: `${radius}px`,
  };

  const containerStyle = {
    ...backgroundStyle,
    ...borderStyle,
  };

  const paddingStyle = {
    paddingTop: `${paddingV}px`,
    paddingBottom: `${paddingV}px`,
    paddingLeft: `${paddingH}px`,
    paddingRight: `${paddingH}px`,
  };

  const children = content?.children || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Crucial to prevent accidental drag on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !blockId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIndex = children.findIndex((c: any) => c.id === activeId);
    if (activeIndex === -1) return;

    const activeChild = children[activeIndex];
    let targetColumn = activeChild.column ?? 0;
    let newChildren = [...children];

    if (overId.startsWith("col-")) {
      // Dropped over empty column area
      const colIndexStr = overId.split("-")[1];
      targetColumn = colIndexStr ? parseInt(colIndexStr, 10) : 0;
      const updatedChild = { ...activeChild, column: targetColumn };
      newChildren.splice(activeIndex, 1);
      newChildren.push(updatedChild);
    } else {
      // Dropped over another item
      const overIndex = children.findIndex((c: any) => c.id === overId);
      if (overIndex !== -1) {
        targetColumn = children[overIndex].column ?? 0;
        const updatedChild = { ...activeChild, column: targetColumn };
        newChildren.splice(activeIndex, 1);
        
        const adjustedOverIndex = newChildren.findIndex((c: any) => c.id === overId);
        newChildren.splice(adjustedOverIndex, 0, updatedChild);
      }
    }

    onUpdate?.(blockId, { ...content, children: newChildren });
  };

  const renderChildBlock = (child: any) => {
    switch (child.type) {
      case "text":
        return <TextBlock content={child.content || {}} />;
      case "buttons":
        return <ButtonsBlock content={child.content || {}} />;
      case "image":
        return <ImageBlock content={child.content || {}} />;
      case "divider":
        return <DividerBlock data={child.content || {}} />;
      default:
        return null;
    }
  };

  const getWrapperStyle = (child: any): React.CSSProperties => {
    if (child.type === "divider") {
      const margin = child.content?.margin ?? 24;
      return {
        marginTop: `${margin}px`,
        marginBottom: `${margin}px`,
      };
    }
    return {};
  };

  let inner = null;
  if (layout === "columns") {
    const columnsContent = (
      <div style={containerStyle} className="w-full overflow-hidden">
        <div 
          className={`flex ${mobileStack ? "flex-col sm:flex-row" : "flex-row"} w-full`}
          style={{ ...paddingStyle, gap: `${gutter}px` }}
        >
          {Array.from({ length: columns }).map((_, i) => {
            const colChildren = children.filter((c: any) => (c.column ?? 0) === i);
            const childIds = colChildren.map((c: any) => c.id);
            return (
              <SortableContext key={i} id={`col-${i}`} items={childIds} strategy={verticalListSortingStrategy}>
                <div key={i} className="flex-1 flex flex-col gap-3 w-full min-w-0 min-h-[80px]">
                  {colChildren.map((child: any) => (
                    <ContainerChildWrapper
                      key={child.id}
                      id={child.id}
                      isEditor={isEditor}
                      wrapperStyle={getWrapperStyle(child)}
                      parentId={blockId}
                      onSelectChild={onSelectChild}
                    >
                      {renderChildBlock(child)}
                    </ContainerChildWrapper>
                  ))}
                  {isEditor && colChildren.length === 0 && (
                    <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-700/50 rounded-xl p-4 text-zinc-500 text-[10px] text-center min-h-[60px]">
                      Kolom {i + 1} Kosong
                    </div>
                  )}
                </div>
              </SortableContext>
            );
          })}
        </div>
      </div>
    );

    inner = isEditor ? (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {columnsContent}
      </DndContext>
    ) : (
      columnsContent
    );
  } else {
    const stackIds = children.map((c: any) => c.id);
    const stackContent = (
      <div style={{ ...containerStyle, ...paddingStyle }} className="w-full">
        <SortableContext id="col-0" items={stackIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 w-full min-h-[80px]">
            {children.map((child: any) => (
              <ContainerChildWrapper
                key={child.id}
                id={child.id}
                isEditor={isEditor}
                wrapperStyle={getWrapperStyle(child)}
                parentId={blockId}
                onSelectChild={onSelectChild}
              >
                {renderChildBlock(child)}
              </ContainerChildWrapper>
            ))}
            {isEditor && children.length === 0 && (
              <div className="w-full flex items-center justify-center border border-dashed border-zinc-700/50 rounded-xl p-6 text-zinc-500 text-xs text-center min-h-[80px]">
                Wadah Kosong (Klik untuk isi)
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    );

    inner = isEditor ? (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {stackContent}
      </DndContext>
    ) : (
      stackContent
    );
  }

  if (!useCard) return inner;

  return (
    <div
      className={`w-full ${cardWrapperClass(true)} p-2`}
      style={cardStyle}
    >
      {inner}
    </div>
  );
}
