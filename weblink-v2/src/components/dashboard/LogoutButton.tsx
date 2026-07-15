"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-2xs cursor-pointer"
    >
      <LogOut size={14} />
      Keluar
    </button>
  );
}
