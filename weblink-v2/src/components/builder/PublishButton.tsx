"use client";

import { useState } from "react";
import { Loader2, Globe } from "lucide-react";

interface PublishButtonProps {
  projectId: string;
  isPublished: boolean;
  hasChanges: boolean;
  onPublishSuccess: (updatedProject: any) => void;
}

export default function PublishButton({
  projectId,
  isPublished,
  hasChanges,
  onPublishSuccess,
}: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePublish = async () => {
    setIsPublishing(true);
    setMessage("");
    try {
      const res = await fetch(`/api/project/${projectId}/publish`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to publish");
      }

      const data = await res.json();
      if (data.success) {
        setMessage("Success!");
        onPublishSuccess(data.project);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
      setMessage("Error!");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  const showActive = !isPublished || hasChanges;

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span
          className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
            message === "Success!"
              ? "bg-green-950/60 text-green-400 border-green-800"
              : "bg-red-950/60 text-red-400 border-red-800"
          }`}
        >
          {message === "Success!" ? "Halaman berhasil dipublikasikan!" : "Gagal mempublikasikan"}
        </span>
      )}
      <button
        onClick={handlePublish}
        disabled={isPublishing || !showActive}
        className={`relative h-[26px] px-2.5 rounded-md text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          isPublishing
            ? "bg-[#008080]/60 text-white cursor-not-allowed"
            : showActive
            ? "bg-[#008080] hover:bg-[#006666] text-white active:scale-95"
            : "bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed"
        }`}
      >
        {isPublishing ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Globe size={13} />
        )}
        {isPublishing ? "Publishing..." : showActive ? "Publish" : "Published"}
        
        {/* Glowing Indicator Dot for Changes */}
        {showActive && !isPublishing && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
