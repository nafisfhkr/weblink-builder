# Task: Phase 2 - Authentication (ATH-1)

**Konteks**:
Melanjutkan proyek *micro-site builder* kita, di fase ini kamu akan mengimplementasikan sistem Autentikasi (Google SSO) menggunakan **Auth.js v5 (NextAuth beta)**.
Tolong ikuti panduan kode di bawah ini secara teliti dan buat/ubah file sesuai struktur Next.js App Router. Pastikan untuk selalu merujuk pada `PRD.md` jika ada keraguan.

---

## 1. Konfigurasi Auth.js (`auth.ts`)
Buat file baru di root project bernama `auth.ts`.
Kita akan menggunakan Google Provider. Saat pengguna login, kita ingin menyimpan atau memastikan email mereka terdaftar di tabel `User` database kita menggunakan callback `signIn`.

**Buat file `auth.ts` di root folder:**
```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Simpan / sinkronisasi data user ke database
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        // Ambil ID user dari database untuk disisipkan ke session
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
})
```

## 2. API Route Handler untuk NextAuth
Buat API Endpoint yang menangani callback OAuth dari Google.

**Buat file `app/api/auth/[...nextauth]/route.ts`:**
```typescript
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

## 3. Middleware Protection
Kita perlu memblokir akses pengunjung yang belum login agar tidak bisa masuk ke halaman `/dashboard` dan `/editor/*`.

**Buat file `middleware.ts` di root folder:**
```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedPath = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/editor');

  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

## 4. Halaman Login UI
Buat tampilan halaman login yang terpusat dengan *dark background* dan tombol "Continue with Google".

**Buat file `app/login/page.tsx`:**
```tsx
import { signIn } from "@/auth"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Sign in to start building your micro-site</p>
        
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}
```

## 5. Menyiapkan Secret
Jalankan perintah ini di terminal untuk men-generate Auth Secret baru. Copy hasilnya dan masukkan ke file `.env` kamu di bagian `AUTH_SECRET="..."`.
```bash
npx auth secret
```

*(Catatan untuk AI: Setelah menulis semua kode di atas, pastikan kamu memberitahu user untuk melengkapi nilai `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` di file `.env` dengan kredensial asli dari Google Cloud Console mereka sebelum melakukan testing login).*

---
**Expected Outcome**: 
Aplikasi sekarang memiliki middleware yang melindungi rute `dashboard` dan `editor`. Mengakses rute tersebut tanpa login akan melempar user ke `/login`. Proses login akan berjalan otomatis menggunakan Google, menyimpan data user ke tabel `User`, dan mem-forward mereka ke `/dashboard`!
