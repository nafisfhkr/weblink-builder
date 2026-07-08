"use client";

import { ImageIcon } from "lucide-react";

interface ImageBlockDisplayProps {
  content: {
    url?: string;
    alt?: string;
    storageKey?: string;
    aspectRatio?: "widescreen" | "square" | "circle";
  };
  isUploading?: boolean;
  cardStyle?: React.CSSProperties;
}

export default function ImageBlock({ content, isUploading, cardStyle }: ImageBlockDisplayProps) {
  const url = content?.url || "";
  const alt = content?.alt || "";
  const ratio = content?.aspectRatio || "widescreen";

  let containerShape = "rounded-2xl";
  let wrapperClass = "relative w-full";

  if (ratio === "widescreen") {
    containerShape = "rounded-2xl";
    wrapperClass += " aspect-[16/9]";
  } else if (ratio === "square") {
    containerShape = "rounded-2xl";
    wrapperClass += " aspect-square";
  } else if (ratio === "circle") {
    containerShape = "rounded-full max-w-[200px] mx-auto";
    wrapperClass += " aspect-square";
  }

  if (isUploading) {
    return (
      <div className={`w-full aspect-[16/9] bg-zinc-900 border border-zinc-800 ${containerShape} flex flex-col items-center justify-center gap-2`}>
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-zinc-500">Mengunggah gambar...</span>
      </div>
    );
  }

  if (!url) {
    return (
      <div className={`w-full aspect-[16/9] bg-zinc-900/60 border border-dashed border-zinc-700 ${containerShape} flex flex-col items-center justify-center gap-2 text-zinc-600`}>
        <ImageIcon size={28} />
        <span className="text-xs">Klik blok ini lalu upload gambar di sidebar kiri</span>
      </div>
    );
  }

  return (
    <div 
      style={cardStyle}
      className={`w-full overflow-hidden border border-zinc-800 bg-[#1a1a1a] shadow-md ${containerShape}`}
    >
      <div className={wrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt || "Image Block"}
          className="object-cover w-full h-full"
        />
      </div>
      {alt && (
        <p className="text-[10px] text-zinc-600 text-center px-4 py-2">{alt}</p>
      )}
    </div>
  );
}
