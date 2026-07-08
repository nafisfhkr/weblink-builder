"use client";

import { useEffect, useState } from "react";
import { Camera, Play, Globe, Plus, Trash2, Music } from "lucide-react";

interface SocialItem {
  platform: string;
  url: string;
}

interface SocialBlockProps {
  data: {
    items?: SocialItem[];
  };
  onChange: (newData: { items: SocialItem[] }) => void;
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "x", label: "X / Twitter", icon: Globe },
  { value: "youtube", label: "YouTube", icon: Play },
  { value: "facebook", label: "Facebook", icon: Globe },
];

export default function SocialBlock({ data, onChange }: SocialBlockProps) {
  const [items, setItems] = useState<SocialItem[]>(data.items || []);

  useEffect(() => {
    setItems(data.items || []);
  }, [data]);

  const updateItem = (index: number, field: keyof SocialItem, value: string) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updated);
    onChange({ items: updated });
  };

  const handleUrlBlur = (index: number, value: string) => {
    let finalVal = value.trim();
    if (finalVal && !/^https?:\/\//i.test(finalVal)) {
      finalVal = `https://${finalVal}`;
      const updated = items.map((item, i) => (i === index ? { ...item, url: finalVal } : item));
      setItems(updated);
      onChange({ items: updated });
    }
  };

  const addItem = () => {
    const unusedPlatform = AVAILABLE_PLATFORMS.find(
      (p) => !items.some((item) => item.platform === p.value)
    );
    const platformToAdd = unusedPlatform ? unusedPlatform.value : "instagram";
    const updated = [...items, { platform: platformToAdd, url: "" }];
    setItems(updated);
    onChange({ items: updated });
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange({ items: updated });
  };

  return (
    <div className="w-full flex flex-col gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Social Links Row
        </label>
        <button
          onClick={addItem}
          className="text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={14} /> Add Platform
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-4 text-xs text-zinc-600 italic">
          No social links added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            const platformConfig = AVAILABLE_PLATFORMS.find((p) => p.value === item.platform);
            const Icon = platformConfig?.icon || Globe;

            return (
              <div key={index} className="flex items-center gap-2 bg-zinc-900/60 p-2 border border-zinc-800/80 rounded-lg">
                <div className="text-zinc-400 p-1 bg-zinc-900 border border-zinc-850 rounded">
                  <Icon size={16} />
                </div>
                <select
                  value={item.platform}
                  onChange={(e) => updateItem(index, "platform", e.target.value)}
                  className="bg-zinc-900 text-zinc-300 text-xs border border-zinc-800 focus:border-zinc-700 rounded px-1.5 py-1 outline-none"
                >
                  {AVAILABLE_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(index, "url", e.target.value)}
                  onBlur={(e) => handleUrlBlur(index, e.target.value)}
                  placeholder="Username / URL"
                  className="flex-1 bg-zinc-900 text-white text-xs border border-zinc-800 focus:border-zinc-700 rounded px-2.5 py-1 outline-none"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="text-zinc-500 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
