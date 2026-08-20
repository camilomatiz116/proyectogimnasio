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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/admin/rutinas" className="text-zinc-500 hover:text-white flex items-center space-x-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a rutinas</span>
          </Link>
        </div>
      </div>

      <BuilderClient rutina={rutina} />
      
    </div>
  );
}
