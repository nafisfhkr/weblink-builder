import Link from "next/link";
import { auth } from "@/auth";
import { ArrowRight, Layout, Sparkles, Zap, Image as ImageIcon, Megaphone, Link as LinkIcon, ImagePlus, Heart } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
              <Layout size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">LinkBuilder</span>
          </div>
          <div>
            {isLoggedIn ? (
              <Link 
                href="/dashboard"
                className="text-sm font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="text-sm font-medium bg-teal-500 hover:bg-teal-400 text-teal-950 px-5 py-2 rounded-full transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[650px] pt-16 lg:pt-20 pb-8 flex flex-col justify-center overflow-hidden px-6">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-8 items-center w-full">
          
          {/* Left Column: Text */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles size={14} /> <span>Pembuat Link-in-Bio Generasi Baru</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-5 leading-[1.15]">
              Satu Tautan untuk <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                Semua Identitas Digitalmu.
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
              Buat landing page pribadi ala Carrd secara visual. Drag-and-drop foto, susun tautan, dan sesuaikan background dalam hitungan detik. 
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {isLoggedIn ? (
                <Link 
                  href="/dashboard"
                  className="group flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-7 py-3 rounded-full transition-all hover:shadow-[0_0_40px_8px_rgba(20,184,166,0.3)] hover:-translate-y-1 w-full sm:w-auto text-sm lg:text-base"
                >
                  Lanjut ke Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link 
                  href="/login"
                  className="group flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-7 py-3 rounded-full transition-all hover:shadow-[0_0_40px_8px_rgba(20,184,166,0.3)] hover:-translate-y-1 w-full sm:w-auto text-sm lg:text-base"
                >
                  Mulai Buat Halaman
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {!isLoggedIn && (
                <Link 
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold px-7 py-3 rounded-full transition-colors backdrop-blur-sm w-full sm:w-auto text-sm lg:text-base"
                >
                  Lihat Demo
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Image/Graphic */}
          <div className="relative w-full max-w-[400px] lg:max-w-none mx-auto aspect-[4/3] lg:aspect-auto lg:h-[400px] flex items-center justify-center order-1 lg:order-2">
             <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/30 to-indigo-500/30 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
             
             {/* Custom Illustration Container */}
             <div className="relative z-10 w-full h-full bg-[#121212] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Background grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                
                {/* Main Icon (Megaphone) */}
                <div className="relative bg-gradient-to-br from-teal-400 to-emerald-600 w-48 h-48 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(45,212,191,0.3)] z-20">
                  <Megaphone className="text-white w-24 h-24 transform -rotate-12" />
                </div>

                {/* Floating Elements mimicking SaaS marketing */}
                <div className="absolute top-1/4 left-[15%] bg-zinc-900 p-4 rounded-2xl border border-zinc-700 shadow-xl z-20 animate-bounce" style={{ animationDuration: '3.5s' }}>
                   <LinkIcon className="text-blue-400" size={28} />
                </div>
                <div className="absolute bottom-1/4 right-[15%] bg-zinc-900 p-4 rounded-2xl border border-zinc-700 shadow-xl z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                   <ImagePlus className="text-purple-400" size={28} />
                </div>
                <div className="absolute top-[20%] right-[25%] bg-zinc-900 p-3 rounded-full border border-zinc-700 shadow-xl z-20 animate-pulse" style={{ animationDuration: '2s' }}>
                   <Heart className="text-pink-500" size={20} fill="currentColor" />
                </div>
                <div className="absolute bottom-[20%] left-[25%] bg-zinc-900 p-3 rounded-full border border-zinc-700 shadow-xl z-20 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                   <Sparkles className="text-yellow-400" size={20} />
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-24 bg-[#0d0d0d] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Membangun Halaman Tak Pernah Semudah Ini</h2>
            <p className="text-zinc-500">Fitur editor profesional yang dirancang untuk kecepatan dan keindahan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#121212] border border-zinc-800/50 p-8 rounded-3xl hover:border-teal-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kanvas WYSIWYG Sejati</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Apa yang Anda lihat di editor adalah apa yang pengunjung lihat. Edit teks, susun blok, dan lihat hasilnya secara real-time tanpa perlu split-screen.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#121212] border border-zinc-800/50 p-8 rounded-3xl hover:border-teal-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Auto-Save Instan</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tidak ada lagi tombol "Simpan". Setiap perubahan tersimpan otomatis ke Draft. Halaman publik aman hingga Anda menekan "Publish".
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#121212] border border-zinc-800/50 p-8 rounded-3xl hover:border-teal-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Drag & Drop Foto</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tarik file foto langsung dari desktop ke dalam kanvas. Kustomisasi juga background halaman Anda dengan gradien atau foto pilihan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Layout size={16} />
            <span className="font-bold tracking-tight">LinkBuilder</span>
          </div>
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} LinkBuilder Inc. Didesain untuk para Kreator.
          </p>
        </div>
      </footer>

    </div>
  );
}
