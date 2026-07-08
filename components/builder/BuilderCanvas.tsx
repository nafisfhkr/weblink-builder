"use client";

import { useState, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { UploadCloud } from "lucide-react";
import CanvasBlock from "./CanvasBlock";
import BlockPicker from "./BlockPicker";
import PublishButton from "./PublishButton";

interface BlockItem {
  id: string;
  type: "heading" | "link" | "image" | "divider" | "social";
  content: any;
  order: number;
}

export default function BuilderCanvas({ initialData }: { initialData: any }) {
  const [blocks, setBlocks] = useState<BlockItem[]>(() => {
    if (typeof initialData.blocksData === 'string') {
      try {
        return JSON.parse(initialData.blocksData);
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(initialData.blocksData)) {
      return initialData.blocksData as BlockItem[];
    }
    return [];
  });

  const [publishedBlocks, setPublishedBlocks] = useState<BlockItem[]>(() => {
    if (typeof initialData.publishedBlocksData === 'string') {
      try {
        return JSON.parse(initialData.publishedBlocksData);
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(initialData.publishedBlocksData)) {
      return initialData.publishedBlocksData as BlockItem[];
    }
    return [];
  });

  const [isPublished, setIsPublished] = useState<boolean>(initialData.isPublished);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasDragOver, setCanvasDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const autoSave = useCallback(async (newBlocks: BlockItem[]) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/project/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocksData: newBlocks }),
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

  const handleAddBlock = (type: "heading" | "link" | "image" | "divider" | "social") => {
    if (type === "link") {
      const linkCount = blocks.filter(b => b.type === "link").length;
      if (linkCount >= 15) {
        alert("Batas maksimal adalah 15 tautan");
        return;
      }
    }

    let defaultContent: any = {};
    if (type === "heading") {
      defaultContent = { title: "Halo, saya " + (initialData.title || "User"), bio: "Selamat datang di halaman saya" };
    } else if (type === "link") {
      defaultContent = { title: "Hubungi Saya", url: "https://example.com" };
    } else if (type === "image") {
      defaultContent = { url: "", alt: "", storageKey: "" };
    } else if (type === "social") {
      defaultContent = { items: [] };
    } else if (type === "divider") {
      defaultContent = {};
    }

    const newBlock: BlockItem = {
      id: nanoid(),
      type,
      content: defaultContent,
      order: blocks.length,
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    autoSave(updatedBlocks);
  };

  const handleUpdateBlock = (id: string, content: any) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updatedBlocks);
    autoSave(updatedBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    autoSave(updatedBlocks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
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

  // Support dragging file directly onto the canvas to create an image block
  const handleCanvasDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setCanvasDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Format file tidak didukung (gunakan JPG/PNG/WebP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file melebihi 5MB");
        return;
      }

      const newBlockId = nanoid();
      // Temporary block showing upload state
      const tempBlock: BlockItem = {
        id: newBlockId,
        type: "image",
        content: { url: "", alt: "Uploading...", storageKey: "" },
        order: blocks.length,
      };

      const withTempBlock = [...blocks, tempBlock];
      setBlocks(withTempBlock);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Gagal mengunggah");
        const uploadResult = await res.json();

        const updated = withTempBlock.map(b => 
          b.id === newBlockId 
            ? { ...b, content: { url: uploadResult.url, alt: "", storageKey: uploadResult.storageKey } } 
            : b
        );
        setBlocks(updated);
        autoSave(updated);
      } catch (err) {
        console.error(err);
        alert("Gagal mengunggah file dari drop kanvas");
        const updated = withTempBlock.filter(b => b.id !== newBlockId);
        setBlocks(updated);
        autoSave(updated);
      }
    }
  };

  const hasChanges = JSON.stringify(blocks) !== JSON.stringify(publishedBlocks);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true); }}
      onDragLeave={() => setCanvasDragOver(false)}
      onDrop={handleCanvasDrop}
      className="relative max-w-2xl mx-auto py-12 px-6 font-sans min-h-screen"
    >
      {canvasDragOver && (
        <div className="absolute inset-0 bg-teal-950/25 border-2 border-dashed border-teal-500 rounded-3xl flex items-center justify-center pointer-events-none z-30 backdrop-blur-sm m-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col items-center gap-2 shadow-2xl">
            <UploadCloud className="text-[#00e59b] animate-bounce" size={32} />
            <span className="text-sm font-semibold text-white">Lepaskan untuk Menambahkan Gambar</span>
          </div>
        </div>
      )}

      <header className="mb-8 flex items-center justify-between border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{initialData.title}</h1>
          <p className="text-sm text-zinc-500">/{initialData.slug}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 font-mono">
            {isSaving ? "Saving..." : "All changes saved"}
          </span>
          <PublishButton 
            projectId={initialData.id}
            isPublished={isPublished}
            hasChanges={hasChanges}
            onPublishSuccess={(updatedProject) => {
              setIsPublished(true);
              setPublishedBlocks(blocks);
            }}
          />
        </div>
      </header>

      <BlockPicker onSelectBlock={handleAddBlock} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map((block) => (
              <CanvasBlock 
                key={block.id} 
                block={block} 
                onUpdate={handleUpdateBlock} 
                onDelete={handleDeleteBlock} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
