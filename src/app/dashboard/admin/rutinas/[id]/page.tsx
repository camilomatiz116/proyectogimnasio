import { getRutinaById, getPlantillas, getAllUsers } from "@/app/actions/rutinas";
import { notFound } from "next/navigation";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rutina = await getRutinaById(id);
  
  if (!rutina) {
    notFound();
  }

  const plantillas = rutina.es_plantilla ? [] : await getPlantillas();
  const usuarios = await getAllUsers();

  // Serializar fechas para pasar al Client Component
  const rutinaSerializada = {
    ...rutina,
    fecha_actualizacion: rutina.fecha_actualizacion.toISOString()
  };

  const plantillasSerializadas = plantillas.map(p => ({
    ...p,
    fecha_actualizacion: p.fecha_actualizacion.toISOString()
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <BuilderClient rutina={rutinaSerializada} plantillas={plantillasSerializadas} usuarios={usuarios} />
    </div>
  );
}
