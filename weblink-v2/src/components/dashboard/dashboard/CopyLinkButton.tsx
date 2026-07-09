"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop click from propagating to Link parent
    e.stopPropagation();
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Salin Tautan Publik"
      className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
    </button>
  );
}
