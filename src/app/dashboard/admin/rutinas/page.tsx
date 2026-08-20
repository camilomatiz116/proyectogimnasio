import { getRutinas, getAllUsers } from "@/app/actions/rutinas";
import Link from "next/link";
import { Plus, Users, ArrowRight } from "lucide-react";
import CreateRutinaModal from "./CreateRutinaModal";
import AssignRutinaModal from "./AssignRutinaModal";
import DeleteRutinaButton from "./DeleteRutinaButton";

export default async function AdminRutinasPage() {
  const rutinas = await getRutinas();
  const usuarios = await getAllUsers();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Rutinas</h1>
          <p className="text-zinc-400 mt-1">Crea, edita y asigna rutinas a los alumnos del gimnasio.</p>
        </div>
        <div className="flex space-x-3">
          <AssignRutinaModal rutinas={rutinas} usuarios={usuarios} />
          <CreateRutinaModal />
        </div>
      </div>

      {rutinas.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No hay rutinas creadas</h2>
          <p className="text-zinc-400 mb-6">Comienza creando tu primera rutina de entrenamiento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rutinas.map(rutina => (
            <Link 
              key={rutina.id} 
              href={`/dashboard/admin/rutinas/${rutina.id}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500 transition-colors block relative overflow-hidden"
            >
              <DeleteRutinaButton rutinaId={rutina.id} rutinaNombre={rutina.nombre} />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-white truncate pr-8">{rutina.nombre}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-zinc-800 text-zinc-300 rounded uppercase mt-1">
                  v{rutina.version}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-sm">
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Nivel</p>
                  <p className="text-zinc-300 capitalize">{rutina.nivel}</p>
                </div>
                <div className="text-sm">
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Género</p>
                  <p className="text-zinc-300 capitalize">{rutina.genero === "M" ? "Hombres" : rutina.genero === "F" ? "Mujeres" : "Unisex"}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{rutina._count.usuarios} asignados</span>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
