### Issue: Implementasi Automated E2E Testing (Playwright)

**Deskripsi Tugas:**
Proyek WebLink (mirip Carrd/Linktree) sudah selesai di sisi UI dan fungsionalitas utama (Auth, Editor WYSIWYG, Upload, dan Publish). Tugas Anda (AI Junior) adalah membuat **Automated End-to-End (E2E) Testing** menggunakan **Playwright** untuk menggantikan proses *manual smoke testing*. 

Anda harus mengonfigurasi Playwright dari awal dan menulis skenario pengujian dasar.

---

### Tahap 1: Setup & Konfigurasi Playwright (TST-1)
**Fokus:** Menginstal dan menyiapkan *test environment*.
1. Jalankan perintah instalasi Playwright: `npm init playwright@latest` (pilih TypeScript, letakkan folder test di `tests/`, tambahkan GitHub Actions workflow jika ditanya).
2. Konfigurasikan file `playwright.config.ts`:
   - Set `baseURL` ke `http://localhost:3000`.
   - Pastikan ada konfigurasi `webServer` untuk menjalankan Next.js secara otomatis sebelum testing:
     ```ts
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     }
     ```

---

### Tahap 2: Skenario Auth & Pembuatan Proyek (TST-2)
**Fokus:** Menguji halaman utama dan inisialisasi proyek baru.
1. Buat file **[NEW] `tests/auth-dashboard.spec.ts`**.
2. Tulis *test case*:
   - Kunjungi halaman `/` (Landing Page) dan pastikan elemen teks "Satu Tautan untuk Semua" (atau tombol Login) muncul.
   - *(Bypass Auth)*: Karena Google SSO sulit dites langsung oleh robot, buat mekanisme *mock* session atau lewati login dengan langsung memanggil rute inisialisasi proyek (buat proyek baru via `/dashboard`). Pastikan halaman diarahkan ke `/editor/[id]`.

---

### Tahap 3: Skenario Drag & Drop dan Editor (TST-3)
**Fokus:** Menguji interaksi kanvas utama.
1. Buat file **[NEW] `tests/editor-canvas.spec.ts`**.
2. Tulis *test case*:
   - Buka halaman `/editor/[id]` (gunakan ID statis untuk testing atau ID hasil setup).
   - Simulasikan klik tombol **"+"** di toolbar untuk menambahkan setidaknya satu blok tipe "Heading" dan "Link".
   - Pastikan saat blok "Heading" diklik, sidebar kontekstual di sebelah kiri terbuka.
   - Ketikkan judul baru pada input di sidebar dan pastikan teks di dalam kanvas utama ikut berubah (*real-time sync*).

---

### Tahap 4: Skenario Background & Draft (TST-4)
**Fokus:** Memastikan custom background dan sistem *Draft terisolasi* berjalan benar.
1. Buat file **[NEW] `tests/draft-publish.spec.ts`**.
2. Tulis *test case*:
   - Klik ikon **Palette (Background)** di toolbar dan ganti background menjadi warna Hex tertentu.
   - Buka tab/page Playwright baru ke URL publik `/[slug-proyek]`.
   - Pastikan teks/elemen halaman menampilkan komponen khusus yang menyatakan "Halaman belum dipublikasikan" atau tidak ada konten (Draft aman).
   - Kembali ke halaman Editor, klik tombol **Publish**.
   - Kembali ke tab halaman publik, tekan *refresh*. Pastikan warna latar dan teks "Heading" yang dibuat di Tahap 3 sekarang tampil memukau di halaman publik!

---

**Aturan Eksekusi untuk AI Junior:**
- Playwright sangat cepat, jadi pastikan menambahkan `await page.waitForTimeout()` atau `waitForSelector` di bagian UI yang membutuhkan animasi (seperti Toast/Sidebar slide-in).
- Hindari interaksi yang memodifikasi database *production*. Jika perlu, buat skrip *teardown* untuk menghapus proyek uji.
- Gunakan bahasa TypeScript.
- Laporkan jika ada *assertion* yang gagal dan sertakan cuplikan error-nya.
