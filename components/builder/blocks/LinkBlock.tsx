"use client";

import { useEffect, useState } from "react";

interface LinkBlockProps {
  data: {
    title: string;
    url: string;
  };
  onChange: (newData: { title: string; url: string }) => void;
}

export default function LinkBlock({ data, onChange }: LinkBlockProps) {
  const [title, setTitle] = useState(data.title || "");
  const [url, setUrl] = useState(data.url || "");

  useEffect(() => {
    setTitle(data.title || "");
    setUrl(data.url || "");
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 40);
    setTitle(val);
    onChange({ title: val, url });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    onChange({ title, url: val });
  };

  // Helper to ensure URL protocol on blur
  const handleUrlBlur = () => {
    let finalUrl = url.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
      setUrl(finalUrl);
      onChange({ title, url: finalUrl });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
      <div>
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
          Link Button Text (Max 40)
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="My Portfolio Website"
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-white outline-none text-sm font-medium"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
          Destination URL
        </label>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          placeholder="https://example.com"
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-zinc-400 outline-none text-xs"
        />
      </div>
    </div>
  );
}
