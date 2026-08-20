"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { getOrCreateUserRoutine } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";

export default function BuildRoutineButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rutinaId = await getOrCreateUserRoutine(userId);
      router.push(`/dashboard/admin/rutinas/${rutinaId}`);
    } catch (error) {
      console.error(error);
      alert("Error al cargar la rutina");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-70 text-sm"
    >
      <Dumbbell className="w-4 h-4" />
      <span>{loading ? "Cargando..." : "Armar Rutina"}</span>
    </button>
  );
}
