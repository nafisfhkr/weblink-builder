"use client";

import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";

interface DividerBlockProps {
  data: any;
  onChange?: (newData: any) => void;
}

export default function DividerBlock({ data }: DividerBlockProps) {
  const style = data?.style || "single";
  const orientation = data?.orientation || "horizontal";
  const color = data?.color || "#52525b";
  const useGradient = data?.useGradient || false;
  const gradColor1 = data?.gradColor1 || "#52525b";
  const gradColor2 = data?.gradColor2 || "#27272a";
  const width = data?.width ?? 80;
  const thickness = data?.thickness ?? 1;
  const radius = data?.radius ?? 0;
  const margin = data?.margin ?? 24;
  const align = data?.align || "auto";

  const useCard = data?.useCard ?? false;
  const cardStyle = buildCardStyle(data);

  const cssStyle = style === "single" ? "solid" : style;

  const justifyMap: Record<string, string> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    auto: "center",
  };

  const borderColor = useGradient
    ? undefined
    : color;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: justifyMap[align] || "center",
    alignItems: "center",
    width: "100%",
  };

  let inner = null;
  if (orientation === "horizontal") {
    if (style === "spacer") {
      inner = (
        <div style={containerStyle}>
          <div style={{ width: `${width}%`, height: `${thickness}px` }} />
        </div>
      );
    } else if (data?.text) {
      const lineStyle: React.CSSProperties = {
        flexGrow: 1,
        height: 0,
        borderTopWidth: `${thickness}px`,
        borderTopStyle: cssStyle as any,
        borderTopColor: borderColor,
        borderRadius: `${radius}px`,
        ...(useGradient ? {
          borderImage: `linear-gradient(90deg, ${gradColor1}, ${gradColor2}) 1`,
        } : {}),
      };
      inner = (
        <div style={containerStyle}>
          <div className="flex items-center gap-3" style={{ width: `${width}%` }}>
            <div style={lineStyle} />
            <span 
              className="text-xs font-semibold px-1 select-none shrink-0" 
              style={{ color: color }}
            >
              {data.text}
            </span>
            <div style={lineStyle} />
          </div>
        </div>
      );
    } else {
      const lineStyle: React.CSSProperties = {
        width: `${width}%`,
        height: 0,
        borderTopWidth: `${thickness}px`,
        borderTopStyle: cssStyle as any,
        borderTopColor: borderColor,
        borderRadius: `${radius}px`,
        ...(useGradient ? {
          borderImage: `linear-gradient(90deg, ${gradColor1}, ${gradColor2}) 1`,
        } : {}),
      };
      inner = <div style={containerStyle}><div style={lineStyle} /></div>;
    }
  } else {
    // Vertical
    const lineStyle: React.CSSProperties = {
      height: "60px",
      width: 0,
      borderLeftWidth: `${thickness}px`,
      borderLeftStyle: style === "spacer" ? "none" : (cssStyle as any),
      borderLeftColor: borderColor,
      borderRadius: `${radius}px`,
    };
    inner = <div style={containerStyle}><div style={lineStyle} /></div>;
  }

  if (!useCard) return inner;

  return (
    <div
      className={`w-full ${cardWrapperClass(true)}`}
      style={cardStyle}
    >
      {inner}
    </div>
  );
}
