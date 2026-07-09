import { prisma } from "src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { InstagramIcon, YoutubeIcon, FacebookIcon, XIcon, TiktokIcon, WhatsappIcon } from "src/components/ui/SocialIcons";
import { Globe } from "lucide-react";

export const dynamic = "force-dynamic";

interface BlockItem {
  id: string;
  type: "heading" | "link" | "image" | "divider" | "social";
  content?: any;
  order: number;
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", icon: InstagramIcon },
  { value: "youtube", icon: YoutubeIcon },
  { value: "facebook", icon: FacebookIcon },
  { value: "x", icon: XIcon },
  { value: "tiktok", icon: TiktokIcon },
];

function getPlatformUrl(platform: string, input: string) {
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

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Ambil data project beserta relasi user
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { user: true },
  });

  // Jika slug tidak ditemukan di database, langsung lemparkan ke halaman 404
  if (!project) notFound();

  // Jika slug ditemukan tapi project belum pernah dipublikasikan
  if (!project.isPublished) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6 font-sans">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-800 mb-2">Halaman Belum Dipublikasikan</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Halaman ini sedang dalam tahap persiapan dan belum siap untuk dilihat publik.
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-mono tracking-widest uppercase pt-4 border-t border-zinc-200 w-full text-center">
            /{slug}
          </div>
        </div>
      </div>
    );
  }


  // Parsing JSON publishedBlocksData secara aman
  let blocks: BlockItem[] = [];
  try {
    if (project.publishedBlocksData) {
      if (typeof project.publishedBlocksData === 'string') {
        blocks = JSON.parse(project.publishedBlocksData);
      } else if (Array.isArray(project.publishedBlocksData)) {
        blocks = project.publishedBlocksData as unknown as BlockItem[];
      }
    }
  } catch (error) {
    console.error("Failed to parse publishedBlocksData", error);
  }

  // Parse pageSettings for background and card styles
  let pageSettings: { 
    type?: string; 
    color?: string; 
    gradient?: string; 
    imageUrl?: string;
    cardBgColor?: string;
    cardBgOpacity?: number;
    cardTextColor?: string;
    cardBorderColor?: string;
    cardBorderOpacity?: number;
    cardBlur?: number;
    cardShowHeadingCard?: boolean;
    imageOverlayOpacity?: number;
    profileImageUrl?: string;
    profileTitle?: string;
    profileBio?: string;
    blockSpacing?: number;
    showProfile?: boolean;
    backgroundOverlayOpacity?: number;
    fontFamily?: string;
  } = {};
  try {
    if (project.pageSettings) {
      if (typeof project.pageSettings === "string") pageSettings = JSON.parse(project.pageSettings);
      else if (typeof project.pageSettings === "object") pageSettings = project.pageSettings as any;
    }
  } catch {}

  const bgStyle: React.CSSProperties =
    pageSettings.type === "image" && pageSettings.imageUrl
      ? { backgroundImage: `url(${pageSettings.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
      : pageSettings.type === "gradient" && pageSettings.gradient
      ? { background: pageSettings.gradient }
      : { backgroundColor: pageSettings.color || "#ffffff" };

  // Helper to convert hex and opacity to rgba
  const hexToRgba = (hex: string = "#121212", opacityPercentage: number = 100) => {
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c.charAt(0) + c.charAt(0) + c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2);
    }
    const r = parseInt(c.substring(0, 2), 16) || 18;
    const g = parseInt(c.substring(2, 4), 16) || 18;
    const b = parseInt(c.substring(4, 6), 16) || 18;
    const alpha = opacityPercentage / 100;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardBg = hexToRgba(pageSettings.cardBgColor || "#ffffff", pageSettings.cardBgOpacity ?? 10);
  const cardBorder = hexToRgba(pageSettings.cardBorderColor || "#ffffff", pageSettings.cardBorderOpacity ?? 20);
  const cardText = pageSettings.cardTextColor || "#ffffff";
  const cardBlur = pageSettings.cardBlur !== undefined ? `${pageSettings.cardBlur}px` : "10px";

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    color: cardText,
    backdropFilter: cardBlur !== "0px" ? `blur(${cardBlur})` : undefined,
    WebkitBackdropFilter: cardBlur !== "0px" ? `blur(${cardBlur})` : undefined,
  };

  // Pastikan data block diurutkan berdasarkan field 'order'
  blocks.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 font-sans text-zinc-900 relative" style={{ ...bgStyle, fontFamily: pageSettings.fontFamily || 'inherit' }}>
      {((pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 55) > 0) && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ backgroundColor: `rgba(0, 0, 0, ${(pageSettings.backgroundOverlayOpacity ?? pageSettings.imageOverlayOpacity ?? 55) / 100})` }}
        />
      )}
      <div className="w-full max-w-[680px] flex flex-col items-center relative z-10">
        {/* Profile / Header Section */}
        {pageSettings.showProfile !== false && (
          <div className="w-full flex flex-col items-center relative z-10 mb-6">
            {pageSettings.profileImageUrl || project.user?.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                src={pageSettings.profileImageUrl || project.user?.image || ""} 
                alt={pageSettings.profileTitle || project.user?.name || "Profile"} 
                className="rounded-full mb-4 border shadow-xl object-cover h-24 w-24"
              />
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-zinc-200 mb-4 border shadow-xl" />
            )}

            {(pageSettings.profileTitle || project.user?.name) && (
              <h1 className="text-xl font-bold mb-1">{pageSettings.profileTitle || project.user?.name}</h1>
            )}
            {pageSettings.profileBio && (
              <p className="text-sm opacity-80 text-center max-w-md">{pageSettings.profileBio}</p>
            )}
          </div>
        )}

        {/* Blocks Section */}
        <div 
          className="w-full flex flex-col mt-4" 
          style={{ gap: `${pageSettings.blockSpacing ?? 16}px` }}
        >
          {blocks.length > 0 ? (
            (() => {
                const groupedBlocks: any[] = [];
                let currentGroup: any[] = [];

                blocks.forEach((block, i) => {
                  if (block.type === "link") {
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

                return groupedBlocks.map((group) => {
                  if (group.type === "linkGroup") {
                    return (
                      <div key={group.id} style={cardStyle} className="w-full max-w-[500px] mx-auto flex flex-col gap-3 p-6 rounded-[32px] shadow-md border transition-all">
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
                              className="w-full flex items-center justify-between py-4 px-6 rounded-full border border-zinc-700/50 hover:bg-white/5 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] font-semibold tracking-wide"
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
                  }
                  
                  const block = group;
                  switch (block.type) {
                    case "heading": {
                      const customColorStyle: React.CSSProperties = {
                        color: block.content?.textColor || cardStyle?.color,
                        fontSize: block.content?.textSize ? `${block.content.textSize}px` : undefined,
                        textAlign: (block.content?.align as any) || "center",
                        textAlignLast: block.content?.align === "justify" ? "center" : undefined,
                      };
                      
                      const pStyle: React.CSSProperties = {
                        color: block.content?.textColor || cardStyle?.color,
                        opacity: 0.8,
                        textAlign: (block.content?.align as any) || "center",
                        textAlignLast: block.content?.align === "justify" ? "center" : undefined,
                      };
                      
                      if (block.content?.useCard === true || (block.content?.useCard !== false && pageSettings.cardShowHeadingCard)) {
                        return (
                          <div 
                            key={block.id} 
                            style={cardStyle}
                            className="w-full text-center border p-5 rounded-2xl transition-all shadow-md"
                          >
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
                        <div key={block.id} className="w-full text-center">
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
                    case "text": {
                      const customTextStyle: React.CSSProperties = {
                        color: block.content?.textColor || cardStyle?.color || "#a1a1aa",
                        fontSize: block.content?.textSize ? `${block.content.textSize}px` : undefined,
                        textAlign: (block.content?.align as any) || "center",
                        textAlignLast: block.content?.align === "justify" ? "center" : undefined,
                      };
                      if (block.content?.useCard === true) {
                        return (
                          <div key={block.id} style={cardStyle} className="w-full text-center border p-5 rounded-2xl transition-all shadow-md">
                            <p style={customTextStyle} className="max-w-md mx-auto whitespace-pre-wrap leading-relaxed">
                              {block.content?.text || ""}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div key={block.id} className="w-full text-center">
                          <p style={customTextStyle} className="max-w-md mx-auto whitespace-pre-wrap leading-relaxed">
                            {block.content?.text || ""}
                          </p>
                        </div>
                      );
                    }
                    case "image": {
                      const ratio = block.content?.aspectRatio || "widescreen";
                      let containerShape = "rounded-2xl";
                      let wrapperClass = "relative w-full";

                      if (ratio === "widescreen") {
                        containerShape = "rounded-2xl";
                        wrapperClass += " aspect-[16/9]";
                      } else if (ratio === "square") {
                        containerShape = "rounded-2xl";
                        wrapperClass += " aspect-square";
                      } else if (ratio === "circle") {
                        containerShape = "rounded-full max-w-[200px] mx-auto";
                        wrapperClass += " aspect-square";
                      }

                      const useCardImage = block.content?.useCard !== false;
                      return (
                    <div 
                      key={block.id} 
                      style={useCardImage ? cardStyle : undefined}
                      className={`w-full overflow-hidden transition-all hover:scale-[1.005] ${containerShape} ${
                        useCardImage ? "border shadow-md" : ""
                      }`}
                    >
                      {block.content?.url ? (
                        <div className={wrapperClass}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={block.content.url}
                            alt={block.content.alt || "Block Image"}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-full py-12 flex items-center justify-center text-zinc-600 text-sm">
                          Gambar belum diunggah
                        </div>
                      )}
                    </div>
                  );
                }
                case "divider": {
                  return (
                    <hr key={block.id} className="w-4/5 mx-auto my-6 border-t border-zinc-900" />
                  );
                }
                case "social": {
                  const items = block.content?.items || [];
                  const useCardSocial = block.content?.useCard !== false;
                  return (
                    <div key={block.id} className="w-full flex justify-center gap-3.5 py-3">
                      {items.map((item: any, i: number) => {
                        const platformConfig = AVAILABLE_PLATFORMS.find((p) => p.value === item.platform);
                        const Icon = platformConfig?.icon || Globe;
                        return (
                          <a
                            key={i}
                            href={getPlatformUrl(item.platform, item.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={useCardSocial ? cardStyle : undefined}
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
            });
          })()
          ) : (
            <p className="text-zinc-500 text-center py-8 italic text-sm">
              Halaman ini belum memiliki konten yang dipublikasikan.
            </p>
          )}
        </div>
      </div>
      
      {/* LinkBuilder Watermark Footer */}
      <div className="mt-16 pb-8 flex justify-center relative z-10 w-full mt-auto pt-20">
        <a 
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium opacity-60 hover:opacity-100 transition-opacity"
        >
          Powered by <span className="font-bold">Weblink Builder</span>
        </a>
      </div>
    </div>
  );
}
