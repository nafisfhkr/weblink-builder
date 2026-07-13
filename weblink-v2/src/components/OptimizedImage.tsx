"use client";

import React, { useState, useEffect, useRef } from "react";
import { getOptimizedImageUrl } from "src/lib/imageOptimization";
import { Info } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  originalWidth?: number;
  originalHeight?: number;
  format?: string;
  bytes?: number;
  isEditor?: boolean;
  wrapperClassName?: string;
}

export default function OptimizedImage({
  src,
  originalWidth,
  originalHeight,
  format,
  bytes,
  isEditor,
  className,
  wrapperClassName,
  alt,
  ...props
}: OptimizedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderWidth, setRenderWidth] = useState<number>(0);
  const [renderHeight, setRenderHeight] = useState<number>(0);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0) {
        setRenderWidth((prev) => (!prev || width > prev + 50 ? width : prev));
        setRenderHeight((prev) => (!prev || height > prev + 50 ? height : prev));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const optimizedSrc =
    renderWidth > 0 && src
      ? getOptimizedImageUrl(src, { width: renderWidth })
      : src;

  const isLowRes = originalWidth && renderWidth > 0 && originalWidth < renderWidth;

  return (
    <div ref={containerRef} className={`relative group ${wrapperClassName ?? "w-full h-full"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optimizedSrc}
        alt={alt}
        className={className}
        {...props}
      />
      
      {isEditor && originalWidth && renderWidth > 0 && (
        <>
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setShowInspector(!showInspector);
            }}
          >
            <div className={`p-1.5 rounded-full backdrop-blur-md shadow-lg ${isLowRes ? 'bg-red-500/80' : 'bg-black/50'}`}>
              <Info size={16} className="text-white" />
            </div>
          </div>
          
          {showInspector && (
            <div className="absolute top-10 right-2 bg-zinc-950/90 border border-zinc-800 p-3 rounded-xl shadow-2xl text-[11px] z-30 min-w-[180px] backdrop-blur-md text-zinc-300 pointer-events-none">
              <div className="font-bold text-white mb-2 border-b border-zinc-800 pb-1">Image Inspector</div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500">Resolusi Asli:</span>
                <span>{originalWidth} x {originalHeight || "N/A"} px</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500">Resolusi Render:</span>
                <span>{Math.round(renderWidth)} x {Math.round(renderHeight)} px</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500">Rasio Skala:</span>
                <span>{Math.round((renderWidth / originalWidth) * 100)}%</span>
              </div>
              {bytes && (
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-500">Ukuran File:</span>
                  <span>{(bytes / 1024).toFixed(1)} KB</span>
                </div>
              )}
              {format && (
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-500">Format:</span>
                  <span className="uppercase">{format}</span>
                </div>
              )}
              <div className="mt-2 pt-1 border-t border-zinc-800 flex justify-between items-center font-semibold">
                <span className="text-zinc-500">Status Kualitas:</span>
                <span className={isLowRes ? "text-red-400" : "text-teal-400"}>
                  {isLowRes ? "Pecah (Upscaled)" : "Optimal"}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
