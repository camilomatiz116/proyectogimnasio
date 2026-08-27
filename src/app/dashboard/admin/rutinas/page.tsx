import { getAllUsers, getPlantillas } from "@/app/actions/rutinas";
import RutinasGeneralManager from "./RutinasGeneralManager";

export default async function AdminRutinasPage() {
  const usuarios = await getAllUsers();
  const plantillas = await getPlantillas();

  // Serializar fechas para pasar de Server Component a Client Component de forma segura
  const plantillasSerializadas = plantillas.map(p => ({
    ...p,
    fecha_actualizacion: p.fecha_actualizacion.toISOString()
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Rutinas</h1>
          <p className="text-zinc-400 mt-1">Administra las rutinas generales o edita la rutina de cada alumno.</p>
        </div>
      </div>

      <RutinasGeneralManager usuarios={usuarios} plantillas={plantillasSerializadas} />
    </div>
  );
}
