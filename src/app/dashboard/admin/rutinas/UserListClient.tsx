"use client";

import { useState } from "react";
import { Users, User, Search } from "lucide-react";
import BuildRoutineButton from "./BuildRoutineButton";

export default function UserListClient({ usuarios }: { usuarios: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usuarios.filter((user) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar alumno por nombre o correo..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No se encontraron alumnos</h2>
          <p className="text-zinc-400 mb-6">
            {usuarios.length === 0 
              ? "Debes crear usuarios en la pestaña 'Usuarios y Pagos' primero." 
              : "No hay alumnos que coincidan con tu búsqueda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500 transition-colors block relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-lg text-white truncate">{user.name}</h3>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${user.rutinaId ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="truncate">{user.rutinaId ? 'Rutina Asignada' : 'Sin Rutina'}</span>
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
