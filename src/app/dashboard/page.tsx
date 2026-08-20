import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Dumbbell, Info, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userSession = session?.user as any;

  // Cargar el usuario completo con su rutina
  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    include: {
      rutina: {
        include: {
          dias: {
            orderBy: { orden: "asc" },
            include: {
              ejercicios: {
                orderBy: { orden: "asc" }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  const rutina = user.rutina;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tu Rutina de Entrenamiento</h1>
          <p className="text-zinc-400 mt-1">Nivel: <span className="capitalize text-yellow-500 font-semibold">{user.nivel || "Sin definir"}</span></p>
        </div>
        <div className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3 max-w-sm">
          <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-zinc-400 leading-relaxed">
            Asegúrate de registrar tu peso y medidas en tu perfil mensualmente para un mejor seguimiento.
          </p>
        </div>
      </div>

      {!rutina ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mb-6">
            <Dumbbell className="text-zinc-600 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No tienes rutinas asignadas aún</h2>
          <p className="text-zinc-400 max-w-md">
            Habla con tu instructor para que te asigne una rutina adecuada a tu nivel y objetivos.
          </p>
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-1">{rutina.nombre}</h2>
            <p className="text-zinc-400 text-sm">Actualizada el {rutina.fecha_actualizacion.toLocaleDateString()}</p>
          </div>

          {rutina.dias.map(dia => (
            <div key={dia.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="bg-zinc-900 p-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-yellow-500">{dia.nombre_dia}</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {dia.ejercicios.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">Día de descanso o sin ejercicios.</p>
                ) : (
                  dia.ejercicios.map(ej => (
                    <div key={ej.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                          {ej.nombre}
                          {ej.video_url && (
                            <a href={ej.video_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors" title="Ver video técnica">
                              <PlayCircle className="w-5 h-5" />
                            </a>
                          )}
                        </h4>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
                          <p className="text-zinc-400"><span className="text-zinc-500 font-semibold mr-1">SERIES:</span> <span className="text-white font-bold">{ej.series}</span></p>
                          <p className="text-zinc-400"><span className="text-zinc-500 font-semibold mr-1">REPS:</span> <span className="text-white font-bold">{ej.rango_reps}</span></p>
                          {ej.rir && <p className="text-zinc-400"><span className="text-zinc-500 font-semibold mr-1">RIR:</span> <span className="text-white font-bold">{ej.rir}</span></p>}
                          {ej.tempo && <p className="text-zinc-400"><span className="text-zinc-500 font-semibold mr-1">TEMPO:</span> <span className="text-white font-bold">{ej.tempo}</span></p>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
