"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Type, Link, Image, Minus, Share2 } from "lucide-react";

interface BlockPickerProps {
  onSelectBlock: (type: "heading" | "link" | "image" | "divider" | "social") => void;
}

const BLOCK_TYPES = [
  { value: "heading", label: "Heading & Bio", description: "Nama profil, gelar, dan bio singkat", icon: Type },
  { value: "link", label: "Tautan Link", description: "Tombol navigasi ke url lain", icon: Link },
  { value: "image", label: "Foto / Gambar", description: "Unggah gambar atau foto Anda", icon: Image },
  { value: "divider", label: "Garis Pembatas", description: "Pemisah visual tipis", icon: Minus },
  { value: "social", label: "Ikon Sosial Media", description: "Deretan tautan akun sosial", icon: Share2 },
] as const;

export default function BlockPicker({ onSelectBlock }: BlockPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type: typeof BLOCK_TYPES[number]["value"]) => {
    onSelectBlock(type);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 bg-[#00e59b] hover:bg-[#00c785] text-black py-4 rounded-xl font-bold transition-all hover:shadow-lg active:scale-99 cursor-pointer"
      >
        <Plus size={18} /> Tambah Blok Baru
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-20 flex flex-col gap-1 backdrop-blur-xl bg-opacity-95">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon;
            return (
              <button
                key={block.value}
                onClick={() => handleSelect(block.value)}
                className="w-full flex items-center gap-3.5 p-3 rounded-lg hover:bg-zinc-900 text-left transition-colors cursor-pointer group"
              >
                <div className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-400 group-hover:text-[#00e59b] group-hover:border-[#00e59b]/40 transition-colors">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#00e59b] transition-colors">
                    {block.label}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {block.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
