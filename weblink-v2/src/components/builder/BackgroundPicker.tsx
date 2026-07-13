"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Trash2, Palette } from "lucide-react";
import { useToast } from "src/components/ui/Toast";
import { processImageToBase64 } from "src/lib/imageProcessor";

export interface PageSettings {
  type: "color" | "gradient" | "image";
  color?: string;
  gradient?: string;
  imageUrl?: string;
  storageKey?: string;
  // Card styles
  cardBgColor?: string;
  cardBgOpacity?: number;
  cardTextColor?: string;
  cardBorderColor?: string;
  cardBorderOpacity?: number;
  cardBlur?: number;
  cardShowHeadingCard?: boolean;
  imageOverlayOpacity?: number;
  profileImageUrl?: string;
  profileTitle?: string;
  profileBio?: string;
  fontFamily?: string;
  blockSpacing?: number;
  profileSpacing?: number;
  showProfile?: boolean;
  backgroundOverlayOpacity?: number;
  imageWidth?: number;
  imageHeight?: number;
  imageFormat?: string;
  imageBytes?: number;
  profileImageWidth?: number;
  profileImageHeight?: number;
  profileImageFormat?: string;
  profileImageBytes?: number;
  profileImageGlassEffect?: boolean;
}

interface BackgroundPickerProps {
  settings: PageSettings;
  onChange: (settings: PageSettings) => void;
}

const PRESET_COLORS = [
  "#0a0a0a", "#0f172a", "#1a0a2e", "#0a1a0f",
  "#1a1a0a", "#1a0a0a", "#0d1117", "#18181b",
  "#1e1b4b", "#14532d", "#7c2d12", "#1e3a5f",
];

const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)",
  "linear-gradient(135deg, #0a1628 0%, #1a3a2a 100%)",
  "linear-gradient(135deg, #1a0a0a 0%, #2e1a00 100%)",
  "linear-gradient(180deg, #09090b 0%, #18181b 100%)",
  "linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 100%)",
  "linear-gradient(135deg, #020617 0%, #0f2027 100%)",
];

