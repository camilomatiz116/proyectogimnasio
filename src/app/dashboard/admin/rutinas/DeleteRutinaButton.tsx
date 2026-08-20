"use client";

import { Trash2 } from "lucide-react";
import { deleteRutina } from "@/app/actions/rutinas";
import { useTransition } from "react";

export default function DeleteRutinaButton({ rutinaId, rutinaNombre }: { rutinaId: string, rutinaNombre: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the Link
    e.stopPropagation();

    if (confirm(`¿Estás seguro de que quieres eliminar la rutina "${rutinaNombre}"? Esta acción no se puede deshacer y los alumnos asignados se quedarán sin rutina.`)) {
      startTransition(async () => {
        try {
          await deleteRutina(rutinaId);
        } catch (error) {
          alert("Error al eliminar la rutina");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-950/30 rounded-lg transition-colors absolute top-3 right-3 z-10"
      title="Eliminar rutina"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
