"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createRutina } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";

export default function CreateRutinaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const rutina = await createRutina({
        nombre: formData.get("nombre") as string,
        genero: formData.get("genero") as string,
        nivel: formData.get("nivel") as string,
      });
      setIsOpen(false);
      router.push(`/dashboard/admin/rutinas/${rutina.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la rutina");
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Nueva Rutina</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Crear Rutina</h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nombre descriptivo</label>
                <input 
                  required
                  name="nombre"
                  placeholder="Ej: Hipertrofia 4 Días"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Género Objetivo</label>
                  <select name="genero" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500">
                    <option value="U">Unisex (Ambos)</option>
                    <option value="M">Hombres</option>
                    <option value="F">Mujeres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nivel Objetivo</label>
                  <select name="nivel" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500">
                    <option value="novato">Novato</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="modificado">Modificado (Lesión)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
                >
                  {loading ? "Creando..." : "Crear y Continuar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
