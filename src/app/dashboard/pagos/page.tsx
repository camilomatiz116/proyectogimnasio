import { getMembresiaAlumno } from "@/app/actions/pagos";
import { CheckCircle2, AlertTriangle, Calendar, CreditCard } from "lucide-react";
import WompiWidgetSimulator from "./WompiWidgetSimulator";

export default async function PagosAlumnoPage() {
  const info = await getMembresiaAlumno();
  if (!info) return null;

  const hoy = new Date();
  const vencimiento = info.fecha_vencimiento_membresia ? new Date(info.fecha_vencimiento_membresia) : null;
  const isVencido = !vencimiento || vencimiento < hoy;
  
  const diasRestantes = vencimiento 
    ? Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Mi Membresía</h1>
        <p className="text-zinc-400 mt-1">Controla tus pagos y días restantes de gimnasio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado Actual */}
        <div className={`p-8 rounded-3xl border ${isVencido ? 'bg-red-950/20 border-red-900' : 'bg-zinc-900 border-zinc-800'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar className="w-32 h-32" />
          </div>
          
          <h2 className="text-zinc-400 font-semibold uppercase tracking-wider text-sm mb-4">Estado Actual</h2>
          
          {isVencido ? (
            <div>
              <div className="flex items-center space-x-3 text-red-500 mb-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-3xl font-black tracking-tight">VENCIDA</span>
              </div>
              <p className="text-red-400/80">Tu membresía ha caducado. Realiza el pago para poder ingresar y ver tus rutinas.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-3 text-green-500 mb-2">
                <CheckCircle2 className="w-8 h-8" />
                <span className="text-3xl font-black tracking-tight">AL DÍA</span>
              </div>
              <p className="text-white text-4xl font-bold mt-4">{diasRestantes} <span className="text-lg text-zinc-400 font-normal">días restantes</span></p>
              <p className="text-zinc-500 mt-2 text-sm">Vence el {vencimiento.toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Pasarela de Pagos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-800">
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Renovar con Wompi</h2>
          <p className="text-zinc-400 text-sm mb-6 px-4">
            Paga rápido y seguro con Nequi, Daviplata, Bancolombia, PSE o Tarjeta de Crédito.
          </p>
          
          <WompiWidgetSimulator usuarioId={info.id} />
        </div>
      </div>

      {/* Historial */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">Últimos Pagos</h3>
        {info.pagos.length === 0 ? (
          <p className="text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl p-4">No tienes pagos registrados aún.</p>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Periodo</th>
                  <th className="p-4">Referencia</th>
                  <th className="p-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {info.pagos.map(pago => (
                  <tr key={pago.id} className="text-sm">
                    <td className="p-4 text-white">{pago.fecha_pago?.toLocaleDateString() || "Pendiente"}</td>
                    <td className="p-4 text-zinc-400">{pago.periodo}</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">{pago.referencia_wompi || "Efectivo"}</td>
                    <td className="p-4 text-right text-green-400 font-medium">${pago.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
