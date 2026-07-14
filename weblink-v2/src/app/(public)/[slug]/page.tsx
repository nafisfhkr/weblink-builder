import { prisma } from "src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { InstagramIcon, YoutubeIcon, FacebookIcon, XIcon, TiktokIcon, WhatsappIcon } from "src/components/ui/SocialIcons";
import { Globe } from "lucide-react";
import TextBlock from "src/components/builder/blocks/TextBlock";
import ContainerBlock from "src/components/builder/blocks/ContainerBlock";
import ButtonsBlock from "src/components/builder/blocks/ButtonsBlock";
import ImageBlock from "src/components/builder/blocks/ImageBlock";
import DividerBlock from "src/components/builder/blocks/DividerBlock";
import BlocksRenderer from "src/components/builder/BlocksRenderer";
import { getOptimizedImageUrl } from "src/lib/imageOptimization";
import OptimizedImage from "src/components/OptimizedImage";

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
    profileSpacing?: number;
    showProfile?: boolean;
    backgroundOverlayOpacity?: number;
    fontFamily?: string;
    profileImageWidth?: number;
    profileImageHeight?: number;
    profileImageFormat?: string;
    profileImageBytes?: number;
    profileImageGlassEffect?: boolean;
  } = {};
  try {
    if (project.pageSettings) {
      if (typeof project.pageSettings === "string") pageSettings = JSON.parse(project.pageSettings);
      else if (typeof project.pageSettings === "object") pageSettings = project.pageSettings as any;
    }
  } catch {}

  const bgStyle: React.CSSProperties =
    pageSettings.type === "image" && pageSettings.imageUrl
      ? { backgroundImage: `url(${getOptimizedImageUrl(pageSettings.imageUrl, { width: 1920, quality: "auto" })})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
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

  const getOverlayOpacity = (settings: any) => {
    if (settings.backgroundOverlayOpacity !== undefined) return settings.backgroundOverlayOpacity;
    if (settings.imageOverlayOpacity !== undefined) return settings.imageOverlayOpacity;
    return settings.type === "image" ? 55 : 0;
  };

  // Pastikan data block diurutkan berdasarkan field 'order'
  blocks.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-12 px-6 font-sans text-zinc-900 relative" style={{ ...bgStyle, fontFamily: pageSettings.fontFamily || 'inherit' }}>
      {getOverlayOpacity(pageSettings) > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ backgroundColor: `rgba(0, 0, 0, ${getOverlayOpacity(pageSettings) / 100})` }}
        />
      )}
      <div className="w-full max-w-[416px] flex flex-col items-center relative z-10">

        <div 
          className="w-full flex flex-col" 
          style={{ gap: `${pageSettings.blockSpacing ?? 16}px` }}
        >
          {blocks.length > 0 ? (
            <BlocksRenderer blocks={blocks} isEditor={false} pageSettings={pageSettings} />
          ) : (
            <p className="text-zinc-500 text-center py-8 italic text-sm">
              Halaman ini belum memiliki konten yang dipublikasikan.
            </p>
          )}
        </div>
      </div>
      
    </div>
  );
}
