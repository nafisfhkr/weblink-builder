"use client"

import { useState } from "react"
import Link from "next/link"
import { updatePassword } from "src/app/actions/user"
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter.")
      return
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.")
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[280px] mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium mb-3 cursor-pointer"
        >
          <ArrowLeft size={12} />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-lg font-bold text-zinc-900 mb-1">Pengaturan Akun</h1>
        <p className="text-zinc-500 text-[11px] leading-relaxed">Perbarui konfigurasi dan keamanan akun Anda.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden w-full shadow-2xs">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <Lock size={14} className="text-[#007F96]" />
            Atur / Ubah Kata Sandi
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
            Atur sandi untuk login menggunakan email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-[10px] flex items-start gap-1.5 font-medium leading-relaxed">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-md text-[10px] flex items-start gap-1.5 font-medium leading-relaxed">
              <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
              <span>Kata sandi berhasil diperbarui!</span>
            </div>
          )}

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Kata Sandi Baru
            </label>
            <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus-within:border-zinc-400">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="flex-1 bg-transparent text-[11px] focus:outline-none text-zinc-800 placeholder-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer ml-1"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus-within:border-zinc-400">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="flex-1 bg-transparent text-[11px] focus:outline-none text-zinc-800 placeholder-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer ml-1"
              >
                {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <div className="pt-1.5">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-[#007F96] hover:bg-[#006678] text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={13} />
                  Menyimpan...
                </>
              ) : (
                "Simpan Sandi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
