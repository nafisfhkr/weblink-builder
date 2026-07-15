"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlankPageCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createProject = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/project", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        // Redirect to project editor page
        router.push(`/editor/${data.id}`);
      } else {
        console.error("Failed to create project: server error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={createProject}
      disabled={loading}
      style={{ backgroundColor: "#ffffff", borderColor: "#a1a1aa", borderWidth: "3px" }}
      className="flex flex-col items-center justify-center w-full h-[175px] border-dashed rounded-xl hover:border-zinc-400 hover:bg-zinc-50/50 transition-all group cursor-pointer disabled:opacity-50 shrink-0"
    >
      <div 
        className="w-[40px] h-[40px] flex items-center justify-center rounded-full border-dashed mb-3 transition-colors bg-transparent"
        style={{ borderColor: "#a1a1aa", borderWidth: "2px" }}
      >
        <Plus size={18} className="text-zinc-500 group-hover:text-zinc-700 transition-colors" />
      </div>
      <span className="text-zinc-700 font-semibold text-[15px] tracking-wide group-hover:text-zinc-900 transition-colors">
        {loading ? "Membuat..." : "Buat Halaman Baru"}
      </span>
    </button>
  );
}
