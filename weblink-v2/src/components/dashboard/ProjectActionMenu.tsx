"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Copy, Check, Trash2, Loader2, MoreVertical } from "lucide-react";

import { useToast } from "src/components/ui/Toast";

interface ProjectActionMenuProps {
  projectId: string;
  projectTitle: string;
  fullUrl: string;
}

export default function ProjectActionMenu({ projectId, projectTitle, fullUrl }: ProjectActionMenuProps) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    showToast("Tautan disalin!", "success");
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = confirm(`Apakah Anda yakin ingin menghapus proyek "${projectTitle}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      if (data.success) {
        showToast("Proyek berhasil dihapus", "success");
        router.refresh();
      } else {
        throw new Error();
      }
    } catch {
      showToast("Gagal menghapus proyek, silakan coba lagi", "error");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative shrink-0 pointer-events-auto" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center"
        title="Menu Aksi"
        aria-expanded={isOpen}
      >
        <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-zinc-200 shadow-xl rounded-xl py-1 z-50 min-w-[140px] flex flex-col animate-in fade-in slide-in-from-top-1 duration-100">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors text-left w-full cursor-pointer font-medium"
          >
            {copied ? (
              <Check size={14} className="text-teal-600 shrink-0" />
            ) : (
              <Copy size={14} className="text-zinc-400 shrink-0" />
            )}
            <span>Salin Tautan</span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors text-left w-full cursor-pointer font-medium border-t border-zinc-100"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin text-red-500 shrink-0" />
            ) : (
              <Trash2 size={14} className="text-red-400 shrink-0" />
            )}
            <span>Hapus Proyek</span>
          </button>
        </div>
      )}
    </div>
  );
}
