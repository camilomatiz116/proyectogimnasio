import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, User, Calendar, QrCode } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.rol === "admin";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
        <div className="mb-8 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Bienvenido</p>
          <p className="font-semibold text-yellow-500 truncate">{user.name}</p>
          <p className="text-xs text-zinc-400 capitalize">{user.rol}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {!isAdmin && (
            <>
              <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <span>Mi Rutina</span>
              </Link>
              <Link href="/dashboard/pagos" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <QrCode className="w-5 h-5 text-yellow-500" />
                <span>Mi Membresía</span>
              </Link>
              <Link href="/dashboard/checkin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <QrCode className="w-5 h-5 text-yellow-500" />
                <span>Check-in QR</span>
              </Link>
            </>
          )}
          <Link href="/dashboard/perfil" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <User className="w-5 h-5 text-yellow-500" />
            <span>Mi Perfil</span>
          </Link>
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2 px-3">Administración</p>
              <Link href="/dashboard/admin/rutinas" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span>Gestionar Rutinas</span>
              </Link>
              <Link href="/dashboard/admin/usuarios" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <User className="w-5 h-5 text-zinc-400" />
                <span>Usuarios y Pagos</span>
              </Link>
              <Link href="/dashboard/admin/asistencia" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
                <QrCode className="w-5 h-5 text-zinc-400" />
                <span>Registro de Asistencia</span>
              </Link>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
