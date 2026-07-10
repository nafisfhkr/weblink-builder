"use client";

import { Type, Box, MousePointerClick, ImageIcon, Minus, X } from "lucide-react";

type BlockType = "text" | "container" | "buttons" | "image" | "divider";

interface BlockPickerProps {
  onSelectBlock: (type: BlockType) => void;
  onClose: () => void;
}

const BLOCK_TYPES: { value: BlockType; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { value: "text",      label: "Text",      description: "Teks, paragraf, atau heading dengan Markdown", icon: Type,               color: "text-sky-400 border-sky-800 group-hover:bg-sky-950/50" },
  { value: "container", label: "Container", description: "Wadah kolom atau layout dengan background",    icon: Box,                color: "text-violet-400 border-violet-800 group-hover:bg-violet-950/50" },
  { value: "buttons",   label: "Buttons",   description: "Deretan tombol dengan warna & URL kustom",     icon: MousePointerClick,  color: "text-teal-400 border-teal-800 group-hover:bg-teal-950/50" },
  { value: "image",     label: "Image",     description: "Foto / gambar dengan judul & tautan",          icon: ImageIcon,          color: "text-amber-400 border-amber-800 group-hover:bg-amber-950/50" },
  { value: "divider",   label: "Divider",   description: "Garis pembatas dengan gaya kustom",            icon: Minus,              color: "text-zinc-400 border-zinc-700 group-hover:bg-zinc-800/50" },
];

export default function BlockPicker({ onSelectBlock, onClose }: BlockPickerProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[280px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-teal-500 rounded-full" />
            <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">Tambah Blok</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-all"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
        </div>

        {/* Block List */}
        <div className="p-2 flex flex-col gap-1">
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
                className="group w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 text-left transition-all cursor-pointer border border-transparent hover:border-zinc-800"
              >
                <div className={`p-2 bg-zinc-900 border rounded-xl transition-all shrink-0 ${block.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{block.label}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{block.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-3 pt-1 text-center border-t border-zinc-800/50 mt-1">
          <p className="text-[9px] text-zinc-600">Klik blok untuk menambahkan ke canvas</p>
        </div>
      </div>
    </div>
  );
}


