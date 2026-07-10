export default function ContainerBlock({ content }: { content: any }) {
  const layout = content?.layout || "default";
  const columns = content?.columns || 2;
  const mobileStack = content?.mobileStack ?? true;
  
  const bgType = content?.bgType || "none";
  const backgroundStyle: React.CSSProperties = {};
  if (bgType === "color") {
    backgroundStyle.backgroundColor = content?.bgColor || "#000000";
  } else if (bgType === "gradient") {
    backgroundStyle.background = content?.gradient || "linear-gradient(45deg, #000, #333)";
  } else if (bgType === "image" && content?.bgImage) {
    backgroundStyle.backgroundImage = `url(${content.bgImage})`;
    backgroundStyle.backgroundSize = "cover";
  }

  const borderStyle: React.CSSProperties = {
    borderStyle: content?.borderStyle !== "none" ? content?.borderStyle : "none",
    borderWidth: content?.borderStyle !== "none" ? `${content?.borderWidth || 1}px` : 0,
    borderColor: content?.borderColor || "#ffffff",
    borderRadius: "16px",
  };

  const containerStyle = {
    ...backgroundStyle,
    ...borderStyle,
  };

  if (layout === "columns") {
    return (
      <div style={containerStyle} className="w-full overflow-hidden">
        <div className={`flex ${mobileStack ? "flex-col sm:flex-row" : "flex-row"} gap-4 p-4 min-h-[100px]`}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-500/50 rounded-lg p-4 text-zinc-500 text-xs text-center min-h-[80px]">
              Kolom {i + 1}
              <br/>
              <span className="text-[10px] opacity-70">Area Konten (Segera Hadir)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="w-full min-h-[100px] p-4 flex flex-col items-center justify-center text-zinc-500 text-xs text-center border border-dashed border-zinc-500/50">
      Default Container
      <br/>
      <span className="text-[10px] opacity-70">Area Konten (Segera Hadir)</span>
    </div>
  );
}
