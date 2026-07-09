"use client";

interface TextBlockDisplayProps {
  content: {
    text?: string;
  };
  textColor?: string;
  textSize?: string;
}

export default function TextBlock({ content, textColor, textSize }: TextBlockDisplayProps) {
  const customStyle: React.CSSProperties = {
    color: textColor,
    fontSize: textSize ? `${textSize}px` : undefined,
  };
  
  return (
    <div className="w-full text-center py-2">
      {content?.text ? (
        <p 
          style={customStyle}
          className="text-zinc-400 max-w-md mx-auto leading-relaxed whitespace-pre-wrap"
        >
          {content.text}
        </p>
      ) : (
        <p className="text-zinc-700 text-sm italic">Teks atau paragraf...</p>
      )}
    </div>
  );
}
