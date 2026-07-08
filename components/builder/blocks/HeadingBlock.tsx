"use client";

interface HeadingBlockDisplayProps {
  content: {
    title?: string;
    bio?: string;
  };
  textColor?: string;
}

export default function HeadingBlock({ content, textColor }: HeadingBlockDisplayProps) {
  const customColorStyle = textColor ? { color: textColor } : undefined;
  
  return (
    <div className="w-full text-center py-4">
      <h1 
        style={customColorStyle}
        className="text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight"
      >
        {content?.title || <span className="text-zinc-600 italic font-normal text-lg">Ketuk untuk mengisi judul...</span>}
      </h1>
      {content?.bio ? (
        <p 
          style={textColor ? { color: textColor, opacity: 0.8 } : undefined}
          className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed whitespace-pre-wrap"
        >
          {content.bio}
        </p>
      ) : (
        <p className="text-zinc-700 text-sm italic">Bio / deskripsi singkat...</p>
      )}
    </div>
  );
}
