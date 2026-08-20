"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dumbbell } from "lucide-react";

export default function GymQRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Generate QR code for the static string
    QRCode.toDataURL("JPES-GYM-CHECKIN-V1", {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }).then(setQrCodeUrl);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center max-w-lg w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
            <Dumbbell className="text-zinc-950 w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">JPES GYM</h1>
        <p className="text-zinc-400 text-lg mb-10">Punto de Control de Asistencia</p>

        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto mb-8">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code de Asistencia" className="w-64 h-64 md:w-80 md:h-80" />
          ) : (
            <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-zinc-100 rounded-xl">
              <span className="text-zinc-400">Generando...</span>
            </div>
          )}
        </div>

        <p className="text-yellow-500 font-medium">Abre tu app JPES GYM y escanea este código para registrar tu asistencia de hoy.</p>
      </div>
    </div>
  );
}
