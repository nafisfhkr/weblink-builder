"use client";

import { useEffect, useState } from "react";

interface HeadingBlockProps {
  data: {
    title: string;
    bio?: string;
  };
  onChange: (newData: { title: string; bio?: string }) => void;
}

export default function HeadingBlock({ data, onChange }: HeadingBlockProps) {
  const [title, setTitle] = useState(data.title || "");
  const [bio, setBio] = useState(data.bio || "");

  useEffect(() => {
    setTitle(data.title || "");
    setBio(data.bio || "");
  }, [data]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 60);
    setTitle(val);
    onChange({ title: val, bio });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 120);
    setBio(val);
    onChange({ title, bio: val });
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
      <div className="w-full">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
          Heading Title (Max 60)
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Halo, Saya Rina"
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-white outline-none text-center font-bold text-lg"
        />
      </div>
      <div className="w-full">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
          Bio / Subtitle (Max 120)
        </label>
        <textarea
          value={bio}
          onChange={handleBioChange}
          placeholder="Desainer Grafis & Content Creator"
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 outline-none text-center text-sm resize-none"
        />
      </div>
    </div>
  );
}
