"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Layers, Flame, PlayCircle, Info } from "lucide-react";
import VideoModalButton from "@/app/dashboard/VideoModalButton";

interface Ejercicio {
  id: string;
  dia_rutinaId: string;
  orden: number;
  tipo: string;
  nombre: string | null;
  video_url: string | null;
  series: number | null;
  rango_reps: string | null;
  rir: string | null;
  tempo: string | null;
  movimientos: string[];
  reps_por_movimiento: string[];
  series_texto: string | null;
  pesos: number | null;
}

interface DiaRutina {
  id: string;
  nombre_dia: string;
  orden: number;
  ejercicios: Ejercicio[];
}

interface Rutina {
  id: string;
  nombre: string;
  fecha_actualizacion: Date | string;
  dias: DiaRutina[];
}

export default function RoutineDashboard({ rutina }: { rutina: Rutina }) {
  const [activeDayId, setActiveDayId] = useState<string>("");

  // Obtener días ordenados
  const dias = rutina.dias || [];

  // Auto-seleccionar el día de la semana actual
  useEffect(() => {
    if (dias.length === 0) return;

    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = daysOfWeek[new Date().getDay()]; // ej. "Lunes", "Martes"

    // Buscar si hay algún día en la rutina que contenga el nombre del día de hoy
    const matchingDay = dias.find(d => 
      d.nombre_dia.toLowerCase().includes(todayName.toLowerCase())
    );

    if (matchingDay) {
      setActiveDayId(matchingDay.id);
    } else {
      // Si hoy es fin de semana o no está en la rutina, preseleccionar el primer día disponible
      setActiveDayId(dias[0].id);
    }
  }, [dias]);

  const activeDay = dias.find(d => d.id === activeDayId) || dias[0];

  // Letras para numeración de supersets (1a, 1b, etc.)
  const letters = ["a", "b", "c", "d", "e", "f"];

  return (
    <div className="space-y-6 pb-20">
      {/* Selector de pestañas por día */}
      {dias.length > 0 && (
        <div className="flex gap-2 border-b border-zinc-800 overflow-x-auto pb-3 scrollbar-none">
          {dias.map(dia => {
            const isActive = dia.id === activeDayId;
            // Extraer el nombre del día limpio para la pestaña (ej. "Lunes" de "Lunes - Torso completo")
            const displayTabName = dia.nombre_dia.split(" - ")[0];
            const displayTabSubtitle = dia.nombre_dia.split(" - ")[1] || "";

            return (
              <button
                key={dia.id}
                onClick={() => setActiveDayId(dia.id)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all text-left shrink-0 min-w-[120px] ${
                  isActive
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-md"
                    : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/40 hover:text-white"
                }`}
              >
                <span className="text-sm font-black uppercase tracking-wider">{displayTabName}</span>
                {displayTabSubtitle && (
                  <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[110px]">
                    {displayTabSubtitle}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Listado de ejercicios para el día seleccionado */}
      {activeDay && (
        <div className="space-y-4">
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-zinc-900/60 p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-yellow-500">
                {activeDay.nombre_dia}
              </h3>
              <span className="text-zinc-500 text-xs font-semibold">
                {activeDay.ejercicios.length} ejercicios
              </span>
            </div>

            <div className="p-4 space-y-4">
              {activeDay.ejercicios.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">
                  Día de descanso o sin ejercicios.
                </p>
              ) : (
                activeDay.ejercicios.map((ej, index) => {
                  const videoUrl = ej.video_url;
                  const hasVideo = !!videoUrl;
                  const exerciseTitle = ej.tipo === "superset" 
                    ? ej.movimientos.join(" + ")
                    : (ej.nombre || "");

                  return (
                    <div
                      key={ej.id}
                      className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:border-zinc-700/60"
                    >
                      <div className="flex-1 space-y-2 w-full">
                        {/* Tags para superset o drop set */}
                        {ej.tipo === "superset" && (
                          <div className="inline-flex items-center space-x-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1">
                            <Layers className="w-3 h-3" />
                            <span>SUPERSET · SIN DESCANSO ENTRE AMBOS</span>
                          </div>
                        )}
                        {ej.tipo === "drop_set" && (
                          <div className="inline-flex items-center space-x-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1">
                            <Flame className="w-3 h-3" />
                            <span>DROP SET</span>
                          </div>
                        )}

                        {/* Contenido principal de la tarjeta */}
                        {ej.tipo === "superset" ? (
                          <div className="space-y-1.5 pl-1 border-l-2 border-yellow-500/20 py-0.5">
                            {ej.movimientos.map((mov, mIdx) => (
                              <h4 key={mIdx} className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                                <span className="text-yellow-500 font-extrabold text-sm min-w-[20px] inline-block">
                                  1{letters[mIdx] || "a"}.
                                </span>
                                <span>{mov}</span>
                              </h4>
                            ))}
                          </div>
                        ) : (
                          <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                            <span>{ej.nombre}</span>
                          </h4>
                        )}

                        {/* Metadatos (Series, Reps, RIR, Tempo) */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm pt-1">
                          {ej.tipo === "drop_set" ? (
                            <>
                              <p className="text-zinc-400">
                                <span className="text-zinc-500 font-semibold mr-1">PESOS:</span>
                                <span className="text-white font-bold">{ej.pesos}</span>
                              </p>
                              {ej.series_texto && (
                                <p className="text-zinc-400">
                                  <span className="text-zinc-500 font-semibold mr-1">SERIES:</span>
                                  <span className="text-white font-bold">{ej.series_texto}</span>
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-zinc-400">
                                <span className="text-zinc-500 font-semibold mr-1">SERIES:</span>
                                <span className="text-white font-bold">
                                  {ej.tipo === "superset" ? (ej.series_texto || ej.series) : ej.series}
                                </span>
                              </p>
                              <p className="text-zinc-400">
                                <span className="text-zinc-500 font-semibold mr-1">REPS:</span>
                                <span className="text-white font-bold">
                                  {ej.tipo === "superset" 
                                    ? ej.reps_por_movimiento.join(" · ") 
                                    : ej.rango_reps}
                                </span>
                              </p>
                            </>
                          )}

                          {ej.rir && (
                            <p className="text-zinc-400">
                              <span className="text-zinc-500 font-semibold mr-1">RIR:</span>
                              <span className="text-white font-bold">{ej.rir}</span>
                            </p>
                          )}
                          {ej.tempo && (
                            <p className="text-zinc-400">
                              <span className="text-zinc-500 font-semibold mr-1">TEMPO:</span>
                              <span className="text-white font-bold">{ej.tempo}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botón de Video */}
                      <div className="shrink-0 pt-2 md:pt-0 w-full md:w-auto">
                        {hasVideo ? (
                          <VideoModalButton videoUrl={videoUrl} titulo={exerciseTitle} />
                        ) : (
                          <button
                            disabled
                            className="flex items-center justify-center space-x-1.5 bg-zinc-800/40 text-zinc-500 font-semibold px-3 py-1.5 rounded-lg text-sm cursor-not-allowed border border-zinc-800 w-full md:w-auto"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Video pendiente</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
