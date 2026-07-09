"use client"

import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-8">Sign in to start building your micro-site</p>
        
        <button 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-medium py-3 px-4 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <LogIn size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  )
}
