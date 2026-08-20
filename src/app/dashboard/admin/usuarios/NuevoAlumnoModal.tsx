"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { registrarAlumno } from "@/app/actions/usuarios";

export default function NuevoAlumnoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await registrarAlumno(formData);

    if (!res.success) {
      setError(res.error || "Ocurrió un error");
      setLoading(false);
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold px-4 py-2 rounded-lg transition-colors"
      >
        <UserPlus className="w-5 h-5" />
        <span>Registrar Alumno</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Nuevo Alumno</h2>
            <p className="text-zinc-400 text-sm mb-6">Ingresa los datos para registrar un nuevo alumno en el sistema.</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 text-sm p-3 rounded-lg mb-4">
                Alumno registrado con éxito.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="juan@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Contraseña Inicial</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
                <p className="text-xs text-zinc-500 mt-1">El alumno usará esta contraseña para iniciar sesión.</p>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-3 rounded-lg mt-6 disabled:opacity-50 transition-colors"
              >
                {loading ? "Registrando..." : "Registrar Alumno"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
