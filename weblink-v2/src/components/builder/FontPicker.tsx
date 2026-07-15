"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Search } from "lucide-react";

export const GOOGLE_FONTS = [
  { value: "inherit", label: "Default (DM Sans)" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Oswald", label: "Oswald" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Nunito", label: "Nunito" },
  { value: "Raleway", label: "Raleway" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "PT Sans", label: "PT Sans" },
  { value: "Lora", label: "Lora" },
  { value: "Roboto Mono", label: "Roboto Mono" },
  { value: "Kanit", label: "Kanit" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "Josefin Sans", label: "Josefin Sans" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Caveat", label: "Caveat" },
  { value: "Lobster", label: "Lobster" },
  { value: "Pacifico", label: "Pacifico" },
  { value: "Cinzel", label: "Cinzel" },
  { value: "Crimson Text", label: "Crimson Text" },
  { value: "Arvo", label: "Arvo" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Comfortaa", label: "Comfortaa" },
  { value: "Inconsolata", label: "Inconsolata" },
  { value: "Abril Fatface", label: "Abril Fatface" },
  { value: "Great Vibes", label: "Great Vibes" },
  { value: "Satisfy", label: "Satisfy" },
  { value: "Permanent Marker", label: "Permanent Marker" },
  { value: "Shadows Into Light", label: "Shadows Into Light" },
  { value: "Sacramento", label: "Sacramento" },
];

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedFont = GOOGLE_FONTS.find((f) => f.value === value) || { value: "inherit", label: "Default (DM Sans)" };

  const filteredFonts = GOOGLE_FONTS.filter((font) =>
    font.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Toggle */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery("");
        }}
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-700 transition-colors cursor-pointer text-left font-medium"
        style={{
          fontFamily: selectedFont.value !== "inherit" ? `'${selectedFont.value}', sans-serif` : undefined,
        }}
      >
        <span>{selectedFont.label}</span>
        <span className="text-zinc-500 text-xs shrink-0 select-none ml-2">▼</span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-[999] w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl overflow-hidden max-h-60 flex flex-col">
          {/* Search Input */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-zinc-800">
            <Search size={14} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari font..."
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
              autoFocus
            />
          </div>

          {/* List options */}
          <div className="overflow-y-auto flex-1 py-1 max-h-48">
            {filteredFonts.length > 0 ? (
              filteredFonts.map((font) => {
                const isSelected = value === font.value;
                return (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => {
                      onChange(font.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer hover:bg-zinc-800 text-white flex items-center justify-between transition-colors ${
                      isSelected ? "bg-teal-950/40 text-teal-400 font-semibold" : ""
                    }`}
                    style={{
                      fontFamily: font.value !== "inherit" ? `'${font.value}', sans-serif` : undefined,
                    }}
                  >
                    <span>{font.label}</span>
                    {isSelected && <Check size={12} className="text-teal-400 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-xs text-zinc-500 text-center italic">
                Font tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
