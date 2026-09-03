import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Dumbbell, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import RoutineDashboard from "@/components/RoutineDashboard";

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

  // Serializar fechas para pasar al Client Component
  const rutinaSerializada = rutina ? {
    ...rutina,
    fecha_actualizacion: rutina.fecha_actualizacion.toISOString()
  } : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tu Rutina de Entrenamiento</h1>
          {rutina ? (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-base sm:text-lg font-bold text-yellow-500">
                {rutina.nombre}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                {rutina.genero === "M" ? "Hombres ♂" : rutina.genero === "F" ? "Mujeres ♀" : "Unisex ⚧"} · {rutina.nivel || user.nivel || "General"}
              </span>
            </div>
          ) : (
            <p className="text-zinc-400 mt-1">Nivel: <span className="capitalize text-yellow-500 font-semibold">{user.nivel || "Sin definir"}</span></p>
          )}
        </div>
        <div className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3 max-w-sm">
          <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-zinc-400 leading-relaxed">
            Asegúrate de registrar tu peso y medidas en tu perfil mensualmente para un mejor seguimiento.
          </p>
        </div>
      </div>

      {!rutina || !rutinaSerializada ? (
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
        <RoutineDashboard rutina={rutinaSerializada as any} />
      )}
    </div>
  );
}
