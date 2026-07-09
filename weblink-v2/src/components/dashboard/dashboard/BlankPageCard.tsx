"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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
      className="flex flex-col items-center justify-center w-full min-h-[250px] sm:min-h-[350px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#4a4a4a] hover:bg-[#1f1f1f] transition-all group cursor-pointer disabled:opacity-50"
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full border-[1.5px] border-dashed border-gray-500 mb-5 group-hover:border-gray-300 transition-colors bg-transparent">
        <Plus size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </div>
      <span className="text-gray-300 font-semibold text-[17px] tracking-wide">
        {loading ? "Creating..." : "Blank Page"}
      </span>
    </button>
  );
}
