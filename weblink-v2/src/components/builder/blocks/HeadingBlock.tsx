"use client";

interface HeadingBlockDisplayProps {
  content: {
    title?: string;
    bio?: string;
    align?: string;
  };
  textColor?: string;
  textSize?: string;
}

export default function HeadingBlock({ content, textColor, textSize }: HeadingBlockDisplayProps) {
  const customColorStyle: React.CSSProperties = {
    color: textColor,
    fontSize: textSize ? `${textSize}px` : undefined,
    textAlign: (content?.align as any) || "center",
    textAlignLast: content?.align === "justify" ? "center" : undefined,
  };
  
  return (
    <div className="w-full text-center">
      <h1 
        style={customColorStyle}
        className="text-3xl font-extrabold text-white tracking-tight leading-tight whitespace-pre-wrap"
      >
        {content?.title || <span className="text-zinc-600 italic font-normal text-lg">Ketuk untuk mengisi judul...</span>}
      </h1>
      {content?.bio ? (
        <p 
          style={{
            ...(textColor ? { color: textColor, opacity: 0.8 } : {}),
            textAlign: (content?.align as any) || "center",
            textAlignLast: content?.align === "justify" ? "center" : undefined,
          }}
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
