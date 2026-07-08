"use client";

import { InstagramIcon, TiktokIcon, XIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Globe } from "lucide-react";

interface SocialItem {
  platform: string;
  url: string;
}

interface SocialBlockDisplayProps {
  content: {
    items?: SocialItem[];
  };
  cardStyle?: React.CSSProperties;
  useCard?: boolean;
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: InstagramIcon },
  { value: "tiktok", label: "TikTok", icon: TiktokIcon },
  { value: "x", label: "X / Twitter", icon: XIcon },
  { value: "youtube", label: "YouTube", icon: YoutubeIcon },
  { value: "facebook", label: "Facebook", icon: FacebookIcon },
];

function getPlatformUrl(platform: string, input: string) {
  if (!input) return "#";
  const trimmed = input.trim();
  
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  
  if (/^(www\.)?[a-z0-9\-]+\.[a-z]{2,}/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  
  const username = trimmed.replace(/^@/, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${username}`;
    case "tiktok":
      return `https://tiktok.com/@${username}`;
    case "x":
      return `https://x.com/${username}`;
    case "youtube":
      return `https://youtube.com/@${username}`;
    case "facebook":
      return `https://facebook.com/${username}`;
    default:
      return `https://${username}`;
  }
}
export default function SocialBlock({ content, cardStyle, useCard = true }: SocialBlockDisplayProps) {
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
            href={getPlatformUrl(item.platform, item.url)}
            target="_blank"
            rel="noopener noreferrer"
            style={useCard ? cardStyle : undefined}
            className={`p-3 text-zinc-400 hover:text-white rounded-full hover:scale-110 transition-all ${
              useCard ? "bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 shadow-md" : ""
            }`}
            title={platformConfig?.label || item.platform}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}
