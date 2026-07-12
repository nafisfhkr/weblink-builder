"use client";

import { useState, useRef } from "react";
import {
  X, Copy, Trash2, Check,
  Type, Brush, Settings, ImageIcon,
  Minus, Box, MousePointerClick, Plus, Loader2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from "lucide-react";
import { useToast } from "src/components/ui/Toast";
import { nanoid } from "nanoid";
import { processImageToBase64 } from "src/lib/imageProcessor";
import BackgroundPicker, { type PageSettings } from "./BackgroundPicker";

type BlockType = "text" | "container" | "buttons" | "image" | "divider";

interface BlockItem {
  id: string;
  type: BlockType | "page-settings";
  content: any;
  order: number;
}

interface ContextualSidebarProps {
  selectedBlock: BlockItem | null;
  onUpdate: (id: string, content: any) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onClose: () => void;
  onImageUploadStart?: (blockId: string) => void;
  onImageUploadEnd?: (blockId: string) => void;
  showPageSettings?: boolean;
  pageSettings?: PageSettings;
  onPageSettingsChange?: (settings: PageSettings) => void;
}

// ─── Tab Config ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "properties", label: "Konten", icon: Type },
  { id: "appearance", label: "Tampilan", icon: Brush },
  { id: "settings",   label: "Lainnya",  icon: Settings },
];

const BLOCK_ICONS: Record<string, React.ElementType> = {
  text: Type,
  container: Box,
  buttons: MousePointerClick,
  image: ImageIcon,
  divider: Minus,
};

const BLOCK_LABELS: Record<string, string> = {
  text: "Text",
  container: "Container",
  buttons: "Buttons",
  image: "Image",
  divider: "Divider",
  "page-settings": "Background",
};

// ─── Shared form primitives ───────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">{children}</p>;
}

function SInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-teal-700 transition-colors ${props.className || ""}`}
    />
  );
}

function STextArea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-teal-700 transition-colors resize-y ${props.className || ""}`}
    />
  );
}

