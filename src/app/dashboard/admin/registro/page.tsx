"use client";

import { useState } from "react";
import { UserPlus, ArrowRight } from "lucide-react";
import { registrarAlumno } from "@/app/actions/usuarios";
import { useRouter } from "next/navigation";

export default function RegistroAlumnoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
        setSuccess(false);
        setLoading(false);
        router.push("/dashboard/admin/usuarios");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
          <UserPlus className="w-8 h-8 text-yellow-500" />
          <span>Crear Nuevo Usuario (Alumno)</span>
        </h1>
        <p className="text-zinc-400 mt-2">Registra a un nuevo alumno en la base de datos. Se le asignará una contraseña para que pueda ingresar al portal de alumnos.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-xl mb-6 flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>¡Alumno registrado con éxito en la base de datos! Redirigiendo...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Nombre Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
              placeholder="Ej. Carlos Rodríguez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Correo Electrónico</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
              placeholder="carlos@email.com"
            />
            <p className="text-xs text-zinc-500 mt-2">Este correo será su usuario para iniciar sesión.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Contraseña Inicial</label>
            <input
              type="text"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
            />
            <p className="text-xs text-zinc-500 mt-2">Debes darle esta contraseña al alumno para su primer ingreso.</p>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black uppercase tracking-wider py-4 rounded-xl mt-4 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Guardar en Base de Datos</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
