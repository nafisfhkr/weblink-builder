import { auth } from "auth";
import { prisma } from "src/lib/prisma";
import BlankPageCard from "src/components/dashboard/BlankPageCard";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteProjectButton from "src/components/dashboard/DeleteProjectButton";
import CopyLinkButton from "src/components/dashboard/CopyLinkButton";
import EditSlugForm from "src/components/dashboard/EditSlugForm";
import { headers } from "next/headers";
import Container from "@mui/material/Container";

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-zinc-900 tracking-tight">Proyek Saya</h1>
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
              className="flex flex-col w-full overflow-hidden bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group"
            >
              {/* Thumbnail Preview Area */}
              <Link
                href={`/editor/${project.id}`}
                className="relative aspect-video w-full border-b border-zinc-100 overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 hover:opacity-90 transition-opacity"
                style={bgStyle}
              >
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-semibold truncate block max-w-full">
                    {project.title}
                  </span>
                </div>
              </Link>

              {/* Card Info Area */}
              <div className="p-3 bg-white relative z-10 flex-1 flex flex-col w-full">
                {/* Baris 1: Judul Proyek & Badge Status */}
                <div className="flex items-center justify-between gap-2 w-full mb-1">
                  <Link href={`/editor/${project.id}`} className="hover:underline flex-1 min-w-0">
                    <h2 className="text-[14px] sm:text-[15px] font-bold truncate text-zinc-900 leading-snug">{project.title}</h2>
                  </Link>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${project.isPublished
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}>
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Baris 2: Komponen EditSlugForm (Inline Slug & Pencil) */}
                <div className="mb-2.5 w-full">
                  <EditSlugForm projectId={project.id} initialSlug={project.slug} host={host} />
                </div>

                {/* Baris 3: Footer Aksi (Hanya Salin & Hapus Icon di Kanan) */}
                <div className="flex items-center justify-end gap-2 mt-auto pt-2.5 border-t border-zinc-100 w-full">
                  <CopyLinkButton url={fullUrl} />
                  <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
