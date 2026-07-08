"use client";

import { Camera, Play, Globe, Music } from "lucide-react";

interface SocialItem {
  platform: string;
  url: string;
}

interface SocialBlockDisplayProps {
  content: {
    items?: SocialItem[];
  };
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "x", label: "X / Twitter", icon: Globe },
  { value: "youtube", label: "YouTube", icon: Play },
  { value: "facebook", label: "Facebook", icon: Globe },
];

export default function SocialBlock({ content }: SocialBlockDisplayProps) {
  const items = content?.items || [];

  if (items.length === 0) {
    return (
      <div className="w-full flex justify-center py-4 text-zinc-600 text-xs italic">
        Belum ada platform sosial. Tambahkan di sidebar kiri.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center gap-3 py-3">
      {items.map((item, i) => {
        const platformConfig = AVAILABLE_PLATFORMS.find((p) => p.value === item.platform);
        const Icon = platformConfig?.icon || Globe;
        return (
          <a
            key={i}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#1a1a1a] border border-zinc-800 text-zinc-400 hover:text-white rounded-full hover:scale-110 hover:border-zinc-600 transition-all shadow-md"
            title={platformConfig?.label || item.platform}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}
