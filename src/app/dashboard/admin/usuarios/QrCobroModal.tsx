"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, X, CheckCircle2 } from "lucide-react";
import { registrarPagoEfectivo } from "@/app/actions/pagos";
import { useRouter } from "next/navigation";

export default function QrCobroModal({ usuarioId, nombre }: { usuarioId: string, nombre: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Este QR en la vida real llevaría a la pasarela de Wompi o a un endpoint seguro
      // Por ahora, es un QR simulado de cobro en efectivo
      QRCode.toDataURL(`PAGO-EFECTIVO-${usuarioId}`, {
        width: 250,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" }
      }).then(setQrUrl);
    }
  }, [isOpen, usuarioId]);

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await registrarPagoEfectivo(usuarioId);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        router.refresh();
      }, 2000);
    } catch (e) {
      alert("Error al registrar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
        title="Cobrar en Efectivo (Generar QR)"
      >
        <QrCode className="w-5 h-5 text-yellow-500" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 text-center p-6">
            {!success ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Cobro en Efectivo</h2>
                  <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-zinc-400 text-sm mb-6">
                  Pídele a <strong className="text-white">{nombre}</strong> que escanee este código para registrar su pago, o confírmalo manualmente si ya recibiste el dinero.
                </p>

                <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mx-auto mb-6">
                  {qrUrl ? (
                    <img src={qrUrl} alt="QR de Pago" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-zinc-100 flex items-center justify-center">Cargando...</div>
                  )}
                </div>

                <button 
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{loading ? "Procesando..." : "Confirmar Recepción de Efectivo"}</span>
                </button>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-950" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Pago Exitoso!</h2>
                <p className="text-green-400">Se han sumado 30 días de membresía.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
