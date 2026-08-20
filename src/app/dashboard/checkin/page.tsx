"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { registerCheckIn } from "@/app/actions/checkin";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CheckInScannerPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Inicializar el escáner solo si estamos en estado idle
    if (status === "idle" && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          // Detener el escáner después de leer
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
          
          setStatus("loading");
          
          try {
            const result = await registerCheckIn(decodedText);
            setStatus("success");
            setMessage(result.message);
          } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Error al registrar asistencia");
          }
        },
        (error) => {
          // Ignorar errores de lectura constantes
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [status]);

  const handleSimulateScan = async () => {
    setStatus("loading");
    try {
      const result = await registerCheckIn("JPES-GYM-CHECKIN-V1");
      setStatus("success");
      setMessage(result.message);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Error al registrar asistencia");
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Registro de Asistencia</h1>
        <p className="text-zinc-400 mt-1">Escanea el código QR de la entrada del gimnasio.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
        
        {status === "idle" && (
          <>
            <div id="qr-reader" className="w-full bg-black rounded-lg overflow-hidden [&_video]:rounded-lg [&_video]:w-full mb-4"></div>
            <button 
              onClick={handleSimulateScan}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Simular Escaneo (Modo Desarrollo)</span>
            </button>
          </>
        )}

        {status === "loading" && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-zinc-700 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-medium">Procesando...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Asistencia Registrada!</h2>
            <p className="text-zinc-400 mb-6">{message}</p>
            <button 
              onClick={() => setStatus("idle")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Escanear otro
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-red-400 mb-6">{message}</p>
            <button 
              onClick={() => setStatus("idle")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
