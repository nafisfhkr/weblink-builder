import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BlankPageCard from "@/components/dashboard/BlankPageCard";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  // Ambil daftar project milik user
  const projects = await prisma.project.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-800">
          <LayoutDashboard size={28} className="text-blue-500" />
          <h1 className="text-3xl font-bold font-sans">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Kartu Tombol Buat Proyek Baru */}
          <BlankPageCard />

          {/* Daftar Proyek yang Sudah Ada */}
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/editor/${project.id}`}
              className="flex flex-col justify-between p-6 h-48 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 transition-colors"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 truncate font-sans">{project.title}</h2>
                <p className="text-gray-500 text-sm truncate">/{project.slug}</p>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
