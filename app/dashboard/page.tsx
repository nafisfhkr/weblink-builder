import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BlankPageCard from "@/components/dashboard/BlankPageCard";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteProjectButton from "@/components/dashboard/DeleteProjectButton";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const headersList = await headers();
  const host = headersList.get("host") || "weblink-builder.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";

  let projects: any[] = [];
  let dbError = null;

  try {
    // Ambil daftar project milik user
    projects = await prisma.project.findMany({
      where: { userId: session.user.id },
    });
    // Sorting di sisi aplikasi untuk menghindari error "Out of sort memory" di database
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    console.error("Database connection error:", error);
    dbError = error.message;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white tracking-tight">My Projects</h1>
        <p className="text-gray-400 text-sm sm:text-[15px]">Manage your digital identity and biolink pages.</p>
      </header>

      {dbError && (
        <div className="mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-200">
          <h2 className="font-bold mb-2">Error Database Connection</h2>
          <p className="text-sm">Gagal terhubung ke database. Harap periksa pengaturan DATABASE_URL di Vercel.</p>
          <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{dbError}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Kartu Tombol Buat Proyek Baru */}
        <BlankPageCard />

        {/* Daftar Proyek yang Sudah Ada */}
        {projects.map((project: any) => {
          let bgStyle: React.CSSProperties = { backgroundColor: "#141414" };
          try {

            if (project.pageSettings) {
              const settings = typeof project.pageSettings === "string"
                ? JSON.parse(project.pageSettings)
                : project.pageSettings as any;

              if (settings.type === "image" && settings.imageUrl) {
                bgStyle = { backgroundImage: `url(${settings.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
              } else if (settings.type === "gradient" && settings.gradient) {
                bgStyle = { background: settings.gradient };
              } else if (settings.color) {
                bgStyle = { backgroundColor: settings.color };
              }
            }
          } catch (e) { }

          const fullUrl = `${protocol}://${host}/${project.slug}`;

          return (
            <div
              key={project.id}
              className="flex flex-col overflow-hidden bg-[#121212] border border-[#2a2a2a] rounded-xl hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-all group relative"
            >
              <Link href={`/editor/${project.id}`} className="block h-full absolute inset-0 z-0"></Link>

              {/* Thumbnail Preview Area */}
              <div
                className="relative h-48 sm:h-64 w-full border-b border-[#2a2a2a] overflow-hidden flex flex-col items-center justify-center p-4 pointer-events-none"
                style={bgStyle}
              >
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-semibold truncate block max-w-full">
                    {project.title}
                  </span>
                </div>
              </div>

              {/* Card Info Area */}
              <div className="p-5 bg-[#141414] relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1.5 gap-2 pointer-events-none">
                  <h2 className="text-[17px] font-semibold truncate text-white flex-1">{project.title}</h2>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${project.isPublished
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}>
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-zinc-900">
                  <p className="text-xs text-gray-500 truncate flex-1">
                    {host}/{project.slug}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CopyLinkButton url={fullUrl} />
                    <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
