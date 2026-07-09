"use client";

import { Type, Link, Image, Minus, Share2 } from "lucide-react";

interface BlockPickerProps {
  onSelectBlock: (type: "heading" | "text" | "link" | "image" | "divider" | "social") => void;
  onClose: () => void;
}

const BLOCK_TYPES = [
  { value: "heading", label: "Judul (Heading)", description: "Judul besar halaman", icon: Type },
  { value: "text", label: "Teks Paragraf", description: "Teks panjang / deskripsi", icon: Type },
  { value: "link", label: "Tautan Link", description: "Tombol navigasi ke URL lain", icon: Link },
  { value: "image", label: "Foto / Gambar", description: "Unggah foto dari komputer", icon: Image },
  { value: "divider", label: "Garis Pembatas", description: "Pemisah visual tipis", icon: Minus },
  { value: "social", label: "Ikon Sosial Media", description: "Deretan tautan akun sosial", icon: Share2 },
] as const;

export default function BlockPicker({ onSelectBlock, onClose }: BlockPickerProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 bg-teal-500 rounded-full" />
          <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase">
            TAMBAH BLOK
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-all"
          aria-label="Tutup panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {BLOCK_TYPES.map((block) => {
          const Icon = block.icon;
          return (
            <button
              key={block.value}
              id={`block-picker-${block.value}`}
              onClick={() => {
                onSelectBlock(block.value);
              }}
              className="w-full flex items-center gap-3.5 p-3 rounded-lg hover:bg-zinc-900 text-left transition-colors cursor-pointer group"
            >
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 group-hover:text-teal-400 group-hover:border-teal-800 transition-colors shrink-0">
                <Icon size={17} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                  {block.label}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">{block.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
