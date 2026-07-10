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

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      <div className="flex items-center gap-1.5 min-w-0 max-w-full">
        <p className="text-xs text-gray-500 truncate min-w-0 flex-1">
          {host}/{slug}
        </p>
        <button
          onClick={startEdit}
          title="Ubah Slug URL"
          className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
        >
          <Pencil size={12} />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={handleContainerClick}
      className="flex flex-col gap-1 w-full relative z-20"
    >
      <div className="flex items-center gap-1 w-full">
        <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300 w-full min-w-0">
          <span className="text-zinc-500 select-none shrink-0 font-medium">/</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            className="bg-transparent border-none outline-none text-zinc-100 w-full ml-0.5 focus:ring-0 p-0 font-medium"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="submit"
            disabled={loading}
            title="Simpan"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-900 hover:bg-emerald-800 text-emerald-400 hover:text-emerald-200 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            title="Batal"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors border border-zinc-800"
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
