import { auth } from "auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Container from "@mui/material/Container";

import { prisma } from "src/lib/prisma";
import { getOptimizedImageUrl } from "src/lib/imageOptimization";

import BlankPageCard from "src/components/dashboard/BlankPageCard";
import ProjectActionMenu from "src/components/dashboard/ProjectActionMenu";

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
    <Container maxWidth={false} className="pt-8 pb-12 sm:pt-12 sm:pb-16">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-zinc-900 tracking-tight">Project saya</h1>
        <p className="text-gray-500 text-sm sm:text-[15px]">Kelola identitas digital dan halaman biolink Anda.</p>
      </header>

      {dbError && (
        <div className="mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-200">
          <h2 className="font-bold mb-2">Error Database Connection</h2>
          <p className="text-sm">Gagal terhubung ke database. Harap periksa pengaturan DATABASE_URL di Vercel.</p>
          <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{dbError}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {/* Kartu Tombol Buat Proyek Baru */}
        <BlankPageCard />

        {/* Daftar Proyek yang Sudah Ada */}
        {projects.map((project: any) => {
          let bgStyle: React.CSSProperties = { backgroundColor: "#141414" };
          let displayTitle = project.title;
          try {

            if (project.pageSettings) {
              const settings = typeof project.pageSettings === "string"
                ? JSON.parse(project.pageSettings)
                : project.pageSettings as any;

              if (settings.type === "image" && settings.imageUrl) {
                bgStyle = { backgroundImage: `url(${getOptimizedImageUrl(settings.imageUrl, { width: 400, quality: "auto" })})`, backgroundSize: "cover", backgroundPosition: "center" };
              } else if (settings.type === "gradient" && settings.gradient) {
                bgStyle = { background: settings.gradient };
              } else if (settings.color) {
                bgStyle = { backgroundColor: settings.color };
              }

              if (settings.profileTitle) {
                displayTitle = settings.profileTitle;
              }
            }
          } catch (error) {
            console.error("Failed to parse settings:", error);
          }

          const fullUrl = `${protocol}://${host}/${project.slug}`;

          return (
            <div
              key={project.id}
              className="flex flex-col w-full bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 hover:shadow-md hover:z-30 focus-within:z-30 transition-all group relative"
            >
              {/* Absolute link to make the entire card clickable */}
              <Link
                href={`/editor/${project.id}`}
                className="absolute inset-0 z-0"
              />

              {/* Thumbnail Preview Area */}
              <div
                className="relative aspect-video w-full border-b border-zinc-100 rounded-t-xl pointer-events-none"
                style={bgStyle}
              >
                {/* Status Teks: Solid Color */}
                <div className="absolute top-2 left-2 z-20">
                  <span className={`px-1.5 py-0.5 text-[8px] font-semibold tracking-wide uppercase rounded-md shadow-sm border ${
                    project.isPublished
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-zinc-500 text-white border-zinc-500"
                  }`}>
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Action Menu: Compact Glass Trigger */}
                <div className="absolute top-2 right-2 z-20 pointer-events-auto">
                  <ProjectActionMenu
                    projectId={project.id}
                    projectTitle={displayTitle}
                    fullUrl={fullUrl}
                    triggerClassName="p-0.5 rounded bg-black/25 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shadow-sm"
                  />
                </div>
              </div>

              {/* Card Info Area */}
              <div className="px-3 py-2.5 bg-white relative z-10 flex flex-col justify-start gap-1.5 w-full pointer-events-none rounded-b-xl">
                {/* Row 1: Judul Project */}
                <div className="w-full">
                  <h3 className="text-xs font-semibold text-zinc-900 line-clamp-1 break-all w-full m-0 p-0" title={displayTitle}>
                    {displayTitle}
                  </h3>
                </div>

                {/* Row 2: Metadata Tanggal (Dibuat & Diedit) */}
                <div className="flex flex-col gap-1 text-[10px] text-zinc-400 border-t border-zinc-100 pt-2 w-full">
                  <div className="flex justify-between items-center w-full">
                    <span>Dibuat</span>
                    <span className="font-medium text-zinc-500">
                      {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span>Diedit</span>
                    <span className="font-medium text-zinc-500">
                      {new Date(project.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
