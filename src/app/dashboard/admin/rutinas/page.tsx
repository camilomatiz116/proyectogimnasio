import { getAllUsers } from "@/app/actions/rutinas";
import UserListClient from "./UserListClient";

export default async function AdminRutinasPage() {
  const usuarios = await getAllUsers();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Rutinas</h1>
          <p className="text-zinc-400 mt-1">Busca y selecciona un alumno para armar o editar su rutina.</p>
        </div>
      </div>

      <UserListClient usuarios={usuarios} />
    </div>
  );
}
