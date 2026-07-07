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
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}
