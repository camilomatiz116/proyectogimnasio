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

  return (
    <div className="max-w-4xl mx-auto">
      <BuilderClient rutina={rutina} plantillas={plantillas} usuarios={usuarios} />
    </div>
  );
}
