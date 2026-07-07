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
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={createProject}
      disabled={loading}
      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-xl hover:border-gray-500 hover:bg-gray-900 transition-colors group cursor-pointer disabled:opacity-50"
    >
      <div className="p-4 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors mb-4">
        <Plus size={32} className="text-gray-300" />
      </div>
      <span className="text-gray-300 font-medium">
        {loading ? "Creating..." : "Start from scratch"}
      </span>
    </button>
  );
}
