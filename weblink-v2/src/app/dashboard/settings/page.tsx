"use client"

import { useState } from "react"
import { updatePassword } from "src/app/actions/user"
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Account Settings</h1>
        <p className="text-zinc-500 text-sm">Update your account configuration and security settings</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden max-w-xl shadow-sm">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
            <Lock size={18} className="text-[#007F96]" />
            Set/Change Password
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Setting a password allows you to log in with your email address in addition to Google OAuth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} />
              Password updated successfully! You can now log in with your email.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-4 text-sm focus:border-zinc-400 focus:outline-none transition-colors text-zinc-800 placeholder-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-4 text-sm focus:border-zinc-400 focus:outline-none transition-colors text-zinc-800 placeholder-zinc-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#007F96] hover:bg-[#006678] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                "Save Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
