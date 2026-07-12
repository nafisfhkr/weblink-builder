"use client";

import { ImageIcon } from "lucide-react";
import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";

interface ImageBlockDisplayProps {
  content: {
    url?: string;
    alt?: string;
    storageKey?: string;
    aspectRatio?: "widescreen" | "square" | "circle";
    linkUrl?: string;
    useCard?: boolean;
    cardBgColor?: string;
    cardBgOpacity?: number;
    cardBorderColor?: string;
    cardBorderOpacity?: number;
    cardBlur?: number;
  };
  isUploading?: boolean;
}

export default function ImageBlock({ content, isUploading }: ImageBlockDisplayProps) {
  const url = content?.url || "";
  const alt = content?.alt || "";
  const ratio = content?.aspectRatio || "widescreen";
  const useCard = content?.useCard ?? false;
  const cardStyle = buildCardStyle(content);

  let containerShape = "rounded-2xl";
  let wrapperClass = "relative w-full";

  if (ratio === "widescreen") {
    wrapperClass += " aspect-[16/9]";
  } else if (ratio === "square") {
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
        <span className="text-xs">Klik blok ini lalu upload gambar di sidebar</span>
      </div>
    );
  }

  const imageEl = (
    <div className={`w-full overflow-hidden ${containerShape} ${useCard ? "" : ""}`}>
      <div className={wrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt || "Image Block"}
          className="object-cover w-full h-full"
        />
      </div>
      {alt && (
        <p className="text-[10px] text-center px-4 py-2 opacity-60">{alt}</p>
      )}
    </div>
  );

  const wrapped = content?.linkUrl ? (
    <a href={content.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
      {imageEl}
    </a>
  ) : imageEl;

  if (!useCard) return wrapped;

  return (
    <div
      className={`w-full ${cardWrapperClass(true)} p-3`}
      style={cardStyle}
    >
      {wrapped}
    </div>
  );
}
