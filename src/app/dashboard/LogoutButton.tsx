"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-500 hover:text-red-400 font-medium"
    >
      <LogOut className="w-5 h-5" />
      <span>Cerrar Sesión</span>
    </button>
  );
}
