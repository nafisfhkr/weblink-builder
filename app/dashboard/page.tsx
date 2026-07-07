import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BlankPageCard from "@/components/dashboard/BlankPageCard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  // Ambil daftar project milik user
  const projects = await prisma.project.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">My Projects</h1>
        <p className="text-gray-400 text-[15px]">Manage your digital identity and biolink pages.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Kartu Tombol Buat Proyek Baru */}
        <BlankPageCard />

        {/* Daftar Proyek yang Sudah Ada */}
        {projects.map((project) => (
          <Link 
            key={project.id} 
            href={`/editor/${project.id}`}
            className="flex flex-col overflow-hidden bg-[#121212] border border-[#2a2a2a] rounded-xl hover:border-[#4a4a4a] transition-all group"
          >
            {/* Thumbnail Preview Area */}
            <div className="relative h-64 bg-[#141414] w-full border-b border-[#2a2a2a] overflow-hidden flex items-center justify-center">
               <span className="text-gray-600 text-sm font-medium opacity-50 group-hover:opacity-100 transition-opacity">No Preview</span>
            </div>
            
            {/* Card Info Area */}
            <div className="p-5 bg-[#141414]">
              <h2 className="text-[17px] font-semibold mb-1 truncate text-white">{project.title}</h2>
              <p className="text-sm text-gray-500 truncate">linkbuilder.io/{project.slug}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
