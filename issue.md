# Task: Phase 1 - Setup & Initialization (SET-1)

**Konteks**: 
Kita sedang membangun aplikasi *micro-site builder* (ala Carrd.co/Linktree). Ini adalah tiket/issue untuk fase pertama, yaitu penyiapan environment, dependensi, dan skema database menggunakan Next.js App Router dan Prisma ORM dengan database MySQL lokal (MariaDB/XAMPP).

Tolong kerjakan langkah-langkah di bawah ini secara berurutan dan tuliskan kode atau jalankan command yang diminta.

---

## 1. Install Dependencies
Jalankan command berikut di terminal untuk menginstal library utama (termasuk Auth.js v5 beta, Prisma, dnd-kit untuk drag & drop, zod, dan lucide-react):

```bash
pnpm install next-auth@beta prisma @prisma/client @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zod lucide-react clsx tailwind-merge
pnpm install -D tsx
```

## 2. Prisma Setup
Jalankan inisialisasi prisma:
```bash
npx prisma init
```

### 2.1 Update `prisma/schema.prisma`
Timpa (replace) isi file `prisma/schema.prisma` yang baru dibuat dengan skema berikut:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String?   @unique
  image     String?
  projects  Project[]
}

model Project {
  id         String   @id @default(cuid())
  slug       String   @unique
  title      String   @default("My Linktree")
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  linksData  Json     @default("[]")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### 2.2 Buat `lib/prisma.ts`
Buat file baru di `lib/prisma.ts` untuk menginisialisasi Prisma Client sebagai singleton (mencegah warning koneksi database berlebih saat hot-reload Next.js):

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

## 3. Environment Variables (`.env`)
Update file `.env` dan `env.example` dengan format berikut. Karena kita menggunakan **XAMPP/MariaDB lokal**, kita perlu menyesuaikan format `DATABASE_URL`.

**Untuk file `.env` & `env.example`:**
```env
# Koneksi Database Lokal (XAMPP / MariaDB)
# Ubah 'weblink_db' dengan nama database yang kamu inginkan di phpMyAdmin/MySQL
DATABASE_URL="mysql://root:@localhost:3306/weblink_db"

# NextAuth (Auth.js v5)
# Generate AUTH_SECRET baru dengan menjalankan: npx auth secret
AUTH_SECRET="ganti_dengan_secret_yang_digenerate"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

## 4. Finalisasi Database (Migrasi)
Setelah `.env` diisi (pastikan database `weblink_db` sudah dibuat di MySQL/phpMyAdmin XAMPP Anda), jalankan command berikut untuk melakukan push skema ke database dan men-generate Prisma Client:

```bash
npx prisma db push
```

*(Catatan untuk AI: Jika kamu tidak bisa mengakses command line atau MySQL tidak menyala secara otomatis, cukup berikan panduan kepada user agar dia menyalakan XAMPP dan menjalankan command `db push` sendiri).*

---
**Expected Outcome**: 
Setelah tugas ini selesai, proyek sudah memiliki semua dependensi terinstall, Prisma client berhasil digenerate dan tersambung ke database lokal MariaDB, serta file konfigurasi siap untuk mulai mengembangkan fitur Authentication di Phase 2.

dan tetap perhatikan PRD
