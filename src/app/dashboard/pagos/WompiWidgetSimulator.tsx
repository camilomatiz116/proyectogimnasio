"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { registrarPagoEfectivo } from "@/app/actions/pagos";
import { useRouter } from "next/navigation";

export default function WompiWidgetSimulator({ usuarioId }: { usuarioId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSimularPago = async () => {
    setLoading(true);
    try {
      // Usamos la misma función de efectivo para simular que pagó por Wompi y sumar 30 días
      await registrarPagoEfectivo(usuarioId);
      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (e) {
      alert("Error al procesar pago");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-950/40 border border-green-900 rounded-xl p-4 flex flex-col items-center animate-in fade-in zoom-in">
        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
        <p className="text-green-400 font-bold">¡Pago Aprobado!</p>
        <p className="text-xs text-green-500/70">Ref: WOMPI-{Math.floor(Math.random() * 100000)}</p>
      </div>
    );
  }

  return (
    <button 
      onClick={handleSimularPago}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
    >
      {loading ? "Conectando con Wompi..." : "Simular Pago ($80.000)"}
    </button>
  );
}
