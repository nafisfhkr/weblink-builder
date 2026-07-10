"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
    >
      <LogOut size={16} />
      Keluar
    </button>
  );
}
