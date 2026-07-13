/**
 * buildCardStyle — convert per-block card settings from content into CSS style object.
 * Used by both editor blocks and the published page renderer.
 */
export function buildCardStyle(content: any): React.CSSProperties | undefined {
  if (!content?.useCard) return undefined;

  const hexToRgba = (hex: string = "#ffffff", opacity: number = 10) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.charAt(0)+c.charAt(0)+c.charAt(1)+c.charAt(1)+c.charAt(2)+c.charAt(2);
    const r = parseInt(c.substring(0, 2), 16) || 255;
    const g = parseInt(c.substring(2, 4), 16) || 255;
    const b = parseInt(c.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const bgColor = hexToRgba(content.cardBgColor || "#ffffff", content.cardBgOpacity ?? 100);
  const borderColor = hexToRgba(content.cardBorderColor || "#ffffff", content.cardBorderOpacity ?? 20);
  const blur = content.cardBlur ?? 0;

  return {
    backgroundColor: bgColor,
    borderColor: borderColor,
    backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
    WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
  };
}

/**
 * cardWrapperClass — Tailwind class string for card wrapper div.
 */
export function cardWrapperClass(useCard: boolean): string {
  return useCard
    ? "border border-white/10 rounded-2xl overflow-hidden"
    : "";
}
