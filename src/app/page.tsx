"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dumbbell, User, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Generate a test QR code (This is the one that goes in the Gym Reception)
    QRCode.toDataURL("JPES-GYM-CHECKIN-V1", {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }).then(setQrCodeUrl);
  }, []);

  const handleSimulatedEntry = async (role: "admin" | "alumno") => {
    setLoading(role);
    const email = role === "admin" ? "admin@jpesgym.com" : "alumno@jpesgym.com"; 
    const password = role === "admin" ? "admin123" : "alumno123";
    
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <Dumbbell className="text-zinc-950 w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">JPES GYM</h1>
        <p className="text-zinc-400 text-sm mb-8">Recepción del Gimnasio (Código QR)</p>

        <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mx-auto mb-8">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR de Prueba" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 bg-zinc-100 rounded-xl flex items-center justify-center">
              <span className="text-zinc-400">Cargando QR...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-500 mb-6 px-4">
          *Este QR es el que estará pegado en la recepción para que los alumnos lo escaneen.*
        </p>

        <hr className="border-zinc-800 mb-6" />

        <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Simular App (Pruebas)</h2>
        <div className="space-y-3 flex flex-col">
          <button
            onClick={() => handleSimulatedEntry("alumno")}
            disabled={loading !== null}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>{loading === "alumno" ? "Cargando..." : "Entrar como ALUMNO"}</span>
          </button>

          <button
            onClick={() => handleSimulatedEntry("admin")}
            disabled={loading !== null}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{loading === "admin" ? "Cargando..." : "Entrar como ADMINISTRADOR"}</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}