export default function BackgroundPicker({ settings, onChange }: BackgroundPickerProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"color" | "gradient" | "image">(settings.type || "color");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: "color" | "gradient" | "image") => {
    setActiveTab(tab);
    if (tab === "color") {
      onChange({ ...settings, type: "color", color: settings.color || "#0a0a0a" });
    } else if (tab === "gradient") {
      onChange({ ...settings, type: "gradient", gradient: settings.gradient || PRESET_GRADIENTS[0] });
    } else {
      onChange({ ...settings, type: "image" });
    }
  };

  const handleUpload = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format tidak didukung (Gunakan JPG, PNG, atau WebP)", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran maksimal 5MB", "error");
      return;
    }

    setIsUploading(true);
    try {
      const result = await processImageToBase64(file);
      onChange({ 
        ...settings, 
        type: "image", 
        imageUrl: result.url, 
        storageKey: result.storageKey,
        imageWidth: result.width,
        imageHeight: result.height,
        imageFormat: result.format,
        imageBytes: result.bytes
      });
      showToast("Foto background berhasil diunggah", "success");
    } catch {
      showToast("Upload gagal, coba lagi", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpload = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format tidak didukung (Gunakan JPG, PNG, atau WebP)", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran maksimal 2MB", "error");
      return;
    }

    showToast("Mengunggah foto profil...", "success");
    try {
      const result = await processImageToBase64(file);
      onChange({ 
        ...settings, 
        profileImageUrl: result.url,
        profileImageWidth: result.width,
        profileImageHeight: result.height,
        profileImageFormat: result.format,
        profileImageBytes: result.bytes
      });
      showToast("Foto profil berhasil diunggah", "success");
    } catch {
      showToast("Upload gagal, coba lagi", "error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Palette size={14} className="text-teal-400" />
        <label className="sidebar-label !mb-0">Background Halaman</label>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1 flex-wrap">
        {(["color", "gradient", "image", "Layout"] as const).map((tab) => (
          <button
            key={tab}
            id={`bg-tab-${tab}`}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 text-[10px] py-1.5 rounded-md font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-zinc-700 text-white shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab === "color" ? "Warna" : tab === "gradient" ? "Gradasi" : tab === "image" ? "Foto" : tab}
          </button>
        ))}
      </div>

      {/* Color Tab */}
      {activeTab === "color" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onChange({ ...settings, type: "color", color })}
                title={color}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  settings.color === color ? "border-teal-400 scale-110" : "border-zinc-800 hover:border-zinc-600"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-zinc-500 shrink-0">Custom:</label>
            <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5">
              <input
                id="bg-color-picker"
                type="color"
                value={settings.color || "#0a0a0a"}
                onChange={(e) => onChange({ ...settings, type: "color", color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={settings.color || "#0a0a0a"}
                onChange={(e) => onChange({ ...settings, type: "color", color: e.target.value })}
                className="flex-1 bg-transparent text-zinc-300 text-xs font-mono outline-none"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      )}

      {/* Gradient Tab */}
      {activeTab === "gradient" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            {PRESET_GRADIENTS.map((grad) => (
              <button
                key={grad}
                onClick={() => onChange({ ...settings, type: "gradient", gradient: grad })}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  settings.gradient === grad ? "border-teal-400 scale-110" : "border-zinc-800 hover:border-zinc-600"
                }`}
                style={{ background: grad }}
              />
            ))}
          </div>
          <p className="text-[10px] text-zinc-600">Klik preset gradasi di atas untuk memilih</p>
        </div>
      )}

      {/* Image Tab */}
      {activeTab === "image" && (
        <div className="flex flex-col gap-3">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]); }}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative min-h-[120px] border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-4 overflow-hidden ${
              dragOver ? "border-teal-500 bg-teal-950/20" :
              settings.imageUrl ? "border-zinc-700 bg-zinc-900/30" :
              "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600"
            }`}
          >
            <input
              id="bg-image-upload"
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-teal-400" size={20} />
                <span className="text-xs text-zinc-400">Uploading...</span>
              </div>
            ) : settings.imageUrl ? (
              <div className="relative w-full flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.imageUrl} alt="" className="max-h-[90px] rounded-lg object-cover w-full border border-zinc-800" />
                <span className="text-[10px] text-zinc-500 mt-1.5">Drag atau klik untuk ganti</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-1.5">
                <UploadCloud className="text-zinc-500" size={22} />
                <p className="text-xs text-zinc-300 font-medium">Upload foto background</p>
                <p className="text-[10px] text-zinc-600">JPG, PNG, WebP · Max 5MB</p>
              </div>
            )}
          </div>

          {settings.imageUrl && (
            <button
              id="bg-image-remove"
              onClick={() => onChange({ ...settings, imageUrl: "", storageKey: "" })}
              className="text-xs flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-800 px-3 py-1.5 rounded-lg transition-all bg-red-950/30"
            >
              <Trash2 size={13} /> Hapus Foto Background
            </button>
          )}

          {/* Image Overlay Opacity */}
          {settings.imageUrl && (
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between items-center text-[11px] text-zinc-400">
                <span>Transparansi Overlay Gelap</span>
                <span className="font-mono">{settings.imageOverlayOpacity ?? 55}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.backgroundOverlayOpacity ?? settings.imageOverlayOpacity ?? 55}
                onChange={(e) => onChange({ ...settings, backgroundOverlayOpacity: parseInt(e.target.value), imageOverlayOpacity: parseInt(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>
          )}

          {/* Overlay opacity hint */}
          {settings.imageUrl && (
            <p className="text-[10px] text-zinc-600">
              Atur transparansi overlay gelap agar teks tetap terbaca dengan jelas.
            </p>
          )}
        </div>
      )}

      {/* Live Preview Strip */}
      <div className="mt-1">
        <p className="sidebar-label">Preview Background</p>
        <div
          className="w-full h-12 rounded-lg border border-zinc-800 overflow-hidden relative"
          style={
            settings.type === "image" && settings.imageUrl
              ? { backgroundImage: `url(${settings.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : settings.type === "gradient" && settings.gradient
              ? { background: settings.gradient }
              : { backgroundColor: settings.color || "#0a0a0a" }
          }
        >
          {(settings.type === "image" || settings.type === "color" || settings.type === "gradient") && (
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: `rgba(0, 0, 0, ${(settings.backgroundOverlayOpacity ?? settings.imageOverlayOpacity ?? 0) / 100})` }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-white/60 font-mono tracking-wider">PREVIEW</span>
          </div>
        </div>
      </div>

      {/* Layout & Profil Tab */}
      {activeTab === "Layout" as any && (
        <div className="flex flex-col gap-6">
          {/* Overlay Background Global */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px] text-zinc-400">
              <span>Pencahayaan / Gelap Background</span>
              <span className="font-mono">{settings.backgroundOverlayOpacity ?? settings.imageOverlayOpacity ?? 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.backgroundOverlayOpacity ?? settings.imageOverlayOpacity ?? 0}
              onChange={(e) => onChange({ ...settings, backgroundOverlayOpacity: parseInt(e.target.value), imageOverlayOpacity: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <p className="text-[9px] text-zinc-500 mt-1">Menggelapkan latar belakang agar teks lebih terbaca.</p>
          </div>

          <div className="w-full h-px bg-zinc-800" />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px] text-zinc-400">
              <span>Jarak Antar Blok (Gap)</span>
              <span className="font-mono">{settings.blockSpacing ?? 16}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={settings.blockSpacing ?? 16}
              onChange={(e) => onChange({ ...settings, blockSpacing: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <p className="text-[9px] text-zinc-500 mt-1">Mengatur jarak renggang/mepet antar card.</p>
          </div>

          <div className="w-full h-px bg-zinc-800" />

          {/* Font Picker */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] text-zinc-400 font-semibold">
              <span>Jenis Font Halaman</span>
            </div>
            <select
              value={settings.fontFamily || "inherit"}
              onChange={(e) => onChange({ ...settings, fontFamily: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-300 outline-none w-full appearance-none cursor-pointer focus:border-teal-500 transition-colors"
            >
              <option value="inherit">Default (Sans-Serif)</option>
              <option value="var(--font-dm-sans), sans-serif">Modern (DM Sans)</option>
              <option value="var(--font-barlow), sans-serif">Bold (Barlow)</option>
              <option value="Georgia, serif">Klasik (Serif)</option>
              <option value="'Courier New', monospace">Monospace (Courier)</option>
            </select>
          </div>

          <div className="w-full h-px bg-zinc-800" />

          {/* Profil Visibility */}
          <div className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col flex-1">
                <span className="text-xs text-zinc-200 font-semibold leading-tight">Tampilkan Info Profil</span>
                <span className="text-[10px] text-zinc-500 mt-1 leading-tight">Muncul di atas halaman</span>
              </div>
              <div
                onClick={() => onChange({ ...settings, showProfile: settings.showProfile === false ? true : false })}
                className={`relative w-10 h-5 shrink-0 rounded-full transition-colors cursor-pointer ${
                  settings.showProfile !== false ? "bg-teal-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    settings.showProfile !== false ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
              <div className="flex flex-col flex-1">
                <span className="text-xs text-zinc-200 font-semibold leading-tight">Efek Glass Profil</span>
                <span className="text-[10px] text-zinc-500 mt-1 leading-tight">Tambahkan ring transparan di belakang profil</span>
              </div>
              <div
                onClick={() => onChange({ ...settings, profileImageGlassEffect: settings.profileImageGlassEffect === false ? true : false })}
                className={`relative w-10 h-5 shrink-0 rounded-full transition-colors cursor-pointer ${
                  settings.profileImageGlassEffect !== false ? "bg-teal-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    settings.profileImageGlassEffect !== false ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div></div>
            
            {settings.showProfile !== false && (
              <div className="mt-3 pt-3 border-t border-zinc-800 flex flex-col gap-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-300">Jarak Profil & Blok</span>
                    <span className="text-xs text-zinc-500">{settings.profileSpacing ?? 32}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.profileSpacing ?? 32}
                    onChange={(e) => onChange({ ...settings, profileSpacing: Number(e.target.value) })}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
                
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-2">Custom Foto Profil</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  ref={profileInputRef}
                  onChange={(e) => { if (e.target.files?.[0]) handleProfileUpload(e.target.files[0]); }}
                />
                {settings.profileImageUrl ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center">
                      <img
                        src={settings.profileImageUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border border-zinc-700 shadow shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => profileInputRef.current?.click()}
                        className="flex-1 text-xs text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all bg-zinc-800 hover:bg-zinc-700"
                      >
                        Ganti Foto
                      </button>
                      <button
                        onClick={() => onChange({ ...settings, profileImageUrl: "" })}
                        className="flex-1 text-xs text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => profileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-white border border-dashed border-zinc-700 hover:border-zinc-500 px-3 py-5 rounded-xl transition-all bg-zinc-900 hover:bg-zinc-800"
                  >
                    <UploadCloud size={20} className="text-zinc-500" />
                    <span className="text-xs font-medium">Upload Foto Profil</span>
                    <span className="text-[10px] text-zinc-600">JPG, PNG, WebP · Maks 2MB</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
