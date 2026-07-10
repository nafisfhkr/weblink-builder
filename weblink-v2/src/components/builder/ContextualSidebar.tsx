"use client";

import { useState, useRef } from "react";
import {
  X, Copy, Trash2, Check,
  Type, Brush, Play, Settings, ImageIcon,
  Minus, Box, MousePointerClick, Plus, Loader2,
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
  { id: "properties", label: "Properties", icon: Type },
  { id: "appearance", label: "Appearance", icon: Brush },
  { id: "animation",  label: "Animation",  icon: Play },
  { id: "settings",   label: "Settings",   icon: Settings },
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
  return <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">{children}</p>;
}
function SInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors ${props.className || ""}`} />;
}
function STextArea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors resize-y ${props.className || ""}`} />;
}
function SSelect({ ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-600 transition-colors ${props.className || ""}`} />;
}
function SSlider({ label, value, min, max, unit = "", onChange }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <Label>{label}</Label>
        <span className="text-[10px] text-zinc-500">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-500 h-1.5" />
    </div>
  );
}
function ComingSoon({ tab }: { tab: string }) {
  return <p className="text-center text-zinc-700 text-xs py-8 italic">Tab {tab} akan segera hadir.</p>;
}

// ─── Text Panel ──────────────────────────────────────────────────────────────

function TextPanel({ content, onChange, activeTab }: any) {
  const c = content || {};
  if (activeTab === "properties") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Text / Konten</Label>
          <STextArea
            rows={8}
            value={c.text || ""}
            onChange={(e) => onChange({ ...c, text: e.target.value })}
            placeholder="Tulis teks di sini..."
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div>
            <Label>Tipe Teks</Label>
            <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              {(["paragraph","heading"] as const).map((t) => (
                <button key={t} onClick={() => onChange({ ...c, as: t })}
                  className={`flex-1 text-xs py-1.5 rounded-md capitalize transition-all font-medium ${(c.as || "paragraph") === t ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white"}`}>
                  {t === "heading" ? "Judul" : "Paragraf"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Jenis Font</Label>
              <SSelect value={c.fontFamily || "inherit"} onChange={(e) => onChange({ ...c, fontFamily: e.target.value })} className="text-xs py-1.5">
                <option value="inherit">Bawaan Tema</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                <option value="'Verdana', sans-serif">Verdana</option>
              </SSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ukuran Font</Label>
                <SInput type="number" value={c.textSize || 16} min={8} max={120}
                  onChange={(e) => onChange({ ...c, textSize: Number(e.target.value) })} className="text-xs py-1.5" />
              </div>
              <div>
                <Label>Spasi Baris</Label>
                <SInput type="number" step="0.1" value={c.lineHeight || (c.as === 'heading' ? 1.2 : 1.5)} min={0.5} max={5}
                  onChange={(e) => onChange({ ...c, lineHeight: Number(e.target.value) })} className="text-xs py-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (activeTab === "appearance") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Perataan Teks</Label>
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {(["left","center","right","justify"] as const).map((a) => (
              <button key={a} onClick={() => onChange({ ...c, align: a })}
                className={`flex-1 text-[10px] py-1.5 rounded-md capitalize transition-all ${(c.align || "center") === a ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Warna Teks</Label>
          <input type="color" value={c.color || "#ffffff"}
            onChange={(e) => onChange({ ...c, color: e.target.value })}
            className="w-full h-10 rounded-lg cursor-pointer border border-zinc-800 bg-zinc-900 p-1" />
        </div>
      </div>
    );
  }
  return <ComingSoon tab={activeTab} />;
}

// ─── Container Panel ─────────────────────────────────────────────────────────

function ContainerPanel({ content, onChange, activeTab }: any) {
  const c = content || {};
  const columns: any[] = c.columns_data || [{ width: 50, align: "center", spacer: false, mobileTop: false }];

  const updateColumn = (i: number, key: string, value: any) => {
    const newCols = [...columns]; newCols[i] = { ...newCols[i], [key]: value };
    onChange({ ...c, columns_data: newCols });
  };
  const addColumn = () => {
    if (columns.length >= 5) return;
    onChange({ ...c, columns_data: [...columns, { width: 50, align: "center", spacer: false, mobileTop: false }] });
  };
  const removeColumn = (i: number) => {
    onChange({ ...c, columns_data: columns.filter((_, idx) => idx !== i) });
  };

  if (activeTab === "properties") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Tipe Layout</Label>
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {(["default","columns"] as const).map((t) => (
              <button key={t} onClick={() => onChange({ ...c, layout: t })}
                className={`flex-1 text-xs py-2 rounded-md capitalize transition-all font-medium ${(c.layout || "default") === t ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white"}`}>
                {t === "default" ? "Default" : "Columns"}
              </button>
            ))}
          </div>
        </div>

        {(c.layout || "default") === "columns" && (
          <div className="space-y-3">
            <Label>Konfigurasi Kolom</Label>
            {columns.map((col: any, i: number) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-zinc-400">Kolom {i + 1}</span>
                  <button onClick={() => removeColumn(i)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Width: {col.width}%</span>
                  <input type="range" min={10} max={90} value={col.width}
                    onChange={(e) => updateColumn(i, "width", Number(e.target.value))}
                    className="w-full accent-teal-500 h-1.5 mt-1" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Alignment</span>
                  <div className="flex gap-1">
                    {(["left","center","right","auto"] as const).map((a) => (
                      <button key={a} onClick={() => updateColumn(i, "align", a)}
                        className={`flex-1 text-[9px] py-1 rounded transition-all capitalize ${col.align === a ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white bg-zinc-900"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={col.spacer || false}
                    onChange={(e) => updateColumn(i, "spacer", e.target.checked)}
                    className="rounded accent-teal-500" />
                  <span className="text-[10px] text-zinc-400">Use as spacer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={col.mobileTop || false}
                    onChange={(e) => updateColumn(i, "mobileTop", e.target.checked)}
                    className="rounded accent-teal-500" />
                  <span className="text-[10px] text-zinc-400">(Mobile) Stack on top</span>
                </label>
              </div>
            ))}
            {columns.length < 5 && (
              <button onClick={addColumn}
                className="w-full py-2 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 border-dashed rounded-xl transition-all flex items-center justify-center gap-1">
                <Plus size={13}/> Tambah Kolom
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "appearance") {
    return (
      <div className="space-y-4">
        {/* Layout direction */}
        <div>
          <Label>Arah Layout</Label>
          <SSelect value={c.flexDir || "default"} onChange={(e) => onChange({ ...c, flexDir: e.target.value })}>
            <option value="default">Default</option>
            <option value="row">Row</option>
            <option value="column">Column</option>
          </SSelect>
        </div>
        {/* Width */}
        <div>
          <Label>Width</Label>
          <SSelect value={c.maxWidth || "max"} onChange={(e) => onChange({ ...c, maxWidth: e.target.value })}>
            <option value="max">Max</option>
            <option value="custom">Custom</option>
          </SSelect>
          {c.maxWidth === "custom" && (
            <SInput type="number" className="mt-2" placeholder="px" value={c.customWidth || 800}
              onChange={(e) => onChange({ ...c, customWidth: Number(e.target.value) })} />
          )}
        </div>
        {/* Height */}
        <div>
          <Label>Height</Label>
          <SSelect value={c.height || "auto"} onChange={(e) => onChange({ ...c, height: e.target.value })}>
            <option value="auto">Auto</option>
            <option value="full">Full Screen</option>
            <option value="custom">Custom</option>
          </SSelect>
          {c.height === "custom" && (
            <SInput type="number" className="mt-2" placeholder="px" value={c.customHeight || 400}
              onChange={(e) => onChange({ ...c, customHeight: Number(e.target.value) })} />
          )}
        </div>
        {/* Padding */}
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Padding V</Label><SInput type="number" value={c.paddingV ?? 16} onChange={(e) => onChange({ ...c, paddingV: Number(e.target.value) })} /></div>
          <div><Label>Padding H</Label><SInput type="number" value={c.paddingH ?? 16} onChange={(e) => onChange({ ...c, paddingH: Number(e.target.value) })} /></div>
        </div>
        {/* Gutter */}
        <SSlider label="Gutter (Jarak Kolom)" value={c.gutter ?? 16} min={0} max={80} unit="px" onChange={(v) => onChange({ ...c, gutter: v })} />

        {/* Background */}
        <div className="border-t border-zinc-800 pt-4">
          <Label>Background</Label>
          <SSelect value={c.bgType || "none"} onChange={(e) => onChange({ ...c, bgType: e.target.value })}>
            <option value="none">None</option>
            <option value="color">Color</option>
            <option value="gradient">Gradient</option>
            <option value="image">Image</option>
          </SSelect>
          {c.bgType === "color" && (
            <input type="color" value={c.bgColor || "#000000"} onChange={(e) => onChange({ ...c, bgColor: e.target.value })}
              className="w-full h-10 mt-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1 cursor-pointer" />
          )}
          {c.bgType === "gradient" && (
            <div className="mt-2 space-y-2">
              <div><Label>Sudut (Angle)</Label><SInput type="number" value={c.gradAngle ?? 90} min={0} max={360} onChange={(e) => onChange({ ...c, gradAngle: Number(e.target.value) })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Warna 1</Label><input type="color" value={c.gradColor1 || "#000000"} onChange={(e) => onChange({ ...c, gradColor1: e.target.value })} className="w-full h-8 rounded cursor-pointer border border-zinc-800 p-0.5" /></div>
                <div><Label>Warna 2</Label><input type="color" value={c.gradColor2 || "#333333"} onChange={(e) => onChange({ ...c, gradColor2: e.target.value })} className="w-full h-8 rounded cursor-pointer border border-zinc-800 p-0.5" /></div>
              </div>
            </div>
          )}
        </div>

        {/* Border */}
        <div className="border-t border-zinc-800 pt-4">
          <Label>Border</Label>
          <SSelect value={c.borderStyle || "none"} onChange={(e) => onChange({ ...c, borderStyle: e.target.value })}>
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </SSelect>
          {c.borderStyle && c.borderStyle !== "none" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div><Label>Thickness</Label><SInput type="number" value={c.borderWidth ?? 1} min={1} max={20} onChange={(e) => onChange({ ...c, borderWidth: Number(e.target.value) })} /></div>
              <div><Label>Color</Label><input type="color" value={c.borderColor || "#ffffff"} onChange={(e) => onChange({ ...c, borderColor: e.target.value })} className="w-full h-9 rounded cursor-pointer border border-zinc-800 p-0.5" /></div>
            </div>
          )}
        </div>

        {/* Corner Radius */}
        <SSlider label="Corner Radius" value={c.radius ?? 16} min={0} max={64} unit="px" onChange={(v) => onChange({ ...c, radius: v })} />

        {/* Drop Shadow */}
        <div className="border-t border-zinc-800 pt-4">
          <Label>Drop Shadow</Label>
          <div className="flex gap-1 flex-wrap">
            {(["none","light","medium","dark","custom"] as const).map((s) => (
              <button key={s} onClick={() => onChange({ ...c, shadow: s })}
                className={`text-[10px] px-2.5 py-1.5 rounded-lg capitalize transition-all ${(c.shadow || "none") === s ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white bg-zinc-900"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <ComingSoon tab={activeTab} />;
}

// ─── Buttons Panel ───────────────────────────────────────────────────────────

function ButtonsPanel({ content, onChange, activeTab }: any) {
  const c = content || {};
  const items: any[] = c.items || [];

  const updateItem = (i: number, key: string, val: any) => {
    const newItems = [...items]; newItems[i] = { ...newItems[i], [key]: val };
    onChange({ ...c, items: newItems });
  };
  const removeItem = (i: number) => onChange({ ...c, items: items.filter((_, idx) => idx !== i) });
  const addItem = () => onChange({ ...c, items: [...items, { id: nanoid(), label: "Tombol Baru", url: "https://", bgColor: "#14b8a6", textColor: "#ffffff" }] });

  if (activeTab === "properties") {
    return (
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-center text-zinc-600 text-xs italic py-4">Belum ada tombol. Klik tambah di bawah.</p>
        )}
        {items.map((item: any, i: number) => (
          <div key={item.id || i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/40">
              <span className="text-[10px] font-semibold text-zinc-400">Tombol {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <Label>Label</Label>
                <SInput value={item.label || ""} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Teks Tombol" />
              </div>
              <div>
                <Label>URL</Label>
                <SInput value={item.url || ""} onChange={(e) => updateItem(i, "url", e.target.value)} placeholder="https://..." className="font-mono text-xs" />
              </div>
              <div className="border-t border-zinc-800 pt-2">
                <Label>Style Tombol</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Ikon</span>
                    <SSelect value={item.icon || "none"} onChange={(e) => updateItem(i, "icon", e.target.value)}>
                      <option value="none">Tanpa Ikon</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="website">Website (Globe)</option>
                    </SSelect>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Tebal Border</span>
                    <SInput type="number" value={item.borderWidth || 0} min={0} max={10} onChange={(e) => updateItem(i, "borderWidth", Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Bg Color</span>
                    <input type="color" value={item.bgColor || "#14b8a6"} onChange={(e) => updateItem(i, "bgColor", e.target.value)} className="w-full h-8 rounded cursor-pointer border border-zinc-800 p-0.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Bg Opacity</span>
                    <SInput type="number" value={item.bgOpacity ?? 100} min={0} max={100} onChange={(e) => updateItem(i, "bgOpacity", Number(e.target.value))} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Border</span>
                    <input type="color" value={item.borderColor || "#ffffff"} onChange={(e) => updateItem(i, "borderColor", e.target.value)} className="w-full h-8 rounded cursor-pointer border border-zinc-800 p-0.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-600 block mb-1">Teks</span>
                    <input type="color" value={item.textColor || "#ffffff"} onChange={(e) => updateItem(i, "textColor", e.target.value)} className="w-full h-8 rounded cursor-pointer border border-zinc-800 p-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <Label>On Click (JS Opsional)</Label>
                <STextArea rows={2} value={item.onClick || ""} onChange={(e) => updateItem(i, "onClick", e.target.value)} placeholder={"console.log('clicked!');"} className="font-mono text-[10px]" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addItem}
          className="w-full py-2.5 text-xs font-semibold text-teal-400 hover:text-teal-300 bg-teal-950/30 hover:bg-teal-950/50 border border-teal-800/50 border-dashed rounded-xl transition-all flex items-center justify-center gap-1.5">
          <Plus size={13}/> Add Button
        </button>

        <div className="border-t border-zinc-800 pt-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer mt-2 text-[11px] text-zinc-300 font-medium">
            <input type="checkbox" checked={c.useGlassContainer || false} onChange={(e) => onChange({ ...c, useGlassContainer: e.target.checked })} className="accent-teal-500" />
            Gunakan Wadah Kaca (Glass Container)
          </label>
          <p className="text-[10px] text-zinc-500 mt-1">
            Bungkus semua tombol di dalam kotak semi-transparan dengan efek blur (Glassmorphism).
          </p>
        </div>
      </div>
    );
  }

  return <ComingSoon tab={activeTab} />;
}

// ─── Image Panel ─────────────────────────────────────────────────────────────

function ImagePanel({ content, onChange, activeTab, onUploadStart, onUploadEnd }: any) {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const c = content || {};

  const handleFile = async (file: File) => {
    if (!["image/jpeg","image/png","image/gif","image/svg+xml"].includes(file.type)) {
      showToast("Format tidak didukung (JPEG/PNG/GIF/SVG)", "error"); return;
    }
    if (file.size > 2 * 1024 * 1024) { showToast("Ukuran maksimal 2MB", "error"); return; }
    setUploading(true); onUploadStart?.();
    try {
      const result = await processImageToBase64(file);
      onChange({ ...c, url: result.url, storageKey: result.storageKey });
    } catch (e: any) { showToast(e.message || "Upload gagal", "error"); }
    finally { setUploading(false); onUploadEnd?.(); }
  };

  if (activeTab === "properties") {
    return (
      <div className="space-y-4">
        {/* Upload zone */}
        <div>
          <input ref={fileRef} type="file" className="hidden" accept="image/jpeg,image/png,image/gif,image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            {/* Preview */}
            <div className="bg-zinc-900 min-h-[120px] flex items-center justify-center relative">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-teal-400" size={24} />
                  <span className="text-xs text-zinc-500">Uploading...</span>
                </div>
              ) : c.url ? (
                <img src={c.url} alt={c.alt || ""} className="max-h-40 object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <ImageIcon size={28} />
                  <span className="text-xs">Belum ada gambar</span>
                </div>
              )}
            </div>
            {/* Action bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-800 bg-zinc-900/40">
              <button onClick={() => fileRef.current?.click()}
                className="flex-1 py-1.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-teal-950 rounded-lg transition-colors">
                Upload
              </button>
              {c.url && (
                <button onClick={() => onChange({ ...c, url: "", storageKey: "" })}
                  className="py-1.5 px-2.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 rounded-lg transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <p className="text-[9px] text-zinc-600 text-center py-1.5">JPEG, PNG, GIF (maks 2MB), SVG</p>
          </div>
        </div>

        <div><Label>Title (Opsional)</Label><SInput value={c.title || ""} onChange={(e) => onChange({ ...c, title: e.target.value })} placeholder="Judul gambar" /></div>
        <div><Label>Alternate Text</Label><SInput value={c.alt || ""} onChange={(e) => onChange({ ...c, alt: e.target.value })} placeholder="Deskripsi gambar untuk SEO / aksesibilitas" /></div>
        <div><Label>Link URL (Opsional)</Label><SInput value={c.linkUrl || ""} onChange={(e) => onChange({ ...c, linkUrl: e.target.value })} placeholder="https://..." className="font-mono text-xs" /></div>

        <div className="border-t border-zinc-800 pt-3">
          <Label>Options</Label>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input type="checkbox" checked={c.optimize ?? true} onChange={(e) => onChange({ ...c, optimize: e.target.checked })} className="rounded accent-teal-500" />
            <span className="text-xs text-zinc-400">Optimize Image (kompresi otomatis)</span>
          </label>
        </div>
      </div>
    );
  }

  return <ComingSoon tab={activeTab} />;
}

// ─── Divider Panel ───────────────────────────────────────────────────────────

function DividerPanel({ content, onChange, activeTab }: any) {
  const c = content || {};

  if (activeTab === "properties") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Style</Label>
          <SSelect value={c.style || "single"} onChange={(e) => onChange({ ...c, style: e.target.value })}>
            <option value="single">Single</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </SSelect>
        </div>
        <div>
          <Label>Orientation</Label>
          <SSelect value={c.orientation || "horizontal"} onChange={(e) => onChange({ ...c, orientation: e.target.value })}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </SSelect>
        </div>
        <div>
          <Label>Color</Label>
          <input type="color" value={c.color || "#52525b"} onChange={(e) => onChange({ ...c, color: e.target.value })}
            className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 p-1 cursor-pointer" />
        </div>
        <div>
          <Label>Gradient (Opsional)</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={c.useGradient || false} onChange={(e) => onChange({ ...c, useGradient: e.target.checked })} className="rounded accent-teal-500" />
            <span className="text-xs text-zinc-400">Aktifkan gradient</span>
          </label>
          {c.useGradient && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input type="color" value={c.gradColor1 || "#52525b"} onChange={(e) => onChange({ ...c, gradColor1: e.target.value })} className="w-full h-8 rounded border border-zinc-800 p-0.5 cursor-pointer" />
              <input type="color" value={c.gradColor2 || "#27272a"} onChange={(e) => onChange({ ...c, gradColor2: e.target.value })} className="w-full h-8 rounded border border-zinc-800 p-0.5 cursor-pointer" />
            </div>
          )}
        </div>
        <SSlider label="Width" value={c.width ?? 80} min={1} max={100} unit="%" onChange={(v) => onChange({ ...c, width: v })} />
        <SSlider label="Thickness" value={c.thickness ?? 1} min={1} max={20} unit="px" onChange={(v) => onChange({ ...c, thickness: v })} />
        <SSlider label="Corner Rounding" value={c.radius ?? 0} min={0} max={20} unit="px" onChange={(v) => onChange({ ...c, radius: v })} />
        <SSlider label="Margins" value={c.margin ?? 24} min={0} max={100} unit="px" onChange={(v) => onChange({ ...c, margin: v })} />
        <div>
          <Label>Alignment</Label>
          <SSelect value={c.align || "auto"} onChange={(e) => onChange({ ...c, align: e.target.value })}>
            <option value="auto">Auto</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </SSelect>
        </div>
        <div>
          <Label>Mobile</Label>
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {(["auto","manual"] as const).map((m) => (
              <button key={m} onClick={() => onChange({ ...c, mobile: m })}
                className={`flex-1 text-xs py-1.5 rounded-md capitalize transition-all ${(c.mobile || "auto") === m ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <ComingSoon tab={activeTab} />;
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
  const blockLabel = showPageSettings ? "Background" : (blockType ? BLOCK_LABELS[blockType] : "Settings");

  // Divider only has properties, animation, settings (no appearance)
  const tabs = blockType === "divider"
    ? TABS.filter((t) => t.id !== "appearance")
    : TABS;

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
    <aside className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[300px] bg-zinc-950 border-l border-zinc-800 z-40 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          {BlockIcon && <BlockIcon size={14} className="text-teal-400 shrink-0" />}
          <span className="text-[11px] font-bold tracking-widest text-zinc-200 uppercase">{blockLabel}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-all">
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      {!showPageSettings && (
        <div className="flex items-center border-b border-zinc-800 shrink-0 px-1 py-1 gap-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg transition-all group ${
                  isActive ? "bg-zinc-800 text-teal-400" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>
      )}

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {renderPanel()}
      </div>

      {/* Action bar bawah (hanya untuk block, bukan page settings) */}
      {!showPageSettings && selectedBlock && (
        <div className="shrink-0 border-t border-zinc-800 p-3 flex items-center gap-2">
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
              title="Hapus"
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={handleDone}
            className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              doneFlash ? "bg-teal-400 text-teal-950" : "bg-teal-500 hover:bg-teal-400 text-teal-950"
            }`}
          >
            {doneFlash ? <Check size={14} /> : null}
            Done
          </button>
        </div>
      )}
    </aside>
  );
}
