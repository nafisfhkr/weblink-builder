"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { UploadCloud, ArrowLeft, Check, Copy, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import CanvasBlock from "./CanvasBlock";
import BlockPicker from "./BlockPicker";
import PublishButton from "./PublishButton";
import FloatingToolbar from "./FloatingToolbar";
import ContextualSidebar from "./ContextualSidebar";
import { useToast } from "src/components/ui/Toast";
import type { PageSettings } from "./BackgroundPicker";
import { processImageToBase64 } from "src/lib/imageProcessor";

interface BlockItem {
  id: string;
  type: "text" | "container" | "buttons" | "image" | "divider";
  content: any;
  order: number;
}

export default function BuilderCanvas({ initialData }: { initialData: any }) {
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${initialData.slug}` : `/${initialData.slug}`;

  // --- Block State ---
  const [blocks, setBlocks] = useState<BlockItem[]>(() => {
    if (typeof initialData.blocksData === "string") {
      try { return JSON.parse(initialData.blocksData); } catch { return []; }
    }
    if (Array.isArray(initialData.blocksData)) return initialData.blocksData as BlockItem[];
    return [];
  });

  const [publishedBlocks, setPublishedBlocks] = useState<BlockItem[]>(() => {
    if (typeof initialData.publishedBlocksData === "string") {
      try { return JSON.parse(initialData.publishedBlocksData); } catch { return []; }
    }
    if (Array.isArray(initialData.publishedBlocksData)) return initialData.publishedBlocksData as BlockItem[];
    return [];
  });

  // --- Undo/Redo ---
  const [undoStack, setUndoStack] = useState<BlockItem[][]>([]);
  const [redoStack, setRedoStack] = useState<BlockItem[][]>([]);

  const pushToHistory = (prevBlocks: BlockItem[]) => {
    setUndoStack((stack) => [...stack.slice(-29), prevBlocks]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    if (!prev) return;
    setRedoStack((stack) => [...stack, blocks]);
    setUndoStack((stack) => stack.slice(0, -1));
    setBlocks(prev);
    autoSave(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    if (!next) return;
    setUndoStack((stack) => [...stack, blocks]);
    setRedoStack((stack) => stack.slice(0, -1));
    setBlocks(next);
    autoSave(next);
  };

  // --- UI States ---
  const [isPublished, setIsPublished] = useState<boolean>(initialData.isPublished);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasDragOver, setCanvasDragOver] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [uploadingBlockIds, setUploadingBlockIds] = useState<Set<string>>(new Set());
  const [showPageSettings, setShowPageSettings] = useState(false);

  // --- Page Settings (Background) ---
  const [pageSettings, setPageSettings] = useState<PageSettings>(() => {
    try {
      if (typeof initialData.pageSettings === "string") return JSON.parse(initialData.pageSettings);
      if (typeof initialData.pageSettings === "object" && initialData.pageSettings !== null) return initialData.pageSettings;
    } catch {}
    return { type: "color", color: "#ffffff" };
  });

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  // Compute background CSS style for canvas
  const bgStyle: React.CSSProperties =
    pageSettings.type === "image" && pageSettings.imageUrl
      ? { backgroundImage: `url(${pageSettings.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
      : pageSettings.type === "gradient" && pageSettings.gradient
      ? { background: pageSettings.gradient }
      : { backgroundColor: pageSettings.color || "#ffffff" };

  // --- DnD Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Auto-Save ---
  const abortControllerRef = useRef<AbortController | null>(null);

  const autoSave = useCallback(
    async (newBlocks: BlockItem[]) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSaving(true);
      try {
        const res = await fetch(`/api/project/${initialData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocksData: newBlocks }),
          signal: controller.signal,
        });
        if (!res.ok) {
          showToast("Koneksi gagal, mencoba menyimpan ulang", "error");
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          showToast("Koneksi gagal, mencoba menyimpan ulang", "error");
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setIsSaving(false);
        }
      }
    },
    [initialData.id, showToast]
  );

  const autoSavePageSettings = useCallback(
    async (newSettings: PageSettings) => {
      try {
        await fetch(`/api/project/${initialData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageSettings: newSettings }),
        });
      } catch {
        showToast("Gagal menyimpan pengaturan background", "error");
      }
    },
    [initialData.id, showToast]
  );

  const handlePageSettingsChange = useCallback(
    (newSettings: PageSettings) => {
      setPageSettings(newSettings);
      autoSavePageSettings(newSettings);
    },
    [autoSavePageSettings]
  );

  // --- Block Actions ---
  const applyUpdate = (newBlocks: BlockItem[], prevBlocks: BlockItem[]) => {
    pushToHistory(prevBlocks);
    setBlocks(newBlocks);
    autoSave(newBlocks);
  };

  const handleAddBlock = (type: "text" | "container" | "buttons" | "image" | "divider") => {
    const defaultContent: Record<string, any> = {
      text: { text: "Tulis paragraf atau deskripsi Anda di sini..." },
      container: { layout: "default" },
      buttons: { items: [{ id: nanoid(), label: "Tombol Saya", url: "https://", bgColor: "#14b8a6", textColor: "#ffffff" }] },
      image: { url: "", alt: "", title: "", storageKey: "" },
      divider: { style: "single", orientation: "horizontal", color: "#52525b", width: 80, thickness: 1, margin: 24 },
    };

    const newBlock: BlockItem = {
      id: nanoid(),
      type,
      content: defaultContent[type] ?? {},
      order: blocks.length,
    };

    const updated = [...blocks, newBlock];
    applyUpdate(updated, blocks);
    setSelectedBlockId(newBlock.id);
    setShowBlockPicker(false);
  };

  const handleDuplicateBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newBlock: BlockItem = { ...block, id: nanoid(), order: blocks.length };
    const updated = [...blocks, newBlock];
    applyUpdate(updated, blocks);
  };

  const handleUpdateBlock = (id: string, content: any) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content } : b));
    setBlocks(updated);
    autoSave(updated);
  };


  const handleDeleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    applyUpdate(updated, blocks);
    if (selectedBlockId === id) setSelectedBlockId(null);
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
        pushToHistory(items);
        autoSave(reordered);
        return reordered;
      });
    }
  };

  // --- Canvas OS-level File Drop ---
  const handleCanvasDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setCanvasDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        showToast("Format file tidak didukung, gunakan JPG/PNG/WebP", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Ukuran file melebihi 5MB", "error");
        return;
      }

      const newBlockId = nanoid();
      const tempBlock: BlockItem = {
        id: newBlockId,
        type: "image",
        content: { url: "", alt: "", storageKey: "" },
        order: blocks.length,
      };
      const withTemp = [...blocks, tempBlock];
      setBlocks(withTemp);
      setUploadingBlockIds((s) => new Set(s).add(newBlockId));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResult = await processImageToBase64(file);
        const updated = withTemp.map((b) =>
          b.id === newBlockId
            ? { ...b, content: { url: uploadResult.url, alt: "", storageKey: uploadResult.storageKey } }
            : b
        );
        pushToHistory(blocks);
        setBlocks(updated);
        autoSave(updated);
        showToast("Gambar berhasil diunggah", "success");
      } catch {
        showToast("Upload foto gagal, coba lagi", "error");
        setBlocks(withTemp.filter((b) => b.id !== newBlockId));
      } finally {
        setUploadingBlockIds((s) => { const ns = new Set(s); ns.delete(newBlockId); return ns; });
      }
    }
  };

  const hasChanges = JSON.stringify(blocks) !== JSON.stringify(publishedBlocks);

  // Helper to convert hex and opacity to rgba
  const hexToRgba = (hex: string = "#121212", opacityPercentage: number = 100) => {
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c.charAt(0) + c.charAt(0) + c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2);
    }
    const r = parseInt(c.substring(0, 2), 16) || 18;
    const g = parseInt(c.substring(2, 4), 16) || 18;
    const b = parseInt(c.substring(4, 6), 16) || 18;
    const alpha = opacityPercentage / 100;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardBg = hexToRgba(pageSettings.cardBgColor || "#ffffff", pageSettings.cardBgOpacity ?? 10);
  const cardBorder = hexToRgba(pageSettings.cardBorderColor || "#ffffff", pageSettings.cardBorderOpacity ?? 20);
  const cardText = pageSettings.cardTextColor || "#ffffff";
  const cardBlur = pageSettings.cardBlur !== undefined ? `${pageSettings.cardBlur}px` : "10px";

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    color: cardText,
    backdropFilter: cardBlur !== "0px" ? `blur(${cardBlur})` : undefined,
    WebkitBackdropFilter: cardBlur !== "0px" ? `blur(${cardBlur})` : undefined,
  };

  // Editor: max-w-2xl centered. Preview Desktop: truly full-screen. Preview Mobile: narrow (handled via wrapper).
  const canvasWidth = isPreviewMode ? (isMobileView ? "max-w-[390px]" : "w-full max-w-none") : "max-w-2xl";

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Floating Toolbar */}
      <FloatingToolbar
        onAddBlock={() => { setShowBlockPicker((v) => !v); setSelectedBlockId(null); setShowPageSettings(false); }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => { setIsPreviewMode((v) => !v); setSelectedBlockId(null); setShowPageSettings(false); }}
        isMobileView={isMobileView}
        onToggleMobile={() => setIsMobileView((v) => !v)}
        isBackgroundOpen={showPageSettings}
        onToggleBackground={() => { setShowPageSettings((v) => !v); setSelectedBlockId(null); setShowBlockPicker(false); }}
        publishButton={
          <PublishButton
            projectId={initialData.id}
            isPublished={isPublished}
            hasChanges={hasChanges}
            onPublishSuccess={() => {
              setIsPublished(true);
              setPublishedBlocks(blocks);
              setShowPublishModal(true);
            }}
          />
        }
      />

      {/* Contextual Sidebar */}
      {!isPreviewMode && (
        <ContextualSidebar
          selectedBlock={selectedBlock}
          onUpdate={handleUpdateBlock}
          onDelete={handleDeleteBlock}
          onDuplicate={handleDuplicateBlock}
          onClose={() => { setSelectedBlockId(null); setShowPageSettings(false); }}
          onImageUploadStart={(id) => setUploadingBlockIds((s) => new Set(s).add(id))}
          onImageUploadEnd={(id) => setUploadingBlockIds((s) => { const ns = new Set(s); ns.delete(id); return ns; })}
          showPageSettings={showPageSettings}
          pageSettings={pageSettings}
          onPageSettingsChange={handlePageSettingsChange}
        />
      )}

      {/* Block Picker Sidebar */}
      {showBlockPicker && !isPreviewMode && (
        <BlockPicker 
          onSelectBlock={handleAddBlock} 
          onClose={() => setShowBlockPicker(false)} 
        />
      )}

      {/* Canvas Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true); }}
        onDragLeave={() => setCanvasDragOver(false)}
        onDrop={handleCanvasDrop}
        onClick={() => { setSelectedBlockId(null); setShowBlockPicker(false); setShowPageSettings(false); }}
        className={`relative ${canvasWidth} mx-auto ${
          isPreviewMode && isMobileView
            ? "min-h-screen py-16 shadow-2xl overflow-hidden"
            : isPreviewMode
            ? "min-h-screen py-16 px-0"
            : "py-12 px-6 min-h-screen"
        } font-sans transition-all duration-300`}
        style={{ ...bgStyle, fontFamily: pageSettings.fontFamily || 'inherit' }}
      >
        {/* Dark overlay for backgrounds */}
        {((pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 0) > 0) && (
          <div 
            className="absolute inset-0 pointer-events-none z-0" 
            style={{ backgroundColor: `rgba(0, 0, 0, ${(pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 0) / 100})` }}
          />
        )}
        {/* Canvas OS Drop Overlay */}
        {canvasDragOver && (
          <div className="absolute inset-0 bg-teal-950/25 border-2 border-dashed border-teal-500 rounded-3xl flex items-center justify-center pointer-events-none z-30 backdrop-blur-sm m-4">
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col items-center gap-2 shadow-2xl">
              <UploadCloud className="text-teal-400 animate-bounce" size={32} />
              <span className="text-sm font-semibold text-white">Lepaskan untuk Menambahkan Gambar</span>
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="w-full max-w-2xl mx-auto px-4 md:px-8 pb-20 flex flex-col items-center">
          {/* Profile / Header Section in Canvas */}
          {pageSettings.showProfile !== false && (
            <div className="w-full flex flex-col items-center relative z-10 mb-8" style={{ gap: `${pageSettings.blockSpacing ?? 16}px` }}>
              {pageSettings.profileImageUrl || initialData.user?.image ? (
                <img 
                  src={pageSettings.profileImageUrl || initialData.user?.image || ""} 
                  alt={pageSettings.profileTitle || "Profile"} 
                  className="w-16 h-16 rounded-full border shadow-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-200 border shadow-xl" />
              )}

              <div className="flex flex-col items-center" style={{ gap: `${(pageSettings.blockSpacing ?? 16) / 2}px` }}>
                {pageSettings.profileTitle && (
                  <h1 className="text-xl font-bold">{pageSettings.profileTitle}</h1>
                )}
                {pageSettings.profileBio && (
                  <p className="text-sm opacity-80 text-center max-w-md">{pageSettings.profileBio}</p>
                )}
              </div>
            </div>
          )}

          {/* Blocks */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
              <div 
                className="flex flex-col relative z-10 w-full" 
                style={{ gap: `${pageSettings.blockSpacing ?? 16}px` }}
                onClick={(e) => e.stopPropagation()}
              >
                {blocks.map((block) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    onDelete={handleDeleteBlock}
                    isSelected={block.id === selectedBlockId}
                    onSelect={(id) => { setSelectedBlockId(id); setShowBlockPicker(false); }}
                    isPreviewMode={isPreviewMode}
                    uploadingBlockIds={uploadingBlockIds}
                    cardStyle={cardStyle}
                    cardShowHeadingCard={pageSettings.cardShowHeadingCard ?? false}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Empty state */}
        {blocks.length === 0 && !isPreviewMode && (
          <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl border border-dashed border-zinc-400 flex items-center justify-center mb-4 text-zinc-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">Klik <kbd className="px-1.5 py-0.5 bg-zinc-200 border border-zinc-300 rounded text-xs font-mono text-zinc-700">+</kbd> di toolbar untuk menambahkan blok pertama</p>
          </div>
        )}

        {/* Watermark Powered By */}
        {blocks.length > 0 && (
          <div className="mt-16 pb-8 flex justify-center relative z-10">
            <a 
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium opacity-60 hover:opacity-100 transition-opacity"
            >
              Powered by <span className="font-bold">Weblink Builder</span>
            </a>
          </div>
        )}
      </div>

      {/* Publish Success Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPublishModal(false)}>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPublishModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
              <Check size={24} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Halaman Berhasil Dipublikasikan!</h2>
            <p className="text-sm text-zinc-400 mb-6">Halaman Anda sekarang sudah online dan bisa diakses oleh siapa saja. Bagikan tautan ini ke audiens Anda.</p>
            
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2 mb-6">
              <div className="flex-1 px-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-zinc-300 select-all">
                {publicUrl}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                  showToast("Tautan disalin!", "success");
                }}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Salin Tautan"
              >
                {copiedLink ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                Tutup
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-teal-950 transition-colors flex items-center justify-center gap-2"
              >
                Kunjungi <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
