"use client";

import { ImageIcon } from "lucide-react";
import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";
import OptimizedImage from "src/components/OptimizedImage";

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
    title?: string;
    bio?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    imageSize?: number;
    useGlassEffect?: boolean;
  };
  isUploading?: boolean;
  isEditor?: boolean;
}

export default function ImageBlock({ content, isUploading, isEditor }: ImageBlockDisplayProps) {
  const url = content?.url || "";
  const alt = content?.alt || "";
  const ratio = content?.aspectRatio || "widescreen";
  const useCard = content?.useCard ?? false;
  const cardStyle = buildCardStyle(content);

  let containerShape = "rounded-2xl";
  let wrapperClass = "relative w-full";
  let circleStyle: React.CSSProperties | undefined = undefined;
  let glassWrapperClass = "";
  
  const imageSize = content?.imageSize || 120;
  const useGlassEffect = content?.useGlassEffect ?? false;

  if (ratio === "widescreen") {
    wrapperClass += " aspect-[16/9]";
  } else if (ratio === "square") {
    wrapperClass += " aspect-square";
  } else if (ratio === "circle") {
    containerShape = "rounded-full mx-auto";
    wrapperClass += " aspect-square h-full w-full";
    circleStyle = { width: `${imageSize}px`, height: `${imageSize}px` };
    if (useGlassEffect) {
      glassWrapperClass = "p-[4px] rounded-full backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl flex items-center justify-center mx-auto";
    }
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

  const title = content?.title || "";
  const bio = content?.bio || "";

  const imageEl = (
    <div className={`w-full flex flex-col ${ratio === "circle" ? "items-center text-center" : ""} gap-3`}>
      {ratio === "circle" && useGlassEffect ? (
        <div className={glassWrapperClass} style={circleStyle}>
          <div className={`w-full h-full overflow-hidden ${containerShape}`}>
            <div className={wrapperClass}>
              <OptimizedImage
                src={url}
                alt={alt || title || "Image Block"}
                className="object-cover w-full h-full"
                originalWidth={content.width}
                originalHeight={content.height}
                format={content.format}
                bytes={content.bytes}
                isEditor={isEditor}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={`w-full overflow-hidden ${containerShape}`} style={circleStyle}>
          <div className={wrapperClass}>
            <OptimizedImage
              src={url}
              alt={alt || title || "Image Block"}
              className="object-cover w-full h-full"
              originalWidth={content.width}
              originalHeight={content.height}
              format={content.format}
              bytes={content.bytes}
              isEditor={isEditor}
            />
          </div>
        </div>
      )}
      {(title || bio || alt) && (
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {title && <h3 className="text-xl font-bold">{title}</h3>}
          {bio && <p className="text-sm opacity-80 max-w-md text-center">{bio}</p>}
          {alt && !title && !bio && <p className="text-[10px] text-center px-4 py-1 opacity-60">{alt}</p>}
        </div>
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
