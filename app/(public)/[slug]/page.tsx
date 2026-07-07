import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

interface LinkItem {
  id: string;
  title: string;
  url: string;
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

  // Parsing JSON linksData secara aman
  let links: LinkItem[] = [];
  try {
    if (typeof project.linksData === 'string') {
      links = JSON.parse(project.linksData);
    } else if (Array.isArray(project.linksData)) {
      links = project.linksData as unknown as LinkItem[];
    }
  } catch (error) {
    console.error("Failed to parse linksData", error);
  }

  // Pastikan data link diurutkan berdasarkan field 'order'
  links.sort((a, b) => a.order - b.order);

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

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4">
          {links.length > 0 ? (
            links.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block text-center bg-[#171717] hover:bg-[#262626] text-white py-4 px-6 rounded-full border border-[#2a2a2a] hover:border-gray-500 transition-all font-medium shadow-sm hover:scale-[1.02]"
              >
                {link.title}
              </a>
            ))
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
