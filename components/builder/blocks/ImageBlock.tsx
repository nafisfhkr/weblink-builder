"use client";

import { useEffect, useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";

interface ImageBlockProps {
  data: {
    url?: string;
    alt?: string;
    storageKey?: string;
  };
  onChange: (newData: { url?: string; alt?: string; storageKey?: string }) => void;
}

export default function ImageBlock({ data, onChange }: ImageBlockProps) {
  const [url, setUrl] = useState(data.url || "");
  const [alt, setAlt] = useState(data.alt || "");
  const [storageKey, setStorageKey] = useState(data.storageKey || "");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(data.url || "");
    setAlt(data.alt || "");
    setStorageKey(data.storageKey || "");
  }, [data]);

  const handleUpload = async (file: File) => {
    setError("");
    // Client-side validations
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung (gunakan JPG/PNG/WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file melebihi 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal mengunggah gambar");
      }

      const uploadResult = await res.json();
      setUrl(uploadResult.url);
      setStorageKey(uploadResult.storageKey);
      onChange({ url: uploadResult.url, alt, storageKey: uploadResult.storageKey });
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 100);
    setAlt(val);
    onChange({ url, alt: val, storageKey });
  };

  const handleRemove = () => {
    setUrl("");
    setStorageKey("");
    onChange({ url: "", alt, storageKey: "" });
  };

  return (
    <div className="w-full flex flex-col gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        Image Block
      </label>

      {/* Image Preview / Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative min-h-[160px] border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-4 cursor-pointer overflow-hidden ${
          dragOver
            ? "border-blue-500 bg-blue-950/20"
            : url
            ? "border-zinc-800 bg-zinc-900/20"
            : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-500" size={24} />
            <span className="text-xs text-zinc-400 font-medium">Uploading image...</span>
          </div>
        ) : url ? (
          <div className="relative group w-full flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt || "Image Preview"}
              className="max-h-[140px] rounded-lg object-contain border border-zinc-800 bg-black/40"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 hover:bg-red-950 border border-zinc-800 hover:border-red-900 p-1.5 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                 onClick={(e) => {
                   e.stopPropagation();
                   handleRemove();
                 }}>
              <Trash2 size={14} />
            </div>
            <span className="text-[10px] text-zinc-500 mt-2">Click or drag new image to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <UploadCloud className="text-zinc-500" size={28} />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-300 font-medium">Drag & Drop Image Here</span>
              <span className="text-[10px] text-zinc-500">Supports JPG, PNG, WebP up to 5MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium text-center">{error}</span>
      )}

      {/* Alt Text Input */}
      {url && (
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
            Alt Text / Description (Max 100)
          </label>
          <input
            type="text"
            value={alt}
            onChange={handleAltChange}
            placeholder="e.g. Profil foto Rina"
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          />
        </div>
      )}
    </div>
  );
}
