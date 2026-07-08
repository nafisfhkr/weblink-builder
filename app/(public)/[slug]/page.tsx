import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

interface BlockItem {
  id: string;
  type: "link" | "image";
  title?: string;
  url?: string;
  storageKey?: string;
  alt?: string;
  order: number;
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
            className="rounded-full mb-4 border border-gray-800 shadow-xl"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-800 mb-4 border border-gray-700 shadow-xl" />
        )}
        
        <h1 className="text-xl font-bold text-white mb-8 tracking-tight">
          {project.title}
        </h1>

        {/* Blocks Section */}
        <div className="w-full flex flex-col gap-4">
          {blocks.length > 0 ? (
            blocks.map((block) => {
              if (block.type === "link") {
                return (
                  <a 
                    key={block.id} 
                    href={block.url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-[#171717] hover:bg-[#262626] text-white py-4 px-6 rounded-full border border-[#2a2a2a] hover:border-gray-500 transition-all font-medium shadow-sm hover:scale-[1.02]"
                  >
                    {block.title || "Link"}
                  </a>
                );
              } else if (block.type === "image") {
                return (
                  <div key={block.id} className="w-full overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#171717] shadow-sm transition-all hover:scale-[1.01]">
                    {block.url ? (
                      <div className="relative w-full aspect-[16/9]">
                        <Image
                          src={block.url}
                          alt={block.alt || "Block Image"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 680px) 100vw, 680px"
                        />
                      </div>
                    ) : (
                      <div className="w-full py-12 flex items-center justify-center text-gray-500 text-sm">
                        No image uploaded
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p className="text-gray-500 text-center">Belum ada tautan yang ditambahkan.</p>
          )}
        </div>
      </div>
      
      {/* LinkBuilder Watermark Footer */}
      <footer className="mt-auto pt-16">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
          POWERED BY LINKBUILDER
        </p>
      </footer>
    </div>
  );
}
