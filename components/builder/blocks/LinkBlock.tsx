"use client";

import { ExternalLink } from "lucide-react";

interface LinkBlockDisplayProps {
  content: {
    title?: string;
    url?: string;
  };
  cardStyle?: React.CSSProperties;
}

export default function LinkBlock({ content, cardStyle }: LinkBlockDisplayProps) {
  const title = content?.title || "";
  const url = content?.url || "";

  return (
    <div className="w-full">
      <div 
        style={cardStyle}
        className="w-full flex items-center justify-between bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 text-white py-4 px-6 rounded-full transition-all font-semibold tracking-wide shadow-md group cursor-default"
      >
        <span className={!title ? "text-zinc-600 italic font-normal text-sm" : ""}>
          {title || "Judul Tautan..."}
        </span>
        <div className="flex items-center gap-2">
          {url && (
            <span className="text-zinc-600 text-xs truncate max-w-[120px] hidden sm:block">
              {url.replace(/^https?:\/\//, "")}
            </span>
          )}
          <ExternalLink size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
        </div>
      </div>
    </div>
  );
}
