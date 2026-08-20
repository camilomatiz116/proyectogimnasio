"use client";

import { useState } from "react";
import { Dumbbell, User, ShieldCheck, ChevronRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleEntry = async (role: "admin" | "alumno") => {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1920&auto=format&fit=crop")' }}
      >
      </div>
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>

      {/* Main Content (Glassmorphism Card) */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-800/50 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col items-center">
          
          {/* Logo / Icon */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
              <Dumbbell className="text-zinc-950 w-10 h-10 transform -rotate-12" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 uppercase tracking-tighter mb-2 text-center">
            JPES GYM
          </h1>
          <p className="text-zinc-400 text-sm mb-10 text-center font-medium tracking-wide">
            Sistema de Gestión Integral
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            <button
              onClick={() => handleEntry("admin")}
              disabled={loading !== null}
              className="group relative w-full flex items-center justify-between bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-zinc-950 font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:transform-none"
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-lg">Acceso Administrador</span>
              </div>
              {loading === "admin" ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              )}
            </button>

            <button
              onClick={() => handleEntry("alumno")}
              disabled={loading !== null}
              className="group relative w-full flex items-center justify-between bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-md border border-zinc-700/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-lg">Acceso Alumno</span>
              </div>
              {loading === "alumno" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              )}
            </button>
          </div>
          
          {/* Footer note */}
          <p className="mt-8 text-xs text-zinc-500 text-center uppercase tracking-widest">
            V 1.0 • Software para Gimnasios
          </p>
        </div>
      </div>
    </div>
  );
}
