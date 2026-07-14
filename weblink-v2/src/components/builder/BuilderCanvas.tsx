"use client";

import type { PageSettings } from "./BackgroundPicker";

import { nanoid } from "nanoid";
import { useRef, useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Loader2, UploadCloud, ExternalLink } from "lucide-react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSensor,
  DndContext,
  useSensors,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";

import { updateProjectSlug } from "src/app/actions/project";
import { processImageToBase64 } from "src/lib/imageProcessor";
import { getOptimizedImageUrl } from "src/lib/imageOptimization";

import { useToast } from "src/components/ui/Toast";

import CanvasBlock from "./CanvasBlock";
import PublishButton from "./PublishButton";
import BlocksRenderer from "./BlocksRenderer";
import FloatingToolbar from "./FloatingToolbar";
import ContextualSidebar from "./ContextualSidebar";

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
  
  const [slug, setSlug] = useState(initialData.slug);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState(initialData.slug);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isSavingSlug, setIsSavingSlug] = useState(false);

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`;

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
  const [canvasDragOver, setCanvasDragOver] = useState(false);
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
    } catch (e) {
      console.error("Failed to parse page settings:", e);
    }
    return { type: "color", color: "#ffffff" };
  });

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  // Compute background CSS style for canvas
  const bgStyle: React.CSSProperties =
    pageSettings.type === "image" && pageSettings.imageUrl
      ? { backgroundImage: `url(${getOptimizedImageUrl(pageSettings.imageUrl, { width: 1920, quality: "auto" })})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
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
            ? { ...b, content: { url: uploadResult.url, alt: "", storageKey: uploadResult.storageKey, width: uploadResult.width, height: uploadResult.height, format: uploadResult.format, bytes: uploadResult.bytes, aspectRatio: uploadResult.aspectRatio } }
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



  // Editor: max-w-2xl centered. Preview Mobile: narrow.
  const canvasWidth = isMobileView ? "max-w-[390px]" : "max-w-2xl";

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  return (
    <div 
      className={`min-h-screen ${isMobileView ? "bg-zinc-50 py-4 overflow-y-auto" : ""} transition-all duration-300 relative`}
      style={!isMobileView ? { ...bgStyle, fontFamily: pageSettings.fontFamily || 'inherit' } : undefined}
    >
      {!isMobileView && ((pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 0) > 0) && (
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{ backgroundColor: `rgba(0, 0, 0, ${(pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 0) / 100})` }}
        />
      )}
      {/* Floating Toolbar */}
      <FloatingToolbar
        onAddBlock={handleAddBlock}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        isMobileView={isMobileView}
        onToggleMobile={() => setIsMobileView((v) => !v)}
        isBackgroundOpen={showPageSettings}
        onToggleBackground={() => { setShowPageSettings((v) => !v); setSelectedBlockId(null); setShowBlockPicker(false); }}
        showBlockPicker={showBlockPicker}
        onToggleBlockPicker={() => { setShowBlockPicker((v) => !v); setSelectedBlockId(null); setShowPageSettings(false); }}
        onCloseBlockPicker={() => setShowBlockPicker(false)}
        publishButton={
          <PublishButton
            projectId={initialData.id}
            isPublished={isPublished}
            hasChanges={hasChanges}
            blocksData={blocks}
            pageSettingsData={pageSettings}
            onPublishSuccess={() => {
              setIsPublished(true);
              setPublishedBlocks(blocks);
              setShowPublishModal(true);
            }}
          />
        }
      />

      {/* Contextual Sidebar */}
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

      {/* Canvas Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setCanvasDragOver(true); }}
        onDragLeave={() => setCanvasDragOver(false)}
        onDrop={handleCanvasDrop}
        onClick={() => { setSelectedBlockId(null); setShowBlockPicker(false); setShowPageSettings(false); }}
        className={`relative ${canvasWidth} mx-auto font-sans transition-all duration-300 ${
          isMobileView
            ? "my-4 border-[12px] border-zinc-950 rounded-[3rem] shadow-2xl min-h-[780px] pt-16 pb-12 px-4 flex flex-col justify-start bg-white"
            : "pt-8 pb-12 px-6 min-h-screen flex flex-col"
        }`}
        style={{ ...(isMobileView ? bgStyle : {}), fontFamily: pageSettings.fontFamily || 'inherit' }}
      >
        {isMobileView && (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-zinc-800 rounded-full z-40 pointer-events-none" />
        )}
        {/* Dark overlay for backgrounds inside phone mockup */}
        {isMobileView && ((pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 0) > 0) && (
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
        <div className={`w-full mx-auto flex flex-col items-center relative z-10 ${
          isMobileView ? "px-2 pb-10" : "max-w-2xl px-4 md:px-8"
        }`}>
          {/* Blocks */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
              <div 
                className="flex flex-col relative z-10 w-full" 
                style={{ gap: `${pageSettings.blockSpacing ?? 16}px` }}
                onClick={(e) => e.stopPropagation()}
              >
                <BlocksRenderer
                  blocks={blocks}
                  isEditor
                  pageSettings={pageSettings}
                  uploadingBlockIds={uploadingBlockIds}
                  renderBlockWrapper={(block, children) => (
                    <CanvasBlock
                      key={block.id}
                      block={block}
                      onDelete={handleDeleteBlock}
                      isSelected={block.id === selectedBlockId}
                      onSelect={(id) => { setSelectedBlockId(id); setShowBlockPicker(false); }}
                    >
                      {children}
                    </CanvasBlock>
                  )}
                />
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl border border-dashed border-zinc-400 flex items-center justify-center mb-4 text-zinc-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">Klik <kbd className="px-1.5 py-0.5 bg-zinc-200 border border-zinc-300 rounded text-xs font-mono text-zinc-700">+</kbd> di toolbar untuk menambahkan blok pertama</p>
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
            
            {/* Inline Slug Editor */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-left">Link Halaman Anda</span>
              
              {!isEditingSlug ? (
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl p-2.5">
                  <div className="flex-1 px-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-zinc-300 font-mono select-all">
                    {publicUrl}
                  </div>
                  <button
                    onClick={() => {
                      setSlugInput(slug);
                      setSlugError(null);
                      setIsEditingSlug(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors cursor-pointer"
                    title="Ubah Link"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                      showToast("Tautan disalin!", "success");
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
                    title="Salin Tautan"
                  >
                    {copiedLink ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (slugInput.trim() === slug) {
                      setIsEditingSlug(false);
                      return;
                    }
                    setIsSavingSlug(true);
                    setSlugError(null);
                    const res = await updateProjectSlug(initialData.id, slugInput);
                    if (res.error) {
                      setSlugError(res.error);
                    } else {
                      setSlug(slugInput.trim().toLowerCase());
                      setIsEditingSlug(false);
                    }
                    setIsSavingSlug(false);
                  }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center bg-zinc-900 border border-zinc-700 focus-within:border-teal-500/50 rounded-xl p-2.5 text-sm text-zinc-300 font-mono">
                    <span className="text-zinc-500 select-none shrink-0">{typeof window !== "undefined" ? window.location.origin : ""}/</span>
                    <input
                      type="text"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value)}
                      disabled={isSavingSlug}
                      className="bg-transparent border-none outline-none text-white w-full ml-0.5 focus:ring-0 p-0 font-mono"
                      autoFocus
                    />
                  </div>
                  {slugError && (
                    <span className="text-[10px] text-red-400 font-semibold px-1 text-left">{slugError}</span>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingSlug(false)}
                      disabled={isSavingSlug}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSlug}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-teal-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSavingSlug && <Loader2 size={12} className="animate-spin" />}
                      {isSavingSlug ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </form>
              )}
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
