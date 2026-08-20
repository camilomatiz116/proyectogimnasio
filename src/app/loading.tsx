import { Dumbbell } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-lg relative z-10">
          <Dumbbell className="text-yellow-500 w-10 h-10 transform animate-spin" style={{ animationDuration: '2s' }} />
        </div>
      </div>
      <p className="text-zinc-500 font-medium animate-pulse uppercase tracking-widest">Cargando...</p>
    </div>
  );
}
