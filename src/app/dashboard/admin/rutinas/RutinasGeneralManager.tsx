"use client";

import { useState } from "react";
import { Users, BookOpen, User, Calendar, Plus, Award } from "lucide-react";
import UserListClient from "./UserListClient";
import CreateRutinaModal from "./CreateRutinaModal";
import DeleteRutinaButton from "./DeleteRutinaButton";
import Link from "next/link";

interface RutinasGeneralManagerProps {
  usuarios: any[];
  plantillas: any[];
}

export default function RutinasGeneralManager({ usuarios, plantillas }: RutinasGeneralManagerProps) {
  const [activeTab, setActiveTab] = useState<"alumnos" | "plantillas">("alumnos");

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
    <div className="space-y-6">
      {/* Selector de pestañas */}
      <div className="flex border-b border-zinc-800 gap-2">
        <button
          onClick={() => setActiveTab("alumnos")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-bold transition-all ${
            activeTab === "alumnos"
              ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rutinas de Alumnos</span>
        </button>
        <button
          onClick={() => setActiveTab("plantillas")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-bold transition-all ${
            activeTab === "plantillas"
              ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Rutinas Generales (Plantillas)</span>
        </button>
      </div>

      {activeTab === "alumnos" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Seguimiento de Alumnos</h2>
              <p className="text-zinc-400 text-sm">Personaliza o visualiza la rutina de cada miembro.</p>
            </div>
          </div>
          <UserListClient usuarios={usuarios} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Librería de Plantillas Generales</h2>
              <p className="text-zinc-400 text-sm">Rutinas globales cargables a cualquier alumno.</p>
            </div>
            <div className="flex gap-2">
              <CreateRutinaModal />
            </div>
          </div>

          {plantillas.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No hay rutinas generales</h3>
              <p className="text-zinc-400 mb-6">Crea tu primera plantilla de Hombres o Mujeres para empezar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantillas.map((plantilla) => (
                <div
                  key={plantilla.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2 truncate" title={plantilla.nombre}>
                      {plantilla.nombre}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getGenderColor(plantilla.genero)}`}>
                        {getGenderLabel(plantilla.genero)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                        {plantilla.nivel}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-zinc-400 mb-6">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>{plantilla._count.dias} días configurados</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-500" />
                        <span>{plantilla._count.usuarios} alumnos usándola</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 mt-auto gap-2">
                    <Link
                      href={`/dashboard/admin/rutinas/${plantilla.id}`}
                      className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
                    >
                      Editar Ejercicios
                    </Link>
                    <DeleteRutinaButton rutinaId={plantilla.id} rutinaNombre={plantilla.nombre} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
