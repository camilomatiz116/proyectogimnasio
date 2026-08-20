"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createRutina } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";

export default function CreateRutinaButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const rutina = await createRutina({
        nombre: "Nueva Rutina " + new Date().toLocaleDateString(),
        genero: "U", // Default
        nivel: "general", // Default
      });
      router.push(`/dashboard/admin/rutinas/${rutina.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la rutina");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-70"
    >
      <Plus className="w-5 h-5" />
      <span>{loading ? "Creando..." : "Nueva Rutina"}</span>
    </button>
  );
}
