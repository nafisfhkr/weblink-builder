# Task: Phase 5 - Halaman Publik (PUB-1)

**Konteks**:
Ini adalah fase untuk membangun Halaman Publik (*Public View*) yang bersifat *read-only*. Halaman ini adalah hasil akhir dari *micro-site builder* yang akan diakses oleh pengunjung (visitor) melalui URL `/[slug]`. 

Pastikan untuk menggunakan **React Server Component (RSC)** demi performa yang optimal dan SEO-friendly.

---

## 1. Dynamic Route (Halaman Publik)
Halaman ini bertugas mengambil data proyek berdasarkan slug dari URL, mengurutkan daftar tautan, dan merendernya dalam antarmuka bergaya Linktree.

**Buat file `app/(public)/[slug]/page.tsx`:**
```tsx
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

  // Ambil data project beserta relasi user (untuk foto profil jika diperlukan)
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
      links = project.linksData as LinkItem[];
    }
  } catch (error) {
    console.error("Failed to parse linksData", error);
  }

  // Pastikan data link diurutkan berdasarkan field 'order'
  links.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6 font-sans">
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
```

## 2. Halaman Not Found (404) Custom
Halaman ini akan muncul secara otomatis jika visitor mengakses URL yang slug-nya tidak terdaftar di database, sesuai instruksi `notFound()` di atas.

**Buat file `app/not-found.tsx`:**
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, tautan atau halaman profil yang Anda cari tidak ada atau mungkin telah dihapus.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
```

---

## Langkah Validasi Wajib (Untuk AI)
Sebelum kamu (AI) menyatakan tugas ini selesai, kamu **WAJIB** melakukan verifikasi melalui terminal:
1. **Type Checking**: Jalankan `npx tsc --noEmit`. Pastikan tidak ada error (0 errors). Terutama pastikan tipe parameter dinamis `Promise<{ slug: string }>` kompatibel dengan Next.js 16.
2. **Production Build**: Jalankan `pnpm run build`. Pastikan rute publik dan halaman 404 berhasil ter-compile tanpa error.
*(Jangan push hasil pekerjaanmu, laporkan saja hasil build-nya).*
