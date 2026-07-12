"use client";

import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";

interface TextBlockDisplayProps {
  content: {
    text?: string;
    align?: string;
    as?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: number;
    textSize?: number;
    useCard?: boolean;
    cardBgColor?: string;
    cardBgOpacity?: number;
    cardBorderColor?: string;
    cardBorderOpacity?: number;
    cardBlur?: number;
  };
}

export default function TextBlock({ content }: TextBlockDisplayProps) {
  const asType = content?.as || "paragraph";
  const fontFamily = content?.fontFamily && content.fontFamily !== "inherit" ? content.fontFamily : undefined;
  const isHeading = asType === "heading";
  const useCard = content?.useCard ?? false;

  const textStyle: React.CSSProperties = {
    color: content?.color,
    fontSize: content?.textSize ? `${content.textSize}px` : (isHeading ? "32px" : "16px"),
    fontFamily: fontFamily,
    lineHeight: content?.lineHeight !== undefined ? content.lineHeight : (isHeading ? 1.2 : 1.5),
    textAlign: (content?.align as any) || "center",
    textAlignLast: content?.align === "justify" ? "center" : undefined,
    fontWeight: isHeading ? "bold" : "normal",
  };

  const cardStyle = buildCardStyle(content);
  const Element = isHeading ? "h2" : "p";

  const inner = (
    <div className={`w-full ${useCard ? "px-5 py-4" : "py-2"} flex flex-col justify-center`}>
      {content?.text ? (
        <Element
          style={textStyle}
          className="max-w-full mx-auto leading-relaxed whitespace-pre-wrap break-words"
        >
          {content.text}
        </Element>
      ) : (
        <p className="text-zinc-600 text-sm italic text-center">Teks atau paragraf...</p>
      )}
    </div>
  );

  if (!useCard) return inner;

  return (
    <div
      className={cardWrapperClass(true)}
      style={cardStyle}
    >
      {inner}
    </div>
  );
}
