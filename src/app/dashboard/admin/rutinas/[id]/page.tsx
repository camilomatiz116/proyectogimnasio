import { getRutinaById } from "@/app/actions/rutinas";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const rutina = await getRutinaById(params.id);
  
  if (!rutina) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/admin/rutinas" className="text-zinc-500 hover:text-white flex items-center space-x-2 text-sm font-medium mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a rutinas</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">{rutina.nombre}</h1>
            <span className="text-xs font-semibold px-2 py-1 bg-zinc-800 text-zinc-300 rounded uppercase">v{rutina.version}</span>
          </div>
          <p className="text-zinc-400 mt-1 capitalize">{rutina.genero === "M" ? "Hombres" : rutina.genero === "F" ? "Mujeres" : "Unisex"} • {rutina.nivel}</p>
        </div>
      </div>

      <BuilderClient rutina={rutina} />
      
    </div>
  );
}
