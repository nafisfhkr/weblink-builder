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
                className="relative aspect-video w-full border-b border-zinc-100 overflow-hidden rounded-t-xl pointer-events-none"
                style={bgStyle}
              />

              {/* Card Info Area */}
              <div className="pl-3 pr-1.5 pt-1.5 pb-2 bg-white relative z-10 flex-1 flex flex-col justify-start gap-0.5 w-full pointer-events-none rounded-b-xl">
                {/* Row 1: Status & Menu Aksi */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[9px] font-bold tracking-wider uppercase ${project.isPublished ? "text-emerald-600" : "text-zinc-400"}`}>
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                  
                  <div className="pointer-events-auto shrink-0">
                    <ProjectActionMenu projectId={project.id} projectTitle={displayTitle} fullUrl={fullUrl} />
                  </div>
                </div>

                {/* Row 2: Judul Project */}
                <div className="w-full mt-0.5 pr-1.5">
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-1 break-all w-full" title={displayTitle}>
                    {displayTitle}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
