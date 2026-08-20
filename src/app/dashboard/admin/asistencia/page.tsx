import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminAsistenciaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).rol !== "admin") {
    redirect("/login");
  }

  const checkIns = await prisma.checkIn.findMany({
    include: { usuario: true },
    orderBy: { fecha_hora: "desc" },
    take: 50
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Registro de Asistencia</h1>
        <p className="text-zinc-400 mt-1">Últimos ingresos de alumnos al gimnasio.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Alumno</th>
                <th className="p-4 font-semibold">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {checkIns.map(c => (
                <tr key={c.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 text-zinc-300">
                    {new Date(c.fecha_hora).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white flex items-center space-x-2">
                      <span>{c.usuario?.name || c.usuario?.email}</span>
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center space-x-1 bg-green-950/50 text-green-400 px-2 py-1 rounded text-xs font-medium border border-green-900">
                      <CheckCircle className="w-3 h-3" />
                      <span className="uppercase">{c.metodo}</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {checkIns.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-zinc-500">
                    No hay registros de asistencia aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
