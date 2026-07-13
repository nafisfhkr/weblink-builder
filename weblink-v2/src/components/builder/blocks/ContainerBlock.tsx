import { buildCardStyle, cardWrapperClass } from "src/lib/cardStyle";
import TextBlock from "./TextBlock";
import ButtonsBlock from "./ButtonsBlock";
import ImageBlock from "./ImageBlock";
import DividerBlock from "./DividerBlock";

interface ContainerBlockProps {
  content: any;
  isEditor?: boolean;
}

export default function ContainerBlock({ content, isEditor = false }: ContainerBlockProps) {
  const layout = content?.layout || "default";
  const columns = content?.columns || 2;
  const mobileStack = content?.mobileStack ?? true;
  const useCard = content?.useCard ?? false;
  const cardStyle = buildCardStyle(content);
  
  const bgType = content?.bgType || "none";
  const backgroundStyle: React.CSSProperties = {};
  if (bgType === "color") {
    backgroundStyle.backgroundColor = content?.bgColor || "#000000";
  } else if (bgType === "gradient") {
    const gradAngle = content?.gradAngle ?? 90;
    const gradColor1 = content?.gradColor1 || "#000000";
    const gradColor2 = content?.gradColor2 || "#333333";
    backgroundStyle.background = `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`;
  } else if (bgType === "image" && content?.bgImage) {
    backgroundStyle.backgroundImage = `url(${content.bgImage})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  }

  const paddingV = content?.paddingV ?? 16;
  const paddingH = content?.paddingH ?? 16;
  const radius = content?.radius ?? 16;
  const gutter = content?.gutter ?? 16;

  const borderStyle: React.CSSProperties = {
    borderStyle: content?.borderStyle !== "none" ? content?.borderStyle : "none",
    borderWidth: content?.borderStyle !== "none" ? `${content?.borderWidth || 1}px` : 0,
    borderColor: content?.borderColor || "#ffffff",
    borderRadius: `${radius}px`,
  };

  const containerStyle = {
    ...backgroundStyle,
    ...borderStyle,
  };

  const paddingStyle = {
    paddingTop: `${paddingV}px`,
    paddingBottom: `${paddingV}px`,
    paddingLeft: `${paddingH}px`,
    paddingRight: `${paddingH}px`,
  };

  const children = content?.children || [];

  const renderChildBlock = (child: any) => {
    switch (child.type) {
      case "text":
        return <TextBlock content={child.content || {}} />;
      case "buttons":
        return <ButtonsBlock content={child.content || {}} />;
      case "image":
        return <ImageBlock content={child.content || {}} />;
      case "divider":
        return <DividerBlock data={child.content || {}} />;
      default:
        return null;
    }
  };

  const getWrapperStyle = (child: any): React.CSSProperties => {
    if (child.type === "divider") {
      const margin = child.content?.margin ?? 24;
      return {
        marginTop: `${margin}px`,
        marginBottom: `${margin}px`,
      };
    }
    return {};
  };

  let inner = null;
  if (layout === "columns") {
    inner = (
      <div style={containerStyle} className="w-full overflow-hidden">
        <div 
          className={`flex ${mobileStack ? "flex-col sm:flex-row" : "flex-row"} w-full`}
          style={{ ...paddingStyle, gap: `${gutter}px` }}
        >
          {Array.from({ length: columns }).map((_, i) => {
            const colChildren = children.filter((c: any) => (c.column ?? 0) === i);
            return (
              <div key={i} className="flex-1 flex flex-col gap-3 w-full min-w-0">
                {colChildren.map((child: any) => (
                  <div key={child.id} className="w-full" style={getWrapperStyle(child)}>
                    {renderChildBlock(child)}
                  </div>
                ))}
                {isEditor && colChildren.length === 0 && (
                  <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-700/50 rounded-xl p-4 text-zinc-500 text-[10px] text-center min-h-[60px]">
                    Kolom {i + 1} Kosong
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    inner = (
      <div style={{ ...containerStyle, ...paddingStyle }} className="w-full">
        <div className="flex flex-col gap-3 w-full">
          {children.map((child: any) => (
            <div key={child.id} className="w-full" style={getWrapperStyle(child)}>
              {renderChildBlock(child)}
            </div>
          ))}
          {isEditor && children.length === 0 && (
            <div className="w-full flex items-center justify-center border border-dashed border-zinc-700/50 rounded-xl p-6 text-zinc-500 text-xs text-center min-h-[80px]">
              Wadah Kosong (Klik untuk isi)
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!useCard) return inner;

  return (
    <div
      className={`w-full ${cardWrapperClass(true)} p-2`}
      style={cardStyle}
    >
      {inner}
    </div>
  );
}
