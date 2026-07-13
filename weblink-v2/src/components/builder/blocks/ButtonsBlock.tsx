import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";

export default function ButtonsBlock({ content }: { content: any }) {
  const items = content?.items || [];
  const useCard = content?.useCard ?? false;
  const cardStyle = buildCardStyle(content);

  const isHorizontal = content?.orientation === "horizontal";
  const isToolbar = content?.orientation === "toolbar";
  const isGhost = content?.buttonStyle === "transparent";
  const isOutline = content?.buttonStyle === "outline";
  const isTransparentBg = isGhost || isOutline || isToolbar;

  let groupedWrapperStyle = {};
  if (isToolbar && items.length > 0) {
    const first = items[0];
    let bgHex = first.bgColor || "#000000";
    const opacity = first.bgOpacity !== undefined ? first.bgOpacity : 100;
    const alphaHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
    const finalBg = opacity === 100 ? bgHex : (opacity === 0 ? "transparent" : `${bgHex}${alphaHex}`);
    
    groupedWrapperStyle = {
      backgroundColor: finalBg,
      boxShadow: opacity >= 90 ? `0 4px 14px 0 ${bgHex}40` : "none",
      backdropFilter: (opacity > 0 && opacity < 100) ? "blur(12px)" : undefined,
      WebkitBackdropFilter: (opacity > 0 && opacity < 100) ? "blur(12px)" : undefined,
      borderRadius: "9999px",
      overflow: "visible",
      border: isOutline ? `1px solid ${first.textColor || "#ffffff"}` : "none",
      padding: "3px",
    };
  }

  const buttons = items.length === 0 ? (
    <div className="w-full py-3 text-center text-zinc-500 text-xs italic">
      Belum ada tombol
    </div>
  ) : (
    <div 
      className={`w-full max-w-md mx-auto flex ${isHorizontal ? "flex-row flex-wrap justify-center gap-2" : isToolbar ? "flex-row flex-wrap justify-center gap-0.5" : `flex-col gap-3 items-center`}`}
      style={isToolbar ? groupedWrapperStyle : undefined}
    >
      {items.map((item: any, i: number) => {
        let bgHex = item.bgColor || "#000000";
        const opacity = isTransparentBg ? 0 : (item.bgOpacity !== undefined ? item.bgOpacity : 100);
        const alphaHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
        const finalBg = opacity === 100 ? bgHex : (opacity === 0 ? "transparent" : `${bgHex}${alphaHex}`);
        
        let borderStyle = isGhost ? "none" : `${item.borderWidth || 0}px solid ${item.borderColor || "transparent"}`;
        if (isOutline && !isToolbar) {
          borderStyle = `1px solid ${item.textColor || "#ffffff"}`;
        } else if (isToolbar) {
          borderStyle = "none";
        }

        const hasBorderRight = isToolbar && i < items.length - 1;
        const innerBorderRight = hasBorderRight ? `1px solid ${item.textColor || "#ffffff"}20` : "none";

        const hasIcon = item.icon === "whatsapp" || item.icon === "website";
        const showText = !isToolbar || !hasIcon; // Hide text in toolbar if there's an icon

        return (
          <a
            key={item.id || i}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`${isHorizontal || isToolbar ? "" : "w-full max-w-sm block"}`}
            style={{ 
              borderBottom: "none",
              borderRight: innerBorderRight
            }}
          >
            <div
              className={`font-semibold transition-all duration-300 flex items-center justify-center gap-1.5
              ${isToolbar ? (showText ? "px-2.5 py-1 text-[10px]" : "w-[26px] h-[26px]") + " rounded-full hover:bg-white/10 active:bg-white/20" : 
                `px-3 py-2 text-sm gap-2 ${isHorizontal ? "w-auto rounded-xl" : "w-full gap-3"} rounded-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:opacity-90 active:scale-[0.98]`
              }`}
              style={{
                backgroundColor: finalBg,
                color: item.textColor || "#ffffff",
                border: borderStyle,
                boxShadow: (opacity >= 90 && !isTransparentBg && !isToolbar) ? `0 4px 14px 0 ${bgHex}40` : "none",
                backdropFilter: (opacity > 0 && opacity < 100 && !isTransparentBg && !isToolbar) ? "blur(12px)" : undefined,
                WebkitBackdropFilter: (opacity > 0 && opacity < 100 && !isTransparentBg && !isToolbar) ? "blur(12px)" : undefined,
              }}
            >
              {showText && <span className={`truncate flex-1 ${isHorizontal ? "text-center" : "text-left"}`}>{item.label || "Tombol"}</span>}
              
              {item.icon === "whatsapp" ? (
                <svg className="shrink-0" viewBox="0 0 24 24" width={isToolbar ? 14 : 20} height={isToolbar ? 14 : 20} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
              ) : item.icon === "website" ? (
                <svg className="shrink-0" viewBox="0 0 24 24" width={isToolbar ? 14 : 20} height={isToolbar ? 14 : 20} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              ) : (
                !(isHorizontal || isToolbar) && <div className="w-5 h-5 shrink-0" />
              )}
            </div>
          </a>
        );
      })}
    </div>
  );

  const buttonsContent = (
    <>
      {content?.heading && (
        <h3 className="text-center font-bold text-lg mb-4 text-white px-2">
          {content.heading}
        </h3>
      )}
      {buttons}
    </>
  );

  if (!useCard) return <div className="w-full py-2">{buttonsContent}</div>;

  return (
    <div
      className={`w-full max-w-[416px] mx-auto ${cardWrapperClass(true)} p-4`}
      style={cardStyle}
    >
      {buttonsContent}
    </div>
  );
}
