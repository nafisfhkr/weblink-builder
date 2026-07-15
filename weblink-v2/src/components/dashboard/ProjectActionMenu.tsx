"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Trash2, Loader2, MoreVertical } from "lucide-react";

import { useToast } from "src/components/ui/Toast";

interface ProjectActionMenuProps {
  projectId: string;
  projectTitle: string;
  fullUrl: string;
  triggerClassName?: string;
}

export default function ProjectActionMenu({ projectId, projectTitle, fullUrl, triggerClassName }: ProjectActionMenuProps) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
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

  const handleVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(fullUrl, "_blank");
    setIsOpen(false);
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
        className={triggerClassName || "p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center"}
        title="Menu Aksi"
        aria-expanded={isOpen}
      >
        <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white/70 border border-white/20 backdrop-blur-md shadow-xl rounded-lg py-0.5 z-50 min-w-[100px] flex flex-col animate-in fade-in slide-in-from-top-1 duration-100">
          <button
            onClick={handleVisit}
            className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-black/5 transition-colors text-left w-full cursor-pointer font-medium whitespace-nowrap"
          >
            <ExternalLink size={13} className="text-zinc-400 shrink-0" />
            <span>Kunjungi Situs</span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-500/10 disabled:opacity-50 transition-colors text-left w-full cursor-pointer font-medium border-t border-white/20 whitespace-nowrap"
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin text-red-500 shrink-0" />
            ) : (
              <Trash2 size={13} className="text-red-400 shrink-0" />
            )}
            <span>Hapus Proyek</span>
          </button>
        </div>
      )}
    </div>
  );
}
