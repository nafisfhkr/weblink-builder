"use client";

import { Type, Box, MousePointerClick, ImageIcon, Minus } from "lucide-react";

type BlockType = "text" | "container" | "buttons" | "image" | "divider";

interface BlockPickerProps {
  onSelectBlock: (type: BlockType) => void;
  onClose: () => void;
}

const BLOCK_TYPES: {
  value: BlockType;
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    value: "text",
    label: "Text",
    description: "Paragraf atau judul",
    icon: Type,
    iconBg: "bg-sky-950/60",
    iconColor: "text-sky-400",
  },
  {
    value: "container",
    label: "Container",
    description: "Wadah layout kolom",
    icon: Box,
    iconBg: "bg-violet-950/60",
    iconColor: "text-violet-400",
  },
  {
    value: "buttons",
    label: "Buttons",
    description: "Tombol dengan URL",
    icon: MousePointerClick,
    iconBg: "bg-teal-950/60",
    iconColor: "text-teal-400",
  },
  {
    value: "image",
    label: "Image",
    description: "Foto atau gambar",
    icon: ImageIcon,
    iconBg: "bg-amber-950/60",
    iconColor: "text-amber-400",
  },
  {
    value: "divider",
    label: "Divider",
    description: "Garis pembatas",
    icon: Minus,
    iconBg: "bg-zinc-800/60",
    iconColor: "text-zinc-400",
  },
];

export default function BlockPicker({ onSelectBlock, onClose }: BlockPickerProps) {
  return (
    <>
      {/* Invisible backdrop to close on outside click */}
      <div className="fixed inset-0 z-[59]" onClick={onClose} />

      {/* Compact popup — positioned above the toolbar via parent wrapper */}
      <div
        className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-[60] w-[220px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header strip */}
        <div className="px-3 py-2 border-b border-zinc-800/80">
          <p className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">Tambah Blok</p>
        </div>

        {/* Block list */}
        <div className="p-1.5 flex flex-col gap-0.5">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon;
            return (
              <button
                key={block.value}
                id={`block-picker-${block.value}`}
                onClick={() => {
                  onSelectBlock(block.value);
                  onClose();
                }}
                className="group w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-zinc-900 text-left transition-all cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${block.iconBg}`}>
                  <Icon size={14} className={block.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 leading-tight">{block.label}</p>
                  <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 truncate">{block.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
