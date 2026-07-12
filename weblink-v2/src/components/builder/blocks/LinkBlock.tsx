"use client";

import { ExternalLink } from "lucide-react";
import { WhatsappIcon, WebIcon } from "src/components/ui/SocialIcons";

interface LinkBlockDisplayProps {
  content: {
    title?: string;
    url?: string;
    icon?: string;
  };
  cardStyle?: React.CSSProperties;
}

export default function LinkBlock({ content, cardStyle }: LinkBlockDisplayProps) {
  const title = content?.title || "";
  const url = content?.url || "";
  const iconType = content?.icon || "default";

  let IconComponent: any = ExternalLink;
  if (iconType === "whatsapp") IconComponent = WhatsappIcon;
  else if (iconType === "web") IconComponent = WebIcon;

  return (
    <div className="w-full">
      <div 
        style={cardStyle}
        className="w-full flex items-center justify-between py-1.5 px-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] font-semibold tracking-wide shadow-md group cursor-default"
      >
        <span className={!title ? "text-zinc-600 italic font-normal text-sm" : ""}>
          {title || "Judul Tautan..."}
        </span>
        <div className="flex items-center gap-2">
          {iconType === "default" && url && (
            <span className="text-zinc-600 text-xs truncate max-w-[120px] hidden sm:block">
              {url.replace(/^https?:\/\//, "")}
            </span>
          )}
          {iconType !== "none" && (
            <IconComponent 
              size={20} 
              className={iconType !== "default" ? "text-white" : "text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0"} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
