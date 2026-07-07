"use client";

import { useState, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import CanvasBlock from "./CanvasBlock";
import { Plus } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  order: number;
}

export default function BuilderCanvas({ initialData }: { initialData: any }) {
  const [links, setLinks] = useState<LinkItem[]>(() => {
    // Parse linksData from JSON database column safely
    if (typeof initialData.linksData === 'string') {
      try {
        return JSON.parse(initialData.linksData);
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(initialData.linksData)) {
      return initialData.linksData as LinkItem[];
    }
    return [];
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const autoSave = useCallback(async (newLinks: LinkItem[]) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/project/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linksData: newLinks }),
      });
      if (!res.ok) {
        console.error("Auto-save responded with error:", res.statusText);
      }
    } catch (error) {
      console.error("Auto-save request failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [initialData.id]);

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: nanoid(),
      title: "My New Link",
      url: "https://example.com",
      order: links.length,
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    autoSave(updatedLinks);
  };

  const handleUpdateLink = (id: string, field: "title" | "url", value: string) => {
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
    autoSave(updatedLinks);
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    autoSave(updatedLinks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }));
        autoSave(reordered);
        return reordered;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{initialData.title}</h1>
          <p className="text-sm text-gray-500">/{initialData.slug}</p>
        </div>
        <span className="text-sm text-gray-400 font-mono">
          {isSaving ? "Saving..." : "All changes saved"}
        </span>
      </header>

      <button 
        onClick={handleAddLink}
        className="w-full flex items-center justify-center gap-2 bg-[#00e59b] hover:bg-[#00c785] text-black py-3.5 rounded-xl mb-8 font-semibold transition-colors cursor-pointer"
      >
        <Plus size={20} /> Add New Link
      </button>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {links.map((link) => (
              <CanvasBlock 
                key={link.id} 
                link={link} 
                onUpdate={handleUpdateLink} 
                onDelete={handleDeleteLink} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