function SSelect({ ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-700 transition-colors cursor-pointer ${props.className || ""}`}
    />
  );
}

function SSlider({ label, value, min, max, unit = "", onChange }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label>{label}</Label>
        <span className="text-xs font-semibold text-teal-400 tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-500 h-1.5 cursor-pointer"
      />
    </div>
  );
}

function Divider() {
  return <div className="border-t border-zinc-800/80 my-1" />;
}

function SegmentedControl({
  options, value, onChange,
}: {
  options: { value: string; label: string; icon?: React.ElementType }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              isActive
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {Icon && <Icon size={12} />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-0.5"
        />
      </div>
    </div>
  );
}

// ─── Shared Card Settings ────────────────────────────────────────────────────

function CardSettingsSection({ c, onChange }: { c: any; onChange: (newC: any) => void }) {
  return (
    <>
      <Divider />
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex flex-col min-w-0 pr-4">
            <span className="text-xs text-zinc-300 font-medium leading-tight">Gunakan Glass Card</span>
            <span className="text-[10px] text-zinc-500 mt-0.5 leading-tight">Bungkus blok ini dengan kotak transparan</span>
          </div>
          <div
            onClick={(e) => { e.preventDefault(); onChange({ ...c, useCard: !c.useCard }); }}
            className={`shrink-0 relative w-10 h-5 rounded-full transition-colors cursor-pointer ${c.useCard ? "bg-teal-500" : "bg-zinc-700"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${c.useCard ? "left-5.5 translate-x-5" : "left-0.5"}`} />
          </div>
        </label>
      </div>

      {c.useCard && (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 space-y-4 mt-3">
          {/* Warna Card */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Warna Dasar</Label>
              <input
                type="color"
                value={c.cardBgColor || "#ffffff"}
                onChange={(e) => onChange({ ...c, cardBgColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-0.5"
              />
            </div>
            <div>
              <Label>Warna Border</Label>
              <input
                type="color"
                value={c.cardBorderColor || "#ffffff"}
                onChange={(e) => onChange({ ...c, cardBorderColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-900 p-0.5"
              />
            </div>
          </div>

          <SSlider
            label="Transparansi Dasar"
            value={c.cardBgOpacity ?? 10}
            min={0} max={100} unit="%"
            onChange={(v) => onChange({ ...c, cardBgOpacity: v })}
          />
          <SSlider
            label="Transparansi Border"
            value={c.cardBorderOpacity ?? 20}
            min={0} max={100} unit="%"
            onChange={(v) => onChange({ ...c, cardBorderOpacity: v })}
          />
          <SSlider
            label="Efek Blur (Glass)"
            value={c.cardBlur ?? 10}
            min={0} max={40} unit="px"
            onChange={(v) => onChange({ ...c, cardBlur: v })}
          />
        </div>
      )}
    </>
  );
}

// ─── Text Panel ──────────────────────────────────────────────────────────────

function TextPanel({ content, onChange, activeTab }: any) {
  const c = content || {};

  if (activeTab === "properties") {
    return (
      <div className="space-y-5">
        <div>
          <Label>Konten Teks</Label>
          <STextArea
            rows={6}
            value={c.text || ""}
            onChange={(e) => onChange({ ...c, text: e.target.value })}
            placeholder="Tulis teks di sini..."
          />
        </div>
        <Divider />
        <div>
          <Label>Tipe</Label>
          <SegmentedControl
            value={c.as || "paragraph"}
            onChange={(v) => onChange({ ...c, as: v })}
            options={[
              { value: "paragraph", label: "Paragraf" },
              { value: "heading", label: "Judul" },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Ukuran Font (px)</Label>
            <SInput
              type="number"
              value={c.textSize || 16}
              min={8} max={120}
              onChange={(e) => onChange({ ...c, textSize: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Spasi Baris</Label>
            <SInput
              type="number"
              step="0.1"
              value={c.lineHeight || (c.as === "heading" ? 1.2 : 1.5)}
              min={0.5} max={5}
              onChange={(e) => onChange({ ...c, lineHeight: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <Label>Jenis Font</Label>
          <SSelect
            value={c.fontFamily || "inherit"}
            onChange={(e) => onChange({ ...c, fontFamily: e.target.value })}
          >
            <option value="inherit">Bawaan Tema</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </SSelect>
        </div>
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-5">
        <div>
          <Label>Perataan</Label>
          <SegmentedControl
            value={c.align || "center"}
            onChange={(v) => onChange({ ...c, align: v })}
            options={[
              { value: "left", label: "Kiri", icon: AlignLeft },
              { value: "center", label: "Tengah", icon: AlignCenter },
              { value: "right", label: "Kanan", icon: AlignRight },
              { value: "justify", label: "Rata", icon: AlignJustify },
            ]}
          />
        </div>
        <Divider />
        <ColorRow
          label="Warna Teks"
          value={c.color || "#ffffff"}
          onChange={(v) => onChange({ ...c, color: v })}
        />
        <CardSettingsSection c={c} onChange={onChange} />
      </div>
    );
  }

  return null;
}

// ─── Container Panel ─────────────────────────────────────────────────────────

function ContainerPanel({ content, onChange, activeTab }: any) {
  const c = content || {};

  if (activeTab === "properties") {
    return (
      <div className="space-y-5">
        <div>
          <Label>Tipe Layout</Label>
          <SegmentedControl
            value={c.layout || "default"}
            onChange={(v) => onChange({ ...c, layout: v })}
            options={[
              { value: "default", label: "Default" },
              { value: "columns", label: "Kolom" },
            ]}
          />
        </div>
        {(c.layout || "default") === "columns" && (
          <>
            <Divider />
            <div>
              <Label>Jumlah Kolom</Label>
              <SegmentedControl
                value={String(c.columns || 2)}
                onChange={(v) => onChange({ ...c, columns: Number(v) })}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
              />
            </div>
            <SSlider
              label="Jarak Kolom"
              value={c.gutter ?? 16}
              min={0} max={64} unit="px"
              onChange={(v) => onChange({ ...c, gutter: v })}
            />
          </>
        )}
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Padding V (px)</Label>
            <SInput type="number" value={c.paddingV ?? 16} onChange={(e) => onChange({ ...c, paddingV: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Padding H (px)</Label>
            <SInput type="number" value={c.paddingH ?? 16} onChange={(e) => onChange({ ...c, paddingH: Number(e.target.value) })} />
          </div>
        </div>
        <SSlider label="Corner Radius" value={c.radius ?? 16} min={0} max={64} unit="px" onChange={(v) => onChange({ ...c, radius: v })} />
        <Divider />
        <div>
          <Label>Background</Label>
          <SSelect value={c.bgType || "none"} onChange={(e) => onChange({ ...c, bgType: e.target.value })}>
            <option value="none">None (Transparan)</option>
            <option value="color">Warna Solid</option>
            <option value="gradient">Gradient</option>
          </SSelect>
        </div>
        {c.bgType === "color" && (
          <ColorRow label="Warna BG" value={c.bgColor || "#000000"} onChange={(v) => onChange({ ...c, bgColor: v })} />
        )}
        {c.bgType === "gradient" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Warna 1</Label>
                <input type="color" value={c.gradColor1 || "#000000"} onChange={(e) => onChange({ ...c, gradColor1: e.target.value })} className="w-full h-9 rounded-lg cursor-pointer border border-zinc-800 p-0.5" />
              </div>
              <div>
                <Label>Warna 2</Label>
                <input type="color" value={c.gradColor2 || "#333333"} onChange={(e) => onChange({ ...c, gradColor2: e.target.value })} className="w-full h-9 rounded-lg cursor-pointer border border-zinc-800 p-0.5" />
              </div>
            </div>
            <div>
              <Label>Sudut (°)</Label>
              <SInput type="number" value={c.gradAngle ?? 90} min={0} max={360} onChange={(e) => onChange({ ...c, gradAngle: Number(e.target.value) })} />
            </div>
          </div>
        )}
        <Divider />
        <div>
          <Label>Border</Label>
          <SSelect value={c.borderStyle || "none"} onChange={(e) => onChange({ ...c, borderStyle: e.target.value })}>
            <option value="none">Tidak Ada</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </SSelect>
        </div>
        {c.borderStyle && c.borderStyle !== "none" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Tebal (px)</Label>
                <SInput type="number" value={c.borderWidth ?? 1} min={1} max={20} onChange={(e) => onChange({ ...c, borderWidth: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Warna</Label>
                <input type="color" value={c.borderColor || "#ffffff"} onChange={(e) => onChange({ ...c, borderColor: e.target.value })} className="w-full h-9 rounded-lg cursor-pointer border border-zinc-800 p-0.5" />
              </div>
            </div>
          </div>
        )}
        <CardSettingsSection c={c} onChange={onChange} />
      </div>
    );
  }

  return null;
}

// ─── Buttons Panel ───────────────────────────────────────────────────────────

function ButtonsPanel({ content, onChange, activeTab }: any) {
  const c = content || {};
  const items: any[] = c.items || [];

  const updateItem = (i: number, key: string, val: any) => {
    const newItems = [...items];
    newItems[i] = { ...newItems[i], [key]: val };
    onChange({ ...c, items: newItems });
  };
  const removeItem = (i: number) => onChange({ ...c, items: items.filter((_, idx) => idx !== i) });
  const addItem = () => onChange({
    ...c,
    items: [...items, { id: nanoid(), label: "Tombol Baru", url: "https://", bgColor: "#14b8a6", textColor: "#ffffff", bgOpacity: 100 }],
  });

  if (activeTab === "properties") {
    return (
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-6 text-zinc-600 text-xs">
            Belum ada tombol. Klik tombol di bawah untuk menambahkan.
          </div>
        )}
        {items.map((item: any, i: number) => (
          <div key={item.id || i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-300">Tombol {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded">
                <Trash2 size={12} />
              </button>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <Label>Label / Teks</Label>
                <SInput value={item.label || ""} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Teks Tombol" />
              </div>
              <div>
                <Label>URL Tujuan</Label>
                <SInput value={item.url || ""} onChange={(e) => updateItem(i, "url", e.target.value)} placeholder="https://..." className="font-mono text-xs" />
              </div>
              <div>
                <Label>Ikon</Label>
                <SSelect value={item.icon || "none"} onChange={(e) => updateItem(i, "icon", e.target.value)}>
                  <option value="none">Tanpa Ikon</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="website">Website (Globe)</option>
                </SSelect>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Bg Color</Label>
                  <input type="color" value={item.bgColor || "#14b8a6"} onChange={(e) => updateItem(i, "bgColor", e.target.value)} className="w-full h-9 rounded-lg cursor-pointer border border-zinc-800 p-0.5" />
                </div>
                <div>
                  <Label>Warna Teks</Label>
                  <input type="color" value={item.textColor || "#ffffff"} onChange={(e) => updateItem(i, "textColor", e.target.value)} className="w-full h-9 rounded-lg cursor-pointer border border-zinc-800 p-0.5" />
                </div>
              </div>
              <SSlider
                label="Opacity BG"
                value={item.bgOpacity ?? 100}
                min={0} max={100} unit="%"
                onChange={(v) => updateItem(i, "bgOpacity", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-2.5 text-xs font-semibold text-teal-400 hover:text-teal-300 bg-teal-950/20 hover:bg-teal-950/40 border border-teal-800/40 border-dashed rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={13} /> Tambah Tombol
        </button>
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-5">
        <CardSettingsSection c={c} onChange={onChange} />
      </div>
    );
  }

  return null;
}

// ─── Image Panel ─────────────────────────────────────────────────────────────

function ImagePanel({ content, onChange, activeTab, onUploadStart, onUploadEnd }: any) {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const c = content || {};

  const handleFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"].includes(file.type)) {
      showToast("Format tidak didukung (JPEG/PNG/WebP/GIF/SVG)", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran maksimal 2MB", "error");
      return;
    }
    setUploading(true);
    onUploadStart?.();
    try {
      const result = await processImageToBase64(file);
      onChange({ ...c, url: result.url, storageKey: result.storageKey });
    } catch (e: any) {
      showToast(e.message || "Upload gagal", "error");
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  };

  if (activeTab === "properties") {
    return (
      <div className="space-y-4">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-900 min-h-[120px] flex items-center justify-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-teal-400" size={24} />
                <span className="text-xs text-zinc-500">Mengupload...</span>
              </div>
            ) : c.url ? (
              <img src={c.url} alt={c.alt || ""} className="max-h-40 object-contain w-full" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-600">
                <ImageIcon size={28} />
                <span className="text-xs">Belum ada gambar</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-800 bg-zinc-900/50">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 py-1.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-teal-950 rounded-lg transition-colors"
            >
              {c.url ? "Ganti Gambar" : "Upload Gambar"}
            </button>
            {c.url && (
              <button
                onClick={() => onChange({ ...c, url: "", storageKey: "" })}
                className="py-1.5 px-2.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <p className="text-[9px] text-zinc-600 text-center py-1.5">JPEG, PNG, WebP, GIF (maks 2MB), SVG</p>
        </div>
        <div>
          <Label>Alt Text (SEO)</Label>
          <SInput value={c.alt || ""} onChange={(e) => onChange({ ...c, alt: e.target.value })} placeholder="Deskripsi gambar" />
        </div>
        <div>
          <Label>Link URL (Opsional)</Label>
          <SInput value={c.linkUrl || ""} onChange={(e) => onChange({ ...c, linkUrl: e.target.value })} placeholder="https://..." className="font-mono text-xs" />
        </div>
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-5">
        <div>
          <Label>Rasio Gambar</Label>
          <SSelect value={c.aspectRatio || "widescreen"} onChange={(e) => onChange({ ...c, aspectRatio: e.target.value })}>
            <option value="widescreen">Widescreen (16:9)</option>
            <option value="square">Kotak (1:1)</option>
            <option value="circle">Lingkaran</option>
          </SSelect>
        </div>
        <CardSettingsSection c={c} onChange={onChange} />
      </div>
    );
  }

  return null;
}

// ─── Divider Panel ───────────────────────────────────────────────────────────

function DividerPanel({ content, onChange, activeTab }: any) {
  const c = content || {};

  if (activeTab === "properties") {
    return (
      <div className="space-y-5">
        <div>
          <Label>Style</Label>
          <SegmentedControl
            value={c.style || "single"}
            onChange={(v) => onChange({ ...c, style: v })}
            options={[
              { value: "single", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
            ]}
          />
        </div>
        <SSlider label="Lebar" value={c.width ?? 80} min={1} max={100} unit="%" onChange={(v) => onChange({ ...c, width: v })} />
        <SSlider label="Ketebalan" value={c.thickness ?? 1} min={1} max={20} unit="px" onChange={(v) => onChange({ ...c, thickness: v })} />
        <SSlider label="Corner Radius" value={c.radius ?? 0} min={0} max={20} unit="px" onChange={(v) => onChange({ ...c, radius: v })} />
        <SSlider label="Margin Atas/Bawah" value={c.margin ?? 24} min={0} max={100} unit="px" onChange={(v) => onChange({ ...c, margin: v })} />
        <Divider />
        <ColorRow label="Warna" value={c.color || "#52525b"} onChange={(v) => onChange({ ...c, color: v })} />
        <Divider />
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-xs text-zinc-300 font-medium">Gunakan Gradient</span>
          </div>
          <div
            onClick={() => onChange({ ...c, useGradient: !c.useGradient })}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${c.useGradient ? "bg-teal-500" : "bg-zinc-700"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${c.useGradient ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </label>
        {c.useGradient && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Warna 1</Label>
              <input type="color" value={c.gradColor1 || "#52525b"} onChange={(e) => onChange({ ...c, gradColor1: e.target.value })} className="w-full h-9 rounded-lg border border-zinc-800 p-0.5 cursor-pointer" />
            </div>
            <div>
              <Label>Warna 2</Label>
              <input type="color" value={c.gradColor2 || "#27272a"} onChange={(e) => onChange({ ...c, gradColor2: e.target.value })} className="w-full h-9 rounded-lg border border-zinc-800 p-0.5 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-5">
        <CardSettingsSection c={c} onChange={onChange} />
      </div>
    );
  }

  return null;
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function ContextualSidebar({
  selectedBlock,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
  onImageUploadStart,
  onImageUploadEnd,
  showPageSettings,
  pageSettings,
  onPageSettingsChange,
}: ContextualSidebarProps) {
  const [activeTab, setActiveTab] = useState("properties");
  const [doneFlash, setDoneFlash] = useState(false);

  const isOpen = !!selectedBlock || showPageSettings;
  if (!isOpen) return null;

  const blockType = selectedBlock?.type as BlockType;
  const BlockIcon = blockType ? BLOCK_ICONS[blockType] : null;
  const blockLabel = showPageSettings ? "Background & Profil" : (blockType ? BLOCK_LABELS[blockType] : "Settings");

  // Tabs per block type
  const tabs = blockType === "divider"
    ? TABS.filter((t) => t.id !== "settings") // Divider gets appearance
    : blockType === "container"
    ? TABS.filter((t) => t.id !== "settings")
    : blockType === "buttons"
    ? TABS.filter((t) => t.id !== "settings") // Buttons gets appearance now!
    : TABS.filter((t) => t.id !== "settings");

  const renderPanel = () => {
    if (showPageSettings && pageSettings && onPageSettingsChange) {
      return <BackgroundPicker settings={pageSettings} onChange={onPageSettingsChange} />;
    }
    if (!selectedBlock) return null;

    const props = {
      content: selectedBlock.content,
      onChange: (newContent: any) => onUpdate(selectedBlock.id, newContent),
      activeTab,
      onUploadStart: () => onImageUploadStart?.(selectedBlock.id),
      onUploadEnd: () => onImageUploadEnd?.(selectedBlock.id),
    };

    switch (selectedBlock.type) {
      case "text":      return <TextPanel {...props} />;
      case "container": return <ContainerPanel {...props} />;
      case "buttons":   return <ButtonsPanel {...props} />;
      case "image":     return <ImagePanel {...props} />;
      case "divider":   return <DividerPanel {...props} />;
      default:          return <p className="text-zinc-600 text-xs text-center py-6">Blok tidak dikenal.</p>;
    }
  };

  const handleDone = () => {
    setDoneFlash(true);
    setTimeout(() => { setDoneFlash(false); onClose(); }, 600);
  };

  return (
    <aside className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[288px] bg-zinc-950 border-l border-zinc-800/80 z-40 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2">
          {BlockIcon && (
            <div className="w-6 h-6 rounded-md bg-teal-950 border border-teal-800/50 flex items-center justify-center shrink-0">
              <BlockIcon size={13} className="text-teal-400" />
            </div>
          )}
          <span className="text-xs font-bold text-zinc-100">{blockLabel}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-all">
          <X size={14} />
        </button>
      </div>

      {/* Tabs — underline style, clean */}
      {!showPageSettings && (
        <div className="flex items-center border-b border-zinc-800/80 shrink-0 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-medium transition-all ${
                  isActive ? "text-teal-400" : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {renderPanel()}
      </div>

      {/* Action bar bawah */}
      {!showPageSettings && selectedBlock && (
        <div className="shrink-0 border-t border-zinc-800/80 p-3 flex items-center gap-2 bg-zinc-950">
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(selectedBlock.id)}
              title="Duplikasi"
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
            >
              <Copy size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => { onDelete(selectedBlock.id); onClose(); }}
              title="Hapus Blok"
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={handleDone}
            className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              doneFlash ? "bg-teal-300 text-teal-950" : "bg-teal-500 hover:bg-teal-400 text-teal-950"
            }`}
          >
            {doneFlash ? <Check size={13} /> : null}
            Selesai
          </button>
        </div>
      )}
    </aside>
  );
}
