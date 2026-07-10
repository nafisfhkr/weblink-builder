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

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Link Weblink</span>
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800/80 rounded-lg p-2.5 gap-2 hover:border-zinc-700 transition-colors">
          <span className="text-xs text-zinc-300 truncate flex-1 font-mono font-medium">
            {host}/{slug}
          </span>
          <button
            type="button"
            onClick={startEdit}
            title="Kustomisasi Slug"
            className="flex items-center justify-center w-7 h-7 rounded bg-zinc-800 hover:bg-teal-600 text-zinc-400 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            <Pencil size={11} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-1.5 w-full"
    >
      <span className="text-[10px] text-teal-400 uppercase tracking-wider font-bold">Kustomisasi Slug</span>
      <div className="flex items-center gap-1.5 w-full">
        <div className="flex items-center bg-zinc-950 border border-teal-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 w-full min-w-0 shadow-[0_0_10px_rgba(20,184,166,0.05)]">
          <span className="text-zinc-500 select-none shrink-0 font-mono font-medium">{host}/</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            className="bg-transparent border-none outline-none text-zinc-100 w-full ml-0.5 focus:ring-0 p-0 font-mono font-semibold"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="submit"
            disabled={loading}
            title="Simpan"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            title="Batal"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors border border-zinc-700 cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {error && (
        <span className="text-[10px] text-red-400 font-medium mt-0.5 px-1 leading-tight">
          {error}
        </span>
      )}
    </form>
  );
}
