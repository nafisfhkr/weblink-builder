export default function ButtonsBlock({ content }: { content: any }) {
  const items = content?.items || [];

  if (items.length === 0) {
    return (
      <div className="w-full py-3 text-center text-zinc-500 text-xs italic">
        Belum ada tombol
      </div>
    );
  }

  const useGlassContainer = content?.useGlassContainer;

  return (
    <div className={`w-full max-w-md mx-auto flex flex-col gap-3 items-center ${useGlassContainer ? 'bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl' : ''}`}>
      {items.map((item: any, i: number) => {
        const onClickAttr = item.onClick ? { onClick: new Function(item.onClick) } : {};
        
        // Handle opacity (0-100)
        let bgHex = item.bgColor || "#000000";
        const opacity = item.bgOpacity !== undefined ? item.bgOpacity : 100;
        let alphaHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
        const finalBg = opacity === 100 ? bgHex : `${bgHex}${alphaHex}`;

        return (
          <a
            key={item.id || i}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm block"
            {...onClickAttr as any}
          >
            <div
              className="w-full px-6 py-3.5 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2.5"
              style={{
                backgroundColor: finalBg,
                color: item.textColor || "#ffffff",
                border: `${item.borderWidth || 0}px solid ${item.borderColor || "#ffffff"}`,
                boxShadow: opacity >= 90 ? `0 4px 14px 0 ${bgHex}40` : 'none',
                backdropFilter: opacity < 100 ? "blur(12px)" : undefined,
                WebkitBackdropFilter: opacity < 100 ? "blur(12px)" : undefined,
              }}
            >
              <span>{item.label || "Tombol"}</span>
              {item.icon === "whatsapp" && (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
              )}
              {item.icon === "website" && (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
