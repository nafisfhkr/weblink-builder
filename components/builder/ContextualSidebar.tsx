"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Trash2, Plus, X, Globe } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import BackgroundPicker, { PageSettings } from "@/components/builder/BackgroundPicker";
import { InstagramIcon, TiktokIcon, XIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface BlockItem {
  id: string;
  type: "heading" | "link" | "image" | "divider" | "social";
  content: any;
  order: number;
}

interface SocialItem {
  platform: string;
  url: string;
}

interface ContextualSidebarProps {
  selectedBlock: BlockItem | null;
  onUpdate: (id: string, content: any) => void;
  onClose: () => void;
  onImageUploadStart?: (blockId: string) => void;
  onImageUploadEnd?: (blockId: string) => void;
  // Page settings mode
  showPageSettings?: boolean;
  pageSettings?: PageSettings;
  onPageSettingsChange?: (settings: PageSettings) => void;
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: InstagramIcon },
  { value: "tiktok", label: "TikTok", icon: TiktokIcon },
  { value: "x", label: "X / Twitter", icon: XIcon },
  { value: "youtube", label: "YouTube", icon: YoutubeIcon },
  { value: "facebook", label: "Facebook", icon: FacebookIcon },
];

const BLOCK_TYPE_LABELS: Record<string, string> = {
  heading: "TEXT",
  link: "LINK",
  image: "IMAGE",
  divider: "DIVIDER",
  social: "SOCIAL",
  "page-settings": "BACKGROUND",
};

// --- Heading Panel ---
function HeadingPanel({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="sidebar-label">Site Title</label>
        <input
          id="sidebar-heading-title"
          type="text"
          value={content?.title || ""}
          maxLength={60}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Nama atau Judul Halaman"
          className="sidebar-input"
        />
        <p className="sidebar-hint">{(content?.title || "").length}/60</p>
      </div>
      <div>
        <label className="sidebar-label">Bio / Deskripsi</label>
        <textarea
          id="sidebar-heading-bio"
          value={content?.bio || ""}
          maxLength={120}
          rows={3}
          onChange={(e) => onChange({ ...content, bio: e.target.value })}
          placeholder="Desainer Grafis & Content Creator..."
          className="sidebar-input resize-none"
        />
        <p className="sidebar-hint">{(content?.bio || "").length}/120</p>
      </div>
    </div>
  );
}

// --- Link Panel ---
function LinkPanel({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const handleUrlBlur = () => {
    const url = (content?.url || "").trim();
    if (url && !/^https?:\/\//i.test(url)) {
      onChange({ ...content, url: `https://${url}` });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="sidebar-label">Judul Link</label>
        <input
          id="sidebar-link-title"
          type="text"
          value={content?.title || ""}
          maxLength={40}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="My Portfolio Website"
          className="sidebar-input"
        />
        <p className="sidebar-hint">{(content?.title || "").length}/40</p>
      </div>
      <div>
        <label className="sidebar-label">URL Tujuan</label>
        <input
          id="sidebar-link-url"
          type="text"
          value={content?.url || ""}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          onBlur={handleUrlBlur}
          placeholder="https://example.com"
          className="sidebar-input font-mono text-xs"
        />
      </div>
    </div>
  );
}

// --- Image Panel ---
function ImagePanel({
  content,
  onChange,
  onUploadStart,
  onUploadEnd,
}: {
  content: any;
  onChange: (c: any) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Format file tidak didukung, gunakan JPG/PNG/WebP", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran file melebihi 5MB", "error");
      return;
    }

    setIsUploading(true);
    onUploadStart?.();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadToCloudinary(file);
      onChange({ ...content, url: result.url, storageKey: result.storageKey });
      showToast("Gambar berhasil diunggah", "success");
    } catch (e: any) {
      showToast(e.message || "Upload foto gagal, coba lagi", "error");
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="sidebar-label">Foto / Gambar</label>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]); }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative min-h-[130px] border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-4 overflow-hidden ${
            dragOver ? "border-teal-500 bg-teal-950/20" :
            content?.url ? "border-zinc-700 bg-zinc-900/30" :
            "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600"
          }`}
        >
          <input
            id="sidebar-image-upload"
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-teal-400" size={24} />
              <span className="text-xs text-zinc-400">Uploading...</span>
            </div>
          ) : content?.url ? (
            <div className="relative group w-full flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.url} alt={content.alt || ""} className="max-h-[110px] rounded-lg object-contain border border-zinc-800" />
              <span className="text-[10px] text-zinc-500 mt-2">Drag atau klik untuk Replace Image</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-2">
              <UploadCloud className="text-zinc-500" size={26} />
              <div>
                <p className="text-xs text-zinc-300 font-medium">Drag foto ke sini atau klik untuk pilih file</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">JPG, PNG, WebP · Max 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Replace/Remove buttons */}
        {content?.url && !isUploading && (
          <div className="flex gap-2 mt-2">
            <button
              id="sidebar-image-replace"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
            >
              Replace Image
            </button>
            <button
              id="sidebar-image-remove"
              onClick={() => onChange({ ...content, url: "", storageKey: "" })}
              className="text-xs bg-red-950/50 hover:bg-red-950 border border-red-900/50 hover:border-red-800 text-red-400 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Bentuk Gambar (Aspect Ratio / Shape) */}
      <div>
        <label className="sidebar-label">Bentuk Gambar</label>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1">
          {([
            { value: "widescreen", label: "Persegi Panjang" },
            { value: "square", label: "Kotak" },
            { value: "circle", label: "Bulat" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...content, aspectRatio: opt.value })}
              className={`flex-1 text-[11px] py-1.5 rounded-md font-medium transition-all ${
                (content?.aspectRatio || "widescreen") === opt.value
                  ? "bg-zinc-700 text-white shadow"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="sidebar-label">Alt Text (Opsional)</label>
        <input
          id="sidebar-image-alt"
          type="text"
          value={content?.alt || ""}
          maxLength={100}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Deskripsi foto untuk aksesibilitas"
          className="sidebar-input"
        />
        <p className="sidebar-hint">{(content?.alt || "").length}/100</p>
      </div>
    </div>
  );
}

