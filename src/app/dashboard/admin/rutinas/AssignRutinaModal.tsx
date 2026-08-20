"use client";

import { useState } from "react";
import { Link2, X } from "lucide-react";
import { assignRutina } from "@/app/actions/rutinas";

export default function AssignRutinaModal({ rutinas, usuarios }: { rutinas: any[], usuarios: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const usuarioId = formData.get("usuarioId") as string;
    const rutinaId = formData.get("rutinaId") as string;
    
    try {
      await assignRutina(usuarioId, rutinaId === "none" ? null : rutinaId);
      setIsOpen(false);
      alert("Rutina asignada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al asignar la rutina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 border border-zinc-700"
      >
        <Link2 className="w-5 h-5" />
        <span className="hidden sm:inline">Asignar Rutina</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Asignar a Alumno</h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Seleccionar Alumno</label>
                <select name="usuarioId" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500">
                  <option value="">Selecciona un alumno...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email} ({u.nivel || 'Sin nivel'} - {u.genero || 'Sin género'}) 
                      {u.rutinaId ? " - [Ya tiene rutina]" : ""}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Seleccionar Rutina</label>
                <select name="rutinaId" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500">
                  <option value="none">-- Quitar rutina actual --</option>
                  {rutinas.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({r.nivel} - {r.genero})
                    </option>
                  ))}
                </select>
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
                  {loading ? "Asignando..." : "Asignar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
