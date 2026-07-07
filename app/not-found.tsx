import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans">
      <div className="text-center px-6">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, tautan atau halaman profil yang Anda cari tidak ada atau mungkin telah dihapus.
        </p>
        <Link 
          href="/dashboard" 
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
