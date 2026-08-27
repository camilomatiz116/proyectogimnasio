"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { cargarPlantillaEnRutina } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";

interface LoadTemplateModalProps {
  plantillas: any[];
  rutinaDestinoId: string;
  tieneEjercicios?: boolean;
}

export default function LoadTemplateModal({ plantillas, rutinaDestinoId, tieneEjercicios = false }: LoadTemplateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleLoad = async (plantillaId: string, plantillaNombre: string) => {
    if (tieneEjercicios) {
      if (!confirm(`¡Atención! Este alumno ya tiene ejercicios cargados en su rutina. ¿Estás seguro de que deseas cargar la plantilla "${plantillaNombre}"? Esto borrará y reemplazará permanentemente todos sus ejercicios actuales.`)) {
        return;
      }
    }

    setLoading(plantillaId);
    try {
      const res = await cargarPlantillaEnRutina(plantillaId, rutinaDestinoId);
      if (res.success) {
        alert("Plantilla cargada con éxito.");
        setIsOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Error al cargar la plantilla.");
    } finally {
      setLoading(null);
    }
  };

  const getGenderLabel = (g: string) => {
    switch (g) {
      case "M": return "Hombres ♂";
      case "F": return "Mujeres ♀";
      default: return "Unisex ⚧";
    }
  };

  const getGenderColor = (g: string) => {
    switch (g) {
      case "M": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "F": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      default: return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 shrink-0"
      >
        <BookOpen className="w-5 h-5" />
        <span>Asignar Rutina Predeterminada</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-yellow-500" />
                <span>Asignar Rutina Predeterminada</span>
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-zinc-400 text-sm mb-4">
                Elige una de las rutinas generales predeterminadas creadas en el sistema para clonarla en el perfil de este alumno.
              </p>

              {plantillas.length === 0 ? (
                <p className="text-center text-zinc-500 py-6">No hay rutinas predeterminadas creadas.</p>
              ) : (
                <div className="space-y-3">
                  {plantillas.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-base truncate">{p.nombre}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getGenderColor(p.genero)}`}>
                            {getGenderLabel(p.genero)}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                            {p.nivel}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLoad(p.id, p.nombre)}
                        disabled={loading !== null}
                        className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50"
                      >
                        {loading === p.id ? "Cargando..." : "Asignar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
