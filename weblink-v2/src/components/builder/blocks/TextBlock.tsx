"use client";

interface TextBlockDisplayProps {
  content: {
    text?: string;
    align?: string;
    as?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: number;
  };
  textColor?: string;
  textSize?: string;
}

export default function TextBlock({ content, textColor, textSize }: TextBlockDisplayProps) {
  const asType = content?.as || "paragraph";
  const fontFamily = content?.fontFamily && content.fontFamily !== "inherit" ? content.fontFamily : undefined;
  const isHeading = asType === "heading";

  const customStyle: React.CSSProperties = {
    color: content?.color || textColor,
    fontSize: textSize ? `${textSize}px` : (isHeading ? "32px" : "16px"),
    fontFamily: fontFamily,
    lineHeight: content?.lineHeight !== undefined ? content.lineHeight : (isHeading ? 1.2 : 1.5),
    textAlign: (content?.align as any) || "center",
    textAlignLast: content?.align === "justify" ? "center" : undefined,
    fontWeight: isHeading ? "bold" : "normal",
  };
  
  const Element = isHeading ? "h2" : "p";

  return (
    <div className="w-full py-2 flex flex-col justify-center">
      {content?.text ? (
        <Element 
          style={customStyle}
          className="max-w-full mx-auto leading-relaxed whitespace-pre-wrap break-words"
        >
          {content.text}
        </Element>
      ) : (
        <p className="text-zinc-700 text-sm italic text-center">Teks atau paragraf...</p>
      )}
    </div>
  );
}
