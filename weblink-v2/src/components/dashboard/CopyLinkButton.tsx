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
      className="p-1.5 text-zinc-500 hover:text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200 rounded-lg transition-all cursor-pointer shrink-0"
    >
      {copied ? <Check size={16} className="text-teal-600" /> : <Copy size={16} />}
    </button>
  );
}
