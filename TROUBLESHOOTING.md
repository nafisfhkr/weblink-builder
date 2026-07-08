# Dokumentasi Deployment & Troubleshooting

Dokumen ini merangkum tantangan utama yang dihadapi selama proses *deployment* proyek LinkBuilder ke Vercel, serta solusi teknis yang diterapkan untuk menyelesaikannya. Dua area utama yang dibahas adalah **Database MySQL** dan **Sistem Upload Gambar**.

---

## 1. Migrasi Database (Local SQLite ke Cloud MySQL)

### Masalah
Pada awalnya, aplikasi dikembangkan menggunakan database **SQLite** (`dev.db`). Ketika aplikasi di-*deploy* ke **Vercel**, database tidak berfungsi (gagal membaca/menulis data). Hal ini terjadi karena Vercel menggunakan arsitektur **Serverless**. Dalam lingkungan serverless, sistem file (*filesystem*) bersifat *ephemeral* (sementara) dan *read-only*. SQLite yang bergantung pada file lokal tidak akan tersimpan secara permanen antar *request*.

### Solusi
- **Mengganti Provider Prisma:** Mengubah konfigurasi di `prisma/schema.prisma` dari `provider = "sqlite"` menjadi `provider = "mysql"`.
- **Database Berbasis Cloud:** Menggunakan layanan cloud database gratis (seperti **Aiven** atau **PlanetScale**) untuk mendapatkan koneksi MySQL publik.
- **Konfigurasi Environment Variable:** Memasukkan string koneksi publik tersebut ke dalam variabel `DATABASE_URL` di Vercel Settings, sehingga fungsi *serverless* Next.js dapat melakukan operasi baca/tulis langsung ke cloud database.

---

## 2. Sistem Upload Gambar (Error 500 di Vercel)

Sistem unggah gambar mengalami beberapa iterasi untuk mengatasi berbagai masalah yang muncul di lingkungan produksi Vercel.

### Iterasi 1: Server-Side Upload (Vercel Blob & Cloudinary)
**Masalah:**  
Awalnya, gambar dikirim dari browser ke server (API route `/api/upload`), lalu diteruskan ke layanan *storage*. Saat di-*deploy* ke Vercel, proses ini secara konsisten menghasilkan **Error 500 (Internal Server Error)**. 
- **Penyebab Utama:** Vercel Serverless Functions memiliki batasan ketat (*Payload Limit* maksimal 4.5MB). Mengirimkan file gambar berukuran besar melalui *multipart/form-data* ke API Route sering kali menyebabkan memori penuh atau *timeout* pada paket gratis (Hobby tier).

### Iterasi 2: Client-Side Upload (Cloudinary Unsigned)
**Masalah:**  
Untuk menghindari batas *serverless*, pendekatan diubah agar browser mengunggah langsung ke Cloudinary API. Namun, hal ini menyebabkan *error* **"Cloudinary configuration is missing"**.
- **Penyebab Utama:** Kurangnya pengaturan variabel `NEXT_PUBLIC_` di sisi klien, serta hambatan konfigurasi tambahan di mana akun Cloudinary harus disetel secara manual untuk menerima *Unsigned Uploads* dengan *Preset* tertentu. Proses ini rentan terhadap kesalahan konfigurasi (human error).

### Solusi Final: Kompresi Base64 Langsung ke Database (The "It Just Works" Solution)
Untuk menjamin keberhasilan 100% tanpa bergantung pada layanan penyimpanan pihak ketiga (*third-party storage*) dan konfigurasi variabel lingkungan tambahan, sistem perombak total menjadi:

1. **Kompresi Klien (Browser):** Saat pengguna memilih gambar, aplikasi menggunakan HTML5 `<canvas>` untuk melakukan *resize* ukuran gambar (maksimal lebar 1000px) dan mengompresinya menjadi format JPEG (kualitas 0.7).
2. **Konversi Base64:** Gambar yang sudah dikompresi berukuran sangat kecil tersebut diubah menjadi teks (*Base64 String*).
3. **Penyimpanan Langsung:** Teks Base64 disimpan langsung ke dalam kolom `JSON` pada database MySQL (bersama dengan data pengaturan halaman).

**Hasil:**
- **Zero Configuration:** Tidak perlu mengatur kunci API atau *bucket* penyimpanan eksternal.
- **Anti-Error:** Sama sekali tidak melewati batasan server Vercel sehingga terhindar dari Error 500 secara permanen.
- **Performa Terjaga:** Berkat kompresi otomatis di sisi *client*, ukuran data Base64 tetap kecil (biasanya di bawah 200KB) sehingga tidak membebani database MySQL.
