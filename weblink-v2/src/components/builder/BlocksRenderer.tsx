import React from "react";
import TextBlock from "src/components/builder/blocks/TextBlock";
import ContainerBlock from "src/components/builder/blocks/ContainerBlock";
import ButtonsBlock from "src/components/builder/blocks/ButtonsBlock";
import ImageBlock from "src/components/builder/blocks/ImageBlock";
import DividerBlock from "src/components/builder/blocks/DividerBlock";
import { InstagramIcon, YoutubeIcon, FacebookIcon, XIcon, TiktokIcon, WhatsappIcon } from "src/components/ui/SocialIcons";
import { Globe } from "lucide-react";

export const AVAILABLE_PLATFORMS = [
  { value: "instagram", icon: InstagramIcon },
  { value: "youtube", icon: YoutubeIcon },
  { value: "facebook", icon: FacebookIcon },
  { value: "x", icon: XIcon },
  { value: "tiktok", icon: TiktokIcon },
];

export function getPlatformUrl(platform: string, input: string) {
  if (!input) return "#";
  const trimmed = input.trim();
  
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  
  if (/^(www\.)?[a-z0-9\-]+\.[a-z]{2,}/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  
  const username = trimmed.replace(/^src/, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${username}`;
    case "tiktok":
      return `https://tiktok.com/@${username}`;
    case "x":
      return `https://x.com/${username}`;
    case "youtube":
      return `https://youtube.com/@${username}`;
    case "facebook":
      return `https://facebook.com/${username}`;
    default:
      return `https://${username}`;
  }
}

interface BlocksRendererProps {
  blocks: any[];
  isEditor?: boolean;
  pageSettings?: any;
  uploadingBlockIds?: Set<string>;
  renderBlockWrapper?: (block: any, children: React.ReactNode) => React.ReactNode;
}

export function SingleBlockRenderer({ block, isEditor, pageSettings, isUploading }: { block: any, isEditor: boolean, pageSettings: any, isUploading?: boolean }) {
  switch (block.type) {
    case "text":
      return <TextBlock content={block.content || {}} />;
    case "container":
      return <ContainerBlock content={block.content || {}} isEditor={isEditor} />;
    case "buttons":
      return <ButtonsBlock content={block.content || {}} />;
    case "image":
      return <ImageBlock content={block.content || {}} isUploading={isUploading} isEditor={isEditor} />;
    case "divider":
      return <DividerBlock data={block.content || {}} />;
    case "heading": {
      const customColorStyle: React.CSSProperties = {
        color: block.content?.textColor,
        fontSize: block.content?.textSize ? `${block.content.textSize}px` : undefined,
        textAlign: (block.content?.align as any) || "center",
        textAlignLast: block.content?.align === "justify" ? "center" : undefined,
      };
      
      const pStyle: React.CSSProperties = {
        color: block.content?.textColor,
        opacity: 0.8,
        textAlign: (block.content?.align as any) || "center",
        textAlignLast: block.content?.align === "justify" ? "center" : undefined,
      };
      
      if (block.content?.useCard === true || (block.content?.useCard !== false && pageSettings?.cardShowHeadingCard)) {
        return (
          <div className="w-full text-center border border-white/10 p-5 rounded-2xl transition-all shadow-md bg-white/5 backdrop-blur-md">
            <h1 style={customColorStyle} className="text-3xl font-extrabold tracking-tight mb-2 whitespace-pre-wrap">
              {block.content?.title || ""}
            </h1>
            {block.content?.bio && (
              <p style={pStyle} className="text-sm max-w-md mx-auto leading-relaxed whitespace-pre-wrap">
                {block.content.bio}
              </p>
            )}
          </div>
        );
      }
      return (
        <div className="w-full text-center">
          <h1 style={customColorStyle} className="text-3xl font-extrabold tracking-tight whitespace-pre-wrap">
            {block.content?.title || ""}
          </h1>
          {block.content?.bio && (
            <p style={pStyle} className="text-sm max-w-md mx-auto leading-relaxed whitespace-pre-wrap">
              {block.content.bio}
            </p>
          )}
        </div>
      );
    }
    case "social": {
      const items = block.content?.items || [];
      const useCardSocial = block.content?.useCard !== false;
      return (
        <div className="w-full flex justify-center gap-3.5 py-3">
          {items.map((item: any, i: number) => {
            const platformConfig = AVAILABLE_PLATFORMS.find((p) => p.value === item.platform);
            const Icon = platformConfig?.icon || Globe;
            return (
              <a
                key={i}
                href={getPlatformUrl(item.platform, item.url)}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full hover:scale-110 transition-all ${
                  useCardSocial ? "border shadow-md" : ""
                }`}
                title={item.platform}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      );
    }
    default:
      return null;
  }
}

export default function BlocksRenderer({ blocks, isEditor = false, pageSettings = {}, uploadingBlockIds, renderBlockWrapper }: BlocksRendererProps) {
  // Pastikan data block diurutkan berdasarkan field 'order'
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const groupedBlocks: any[] = [];
  let currentGroup: any[] = [];

  sortedBlocks.forEach((block, i) => {
    // Only group links if we are not in editor (to maintain legacy public behavior)
    // In editor, we need them flat for DnD
    if (!isEditor && block.type === "link") {
      currentGroup.push(block);
    } else {
      if (currentGroup.length > 0) {
        groupedBlocks.push({ type: "linkGroup", id: `group-${i}`, items: currentGroup });
        currentGroup = [];
      }
      groupedBlocks.push(block);
    }
  });
  if (currentGroup.length > 0) {
    groupedBlocks.push({ type: "linkGroup", id: `group-end`, items: currentGroup });
  }

  return (
    <>
      {groupedBlocks.map((group) => {
        if (group.type === "linkGroup") {
          const groupNode = (
            <div className="w-full mx-auto flex flex-col gap-2.5 p-4 rounded-3xl shadow-md border transition-all">
              {group.items.map((block: any) => {
                const iconType = block.content?.icon || "default";
                let IconComponent: any = Globe;
                if (iconType === "whatsapp") IconComponent = WhatsappIcon;
                else if (iconType === "web") IconComponent = Globe;
                
                return (
                  <a 
                    key={block.id} 
                    href={block.content?.url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between py-1.5 px-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] font-semibold tracking-wide"
                  >
                    <span>{block.content?.title || "Tautan"}</span>
                    {iconType !== "none" && (
                      <IconComponent 
                        size={20} 
                        className={iconType !== "default" ? "text-white" : "text-zinc-300"} 
                      />
                    )}
                  </a>
                );
              })}
            </div>
          );
          return renderBlockWrapper ? renderBlockWrapper(group, groupNode) : <div key={group.id} className="w-full flex justify-center">{groupNode}</div>;
        }
        
        const block = group;
        const isUploading = uploadingBlockIds?.has(block.id);
        const childNode = <SingleBlockRenderer block={block} isEditor={isEditor} pageSettings={pageSettings} isUploading={isUploading} />;
        
        if (renderBlockWrapper) {
          return renderBlockWrapper(block, childNode);
        }

        // Default wrapper for published page
        const wrapperStyle: React.CSSProperties = block.type === "divider" ? {
          marginTop: `${block.content?.margin ?? 24}px`,
          marginBottom: `${block.content?.margin ?? 24}px`,
        } : {};

        return (
          <div key={block.id} className="w-full" style={wrapperStyle}>
            {childNode}
          </div>
        );
      })}
    </>
  );
}
