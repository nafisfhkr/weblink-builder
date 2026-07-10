"use client";

import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateProjectSlug } from "src/app/actions/project";

interface EditSlugFormProps {
  projectId: string;
  initialSlug: string;
  host: string;
}

export default function EditSlugForm({ projectId, initialSlug, host }: EditSlugFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [slug, setSlug] = useState(initialSlug);
  const [inputVal, setInputVal] = useState(initialSlug);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInputVal(slug);
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inputVal.trim() === slug) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await updateProjectSlug(projectId, inputVal);

    if (res.error) {
      setError(res.error);
    } else {
      setSlug(inputVal.trim().toLowerCase());
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-0 w-full text-zinc-500 font-mono text-[11px] group/slug">
        <span className="truncate flex-1">{host}/{slug}</span>
        <button
          type="button"
          onClick={startEdit}
          title="Kustomisasi Slug"
          className="text-zinc-500 hover:text-teal-600 transition-colors shrink-0 p-1 cursor-pointer opacity-70 group-hover/slug:opacity-100"
        >
          <Pencil size={11} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Normal display slot to preserve local layout flow underneath */}
      <div className="flex items-center gap-1 min-w-0 w-full text-zinc-500 font-mono text-[11px]">
        <span className="truncate flex-1">{host}/{slug}</span>
        <button type="button" disabled className="text-zinc-600 opacity-50 shrink-0 p-1">
          <Pencil size={11} />
        </button>
      </div>

      {/* Modal / Popup Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
        onClick={cancelEdit}
      >
        {/* Modal Content Card */}
        <div
          className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-bold text-zinc-900">Kustomisasi Slug URL</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Tentukan alamat unik untuk mempublikasikan halaman biolink Anda agar mudah diakses publik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center bg-white border border-zinc-200 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 rounded-xl px-3.5 py-2.5 text-xs text-zinc-700 w-full min-w-0 transition-all shadow-sm">
              <span className="text-zinc-400 select-none shrink-0 font-mono font-medium">{host}/</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
                className="bg-transparent border-none outline-none text-zinc-900 w-full ml-0.5 focus:ring-0 p-0 font-mono font-semibold"
                autoFocus
              />
            </div>

            {error && (
              <span className="text-[10px] text-red-400 font-semibold leading-tight px-1">
                {error}
              </span>
            )}

            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer border border-zinc-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
