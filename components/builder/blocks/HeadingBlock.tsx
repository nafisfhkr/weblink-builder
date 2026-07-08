"use client";

interface HeadingBlockDisplayProps {
  content: {
    title?: string;
    bio?: string;
  };
}

export default function HeadingBlock({ content }: HeadingBlockDisplayProps) {
  return (
    <div className="w-full text-center py-4">
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight">
        {content?.title || <span className="text-zinc-600 italic font-normal text-lg">Ketuk untuk mengisi judul...</span>}
      </h1>
      {content?.bio ? (
        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed whitespace-pre-wrap">
          {content.bio}
        </p>
      ) : (
        <p className="text-zinc-700 text-sm italic">Bio / deskripsi singkat...</p>
      )}
    </div>
  );
}
