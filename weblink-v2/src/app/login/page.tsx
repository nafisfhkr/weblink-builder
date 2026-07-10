"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setErrorMsg("Gagal melakukan autentikasi dengan Google. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F9FAFB] font-sans antialiased text-zinc-800 overflow-hidden">
      {/* Left Column (Brand & Phone Mockup) - Hidden on Mobile */}
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-b from-[#CDF1F6]/40 via-[#CDF1F6]/10 to-white p-6 flex-col justify-between border-r border-[#E8ECEF] select-none relative overflow-hidden h-full">
        {/* Subtle glow effects in background */}
        <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-[#5BD0DD]/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[5%] w-[180px] h-[180px] bg-[#007F96]/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-xl font-black text-[#007F96] tracking-tight">
            Weblink
          </span>
        </div>

        {/* Hero Illustration Content */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 relative z-10">
          <div className="text-center mb-5 max-w-sm">
            <h2 className="text-[#003A42] text-2xl font-extrabold mb-1 tracking-tight">
              Welcome back
            </h2>
            <p className="text-[#005B66]/80 text-xs leading-relaxed font-medium">
              Optimize your digital presence with a single bio link.
            </p>
          </div>

          {/* Premium Phone Mockup */}
          <div className="relative mx-auto border-zinc-900 bg-zinc-950 border-[8px] rounded-[1.75rem] h-[280px] w-[140px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
            {/* Speaker/Notch area */}
            <div className="h-[10px] w-[50px] bg-zinc-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md z-20"></div>

            {/* Inner Phone Content (Mock Biolink Page) */}
            <div className="flex-1 bg-gradient-to-b from-[#003A42] to-[#001D21] p-2.5 flex flex-col items-center justify-between text-white relative">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center mt-4 w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5BD0DD] to-[#CDF1F6] border border-white/20 shadow-md flex items-center justify-center text-[8px] font-bold text-[#003A42]">
                  W
                </div>
                <div className="h-1 w-10 bg-white/30 rounded mt-2" />
                <div className="h-0.5 w-16 bg-white/15 rounded mt-1" />
              </div>

              {/* Bio Links */}
              <div className="w-full flex flex-col gap-1.5 my-auto">
                <div className="h-4.5 w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-full flex items-center justify-center shadow-sm">
                  <div className="h-0.5 w-10 bg-white/40 rounded" />
                </div>
                <div className="h-4.5 w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-full flex items-center justify-center shadow-sm">
                  <div className="h-0.5 w-8 bg-white/40 rounded" />
                </div>
                <div className="h-4.5 w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-full flex items-center justify-center shadow-sm">
                  <div className="h-0.5 w-9 bg-white/40 rounded" />
                </div>
              </div>

              {/* Watermark */}
              <div className="text-[5px] text-white/30 font-medium tracking-wide">
                Powered by Weblink
              </div>
            </div>
          </div>
        </div>

        {/* Footer brand info */}
        <div className="text-[10px] text-zinc-400 font-medium">
          © {new Date().getFullYear()} Weblink. All rights reserved.
        </div>
      </div>

      {/* Right Column (Sign In Form) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white h-full">
        <div className="max-w-[340px] w-full flex flex-col">
          {/* Logo visible on mobile only */}
          <div className="flex md:hidden mb-5">
            <span className="text-xl font-black text-[#007F96] tracking-tight">
              Weblink
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-zinc-900 text-xl font-bold tracking-tight mb-1.5">
              Sign in to Weblink
            </h1>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Sign in with your Google account to start managing your biolinks.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed font-medium">
              {errorMsg}
            </div>
          )}

          {/* Google OAuth Login Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-800 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors text-sm shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-zinc-500" />
            ) : (
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
