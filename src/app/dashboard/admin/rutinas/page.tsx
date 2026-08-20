import { getAllUsers } from "@/app/actions/rutinas";
import { Users, User, ArrowRight } from "lucide-react";
import BuildRoutineButton from "./BuildRoutineButton";

export default async function AdminRutinasPage() {
  const usuarios = await getAllUsers();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Rutinas</h1>
          <p className="text-zinc-400 mt-1">Selecciona un alumno para armar o editar su rutina.</p>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No hay alumnos registrados</h2>
          <p className="text-zinc-400 mb-6">Debes crear usuarios en la pestaña "Usuarios y Pagos" primero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map(user => (
            <div 
              key={user.id} 
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500 transition-colors block relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white truncate max-w-[150px]">{user.name}</h3>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                  <span className={`w-2 h-2 rounded-full ${user.rutinaId ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>{user.rutinaId ? 'Rutina Asignada' : 'Sin Rutina'}</span>
                </div>
                <BuildRoutineButton userId={user.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
