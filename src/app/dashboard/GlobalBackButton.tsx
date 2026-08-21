"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // No mostrar el botón en la página principal del dashboard
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 py-2 px-3 rounded-lg w-fit border border-zinc-800/50"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Volver atrás</span>
    </button>
  );
}
