"use client";

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
    paddingTop: `${margin}px`,
    paddingBottom: `${margin}px`,
    display: "flex",
    justifyContent: justifyMap[align] || "center",
    alignItems: "center",
    width: "100%",
  };

  if (orientation === "horizontal") {
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
    return <div style={containerStyle}><div style={lineStyle} /></div>;
  }

  // Vertical
  const lineStyle: React.CSSProperties = {
    height: "60px",
    width: 0,
    borderLeftWidth: `${thickness}px`,
    borderLeftStyle: cssStyle as any,
    borderLeftColor: borderColor,
    borderRadius: `${radius}px`,
  };
  return <div style={containerStyle}><div style={lineStyle} /></div>;
}
