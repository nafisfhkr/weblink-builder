"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "src/components/ui/Toast";

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

      if (!res.ok) {
        throw new Error("Gagal menghapus proyek");
      }

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
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
      title="Hapus Proyek"
      aria-label={`Hapus Proyek ${projectTitle}`}
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin text-red-500" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
