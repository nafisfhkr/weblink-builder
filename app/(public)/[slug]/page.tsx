import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Camera, Play, Globe, Music } from "lucide-react";

interface BlockItem {
  id: string;
  type: "heading" | "link" | "image" | "divider" | "social";
  content?: any;
  order: number;
}

const AVAILABLE_PLATFORMS = [
  { value: "instagram", icon: Camera },
  { value: "youtube", icon: Play },
  { value: "facebook", icon: Globe },
  { value: "x", icon: Globe },
  { value: "tiktok", icon: Music },
];

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Ambil data project beserta relasi user
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { user: true },
  });

  // Jika slug tidak ditemukan di database, langsung lemparkan ke halaman 404
  if (!project) notFound();

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

  // Pastikan data block diurutkan berdasarkan field 'order'
  blocks.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6 font-sans text-white">
      <div className="w-full max-w-[680px] flex flex-col items-center">
        {/* Profile / Header Section */}
        {project.user?.image ? (
          <Image 
            src={project.user.image} 
            alt={project.user.name || "Profile"} 
            width={96} 
            height={96} 
            className="rounded-full mb-6 border border-zinc-800 shadow-2xl"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-zinc-900 mb-6 border border-zinc-800 shadow-2xl" />
        )}

        {/* Blocks Section */}
        <div className="w-full flex flex-col gap-4 mt-4">
          {blocks.length > 0 ? (
            blocks.map((block) => {
              switch (block.type) {
                case "heading":
                  return (
                    <div key={block.id} className="w-full text-center my-4">
                      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        {block.content?.title || ""}
                      </h1>
                      {block.content?.bio && (
                        <p className="text-zinc-400 text-sm max-w-md mx-auto whitespace-pre-wrap leading-relaxed">
                          {block.content.bio}
                        </p>
                      )}
                    </div>
                  );
                case "link":
                  return (
                    <a 
                      key={block.id} 
                      href={block.content?.url || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full block text-center bg-[#121212] hover:bg-zinc-900 text-white py-4 px-6 rounded-full border border-zinc-900 hover:border-zinc-700 transition-all font-semibold tracking-wide shadow-md hover:scale-[1.01]"
                    >
                      {block.content?.title || "Tautan"}
                    </a>
                  );
                case "image":
                  return (
                    <div key={block.id} className="w-full overflow-hidden rounded-2xl border border-zinc-900 bg-[#121212] shadow-md transition-all hover:scale-[1.005]">
                      {block.content?.url ? (
                        <div className="relative w-full aspect-[16/9]">
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
                case "divider":
                  return (
                    <hr key={block.id} className="w-4/5 mx-auto my-6 border-t border-zinc-900" />
                  );
                case "social":
                  const items = block.content?.items || [];
                  return (
                    <div key={block.id} className="w-full flex justify-center gap-3.5 py-3">
                      {items.map((item: any, i: number) => {
                        const platformConfig = AVAILABLE_PLATFORMS.find((p) => p.value === item.platform);
                        const Icon = platformConfig?.icon || Globe;
                        return (
                          <a
                            key={i}
                            href={item.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-[#121212] border border-zinc-900 text-zinc-400 hover:text-white rounded-full hover:scale-110 hover:border-zinc-700 transition-all shadow-md"
                            title={item.platform}
                          >
                            <Icon size={18} />
                          </a>
                        );
                      })}
                    </div>
                  );
                default:
                  return null;
              }
            })
          ) : (
            <p className="text-zinc-500 text-center py-8 italic text-sm">
              Halaman ini belum memiliki konten yang dipublikasikan.
            </p>
          )}
        </div>
      </div>
      
      {/* LinkBuilder Watermark Footer */}
      <footer className="mt-auto pt-20">
        <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-700 uppercase">
          POWERED BY LINKBUILDER
        </p>
      </footer>
    </div>
  );
}
