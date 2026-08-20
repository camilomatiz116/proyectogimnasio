import { getUsuariosFinanzas } from "@/app/actions/pagos";
import { CheckCircle2, AlertCircle, Banknote, QrCode } from "lucide-react";
import QrCobroModal from "./QrCobroModal";
import NuevoAlumnoModal from "./NuevoAlumnoModal";

export default async function UsuariosFinanzasPage() {
  const usuarios = await getUsuariosFinanzas();
  const hoy = new Date();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Usuarios y Finanzas</h1>
          <p className="text-zinc-400 mt-1">Control de pagos, membresías y cobros en efectivo.</p>
        </div>
        <NuevoAlumnoModal />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Alumno</th>
                <th className="p-4 font-semibold">Estado de Membresía</th>
                <th className="p-4 font-semibold">Vencimiento</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {usuarios.map(u => {
                const isVencido = !u.fecha_vencimiento_membresia || new Date(u.fecha_vencimiento_membresia) < hoy;
                const diasRestantes = u.fecha_vencimiento_membresia 
                  ? Math.ceil((new Date(u.fecha_vencimiento_membresia).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                  : 0;

                return (
                  <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-sm text-zinc-500">{u.email}</p>
                    </td>
                    <td className="p-4">
                      {isVencido ? (
                        <div className="inline-flex items-center space-x-2 bg-red-950/50 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-900">
                          <AlertCircle className="w-4 h-4" />
                          <span>Vencido / Debe</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-2 bg-green-950/50 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-900">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Al Día ({diasRestantes} días)</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-zinc-300">
                      {u.fecha_vencimiento_membresia 
                        ? new Date(u.fecha_vencimiento_membresia).toLocaleDateString()
                        : "Nunca ha pagado"}
                    </td>
                    <td className="p-4 text-right">
                      <QrCobroModal usuarioId={u.id} nombre={u.name || "Alumno"} />
                    </td>
                  </tr>
                );
              })}
              
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    No hay alumnos registrados.
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
