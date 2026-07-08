import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Bell } from "lucide-react";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-[#1f1f1f] bg-[#0a0a0a] px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8 h-full">
          <Link href="/dashboard" className="text-[#00e59b] font-bold text-xl tracking-tight">
            LinkBuilder
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-medium h-full">
            <Link href="/dashboard" className="h-full flex items-center text-white border-b-2 border-[#00e59b] mt-[2px]">
              Projects
            </Link>
            <Link href="#" className="h-full flex items-center hover:text-gray-200 transition-colors">
              Analytics
            </Link>
            <Link href="#" className="h-full flex items-center hover:text-gray-200 transition-colors">
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="hidden sm:block text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 md:gap-4 sm:border-l border-[#1f1f1f] sm:pl-6">
            <form action={async () => {
              "use server";
              await signOut();
            }}>
              <button className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors">
                Logout
              </button>
            </form>
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={32} 
                height={32} 
                className="rounded-full border border-gray-700 opacity-90 hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] py-10 text-center bg-[#0a0a0a]">
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div>
        <p className="text-xs font-bold tracking-widest text-gray-600 uppercase">
          POWERED BY LINKBUILDER
        </p>
      </footer>
    </div>
  );
}