// --- Divider Panel ---
function DividerPanel() {
  return (
    <div className="text-center py-6 text-zinc-600 text-xs">
      Blok divider tidak memiliki pengaturan.
    </div>
  );
}

// --- Social Panel ---
function SocialPanel({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items: SocialItem[] = content?.items || [];

  const updateItem = (index: number, field: keyof SocialItem, value: string) => {
    const updated = items.map((item, i) => i === index ? { ...item, [field]: value } : item);
    onChange({ ...content, items: updated });
  };

  const handleUrlBlur = (index: number) => {
    const url = items[index]?.url?.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      if (url.includes(".")) {
        updateItem(index, "url", `https://${url}`);
      }
    }
  };

  const addItem = () => {
    const unusedPlatform = AVAILABLE_PLATFORMS.find(p => !items.some(i => i.platform === p.value));
    const platform = unusedPlatform?.value || "instagram";
    onChange({ ...content, items: [...items, { platform, url: "" }] });
  };

  const removeItem = (index: number) => {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="sidebar-label">Platform Sosial</label>
        <button
          id="sidebar-social-add"
          onClick={addItem}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
        >
          <Plus size={13} /> Tambah
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600 italic text-center py-3">Belum ada platform. Klik Tambah.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            const platformConfig = AVAILABLE_PLATFORMS.find(p => p.value === item.platform);
            const Icon = platformConfig?.icon || Globe;
            return (
              <div key={index} className="flex items-center gap-2 bg-zinc-900/60 p-2 border border-zinc-800 rounded-lg">
                <div className="text-zinc-400 p-1 bg-zinc-900 rounded shrink-0">
                  <Icon size={15} />
                </div>
                <select
                  value={item.platform}
                  onChange={(e) => updateItem(index, "platform", e.target.value)}
                  className="bg-zinc-900 text-zinc-300 text-xs border border-zinc-800 rounded px-1.5 py-1 outline-none shrink-0"
                >
                  {AVAILABLE_PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(index, "url", e.target.value)}
                  onBlur={() => handleUrlBlur(index)}
                  placeholder="URL atau username"
                  className="flex-1 bg-zinc-900 text-white text-xs border border-zinc-800 rounded px-2 py-1 outline-none min-w-0"
                />
                <button onClick={() => removeItem(index)} className="text-zinc-600 hover:text-red-500 p-1 transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Main ContextualSidebar ---
export default function ContextualSidebar({
  selectedBlock,
  onUpdate,
  onClose,
  onImageUploadStart,
  onImageUploadEnd,
  showPageSettings,
  pageSettings,
  onPageSettingsChange,
}: ContextualSidebarProps) {
  const isOpen = !!selectedBlock || !!showPageSettings;

  return (
    <>
      {/* Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-40 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar editor blok"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-teal-500 rounded-full" />
            <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase">
              {showPageSettings ? "BACKGROUND" : selectedBlock ? BLOCK_TYPE_LABELS[selectedBlock.type] || selectedBlock.type.toUpperCase() : "BLOCK"}
            </span>
          </div>
          <button
            id="sidebar-close"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-all"
            aria-label="Tutup sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {selectedBlock?.type === "heading" && (
            <HeadingPanel
              content={selectedBlock.content}
              onChange={(c) => onUpdate(selectedBlock.id, c)}
            />
          )}
          {selectedBlock?.type === "link" && (
            <LinkPanel
              content={selectedBlock.content}
              onChange={(c) => onUpdate(selectedBlock.id, c)}
            />
          )}
          {selectedBlock?.type === "image" && (
            <ImagePanel
              content={selectedBlock.content}
              onChange={(c) => onUpdate(selectedBlock.id, c)}
              onUploadStart={() => onImageUploadStart?.(selectedBlock.id)}
              onUploadEnd={() => onImageUploadEnd?.(selectedBlock.id)}
            />
          )}
          {selectedBlock?.type === "divider" && <DividerPanel />}
          {selectedBlock?.type === "social" && (
            <SocialPanel
              content={selectedBlock.content}
              onChange={(c) => onUpdate(selectedBlock.id, c)}
            />
          )}
          {showPageSettings && pageSettings && onPageSettingsChange && (
            <BackgroundPicker
              settings={pageSettings}
              onChange={onPageSettingsChange}
            />
          )}
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
