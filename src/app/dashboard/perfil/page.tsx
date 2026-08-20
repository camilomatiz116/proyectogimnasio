import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/actions/profile";
import { Save } from "lucide-react";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const userSession = session?.user as any;

  const user = await prisma.user.findUnique({
    where: { id: userSession.id }
  });

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Mi Perfil</h1>
        <p className="text-zinc-400 mt-1">Actualiza tus datos para personalizar tu entrenamiento.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <form action={updateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre Completo</label>
              <input
                type="text"
                defaultValue={user.name || ""}
                disabled
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Correo</label>
              <input
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                defaultValue={user.telefono || ""}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Género</label>
              <select
                name="genero"
                defaultValue={user.genero || ""}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="U">Otro / Prefiero no decir</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Edad</label>
              <input
                type="number"
                name="edad"
                defaultValue={user.edad || ""}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Altura (cm)</label>
              <input
                type="number"
                step="0.01"
                name="altura"
                defaultValue={user.altura || ""}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Grupo Sanguíneo (RH)</label>
              <input
                type="text"
                name="grupo_rh"
                defaultValue={user.grupo_rh || ""}
                placeholder="Ej. O+"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nivel de Entrenamiento</label>
              <select
                name="nivel"
                defaultValue={user.nivel || ""}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="novato">Novato</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="modificado">Modificado / Terapia</option>
              </select>
            </div>

          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
