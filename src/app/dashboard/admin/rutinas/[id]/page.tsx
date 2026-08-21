import { getRutinaById } from "@/app/actions/rutinas";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rutina = await getRutinaById(id);
  
  if (!rutina) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-2">
        {/* Espacio preservado si se requiere título o acciones extra aquí en el futuro */}
      </div>

      <BuilderClient rutina={rutina} />
      
    </div>
  );
}
