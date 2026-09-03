"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, PlayCircle, Trash2, Edit, Plus, AlertCircle, BookOpen } from "lucide-react";
import { addEjercicioToDia, reorderEjercicios, updateRutinaName, deleteRutina, deleteEjercicio, cargarPlantillaEnRutina } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";
import AssignCurrentRutinaModal from "./AssignCurrentRutinaModal";
import LoadTemplateModal from "./LoadTemplateModal";

export default function BuilderClient({ rutina, plantillas = [], usuarios = [] }: { rutina: any, plantillas?: any[], usuarios?: any[] }) {
  const router = useRouter();
  const [dias, setDias] = useState(rutina.dias || []);
  const [rutinaNombre, setRutinaNombre] = useState(rutina.nombre);
  const [isSavingName, setIsSavingName] = useState(false);
  const [localVideos, setLocalVideos] = useState<string[]>([]);
  
  // Track selected video per day
  const [selectedVideos, setSelectedVideos] = useState<Record<string, string>>({});
  const [isAddingToDia, setIsAddingToDia] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<string | null>(null);

  // Sincronizar estado cuando Next.js refresca la rutina desde el servidor
  useEffect(() => {
    setDias(rutina.dias || []);
    setRutinaNombre(rutina.nombre);
  }, [rutina]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setLocalVideos(data.videos || []))
      .catch(console.error);
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceDiaId = result.source.droppableId;
    const destDiaId = result.destination.droppableId;
    
    if (sourceDiaId !== destDiaId) {
      alert("No se puede mover entre días todavía.");
      return;
    }

    const diaIndex = dias.findIndex((d: any) => d.id === sourceDiaId);
    if (diaIndex === -1) return;

    const newDias = [...dias];
    const ejercicios = [...newDias[diaIndex].ejercicios];
    
    const [movedItem] = ejercicios.splice(result.source.index, 1);
    ejercicios.splice(result.destination.index, 0, movedItem);
    
    newDias[diaIndex].ejercicios = ejercicios;
    setDias(newDias);

    try {
      await reorderEjercicios(sourceDiaId, ejercicios.map(e => e.id));
    } catch (e) {
      alert("Error al guardar el nuevo orden");
      router.refresh();
    }
  };

  const handleUpdateName = async () => {
    if (rutinaNombre.trim() === "" || rutinaNombre === rutina.nombre) return;
    setIsSavingName(true);
    try {
      await updateRutinaName(rutina.id, rutinaNombre);
    } catch (e) {
      alert("Error al actualizar el nombre");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleQuickAdd = async (diaId: string) => {
    const videoFile = selectedVideos[diaId];
    if (!videoFile) return;

    setIsAddingToDia(diaId);
    try {
      const cleanName = videoFile.split("/").pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || videoFile;
      const nuevoEj = await addEjercicioToDia(diaId, {
        nombre: cleanName,
        series: 4,
        rango_reps: "10-12",
        video_url: `/videos/${videoFile}`,
      });
      
      // Update state instantly
      setDias((prev: any[]) => prev.map((d: any) => {
        if (d.id === diaId) {
          return { ...d, ejercicios: [...d.ejercicios, nuevoEj] };
        }
        return d;
      }));
      
      // Clear selection for this day
      setSelectedVideos((prev: Record<string, string>) => ({ ...prev, [diaId]: "" }));
    } catch (error) {
      console.error(error);
      alert("Error al agregar ejercicio");
    } finally {
      setIsAddingToDia(null);
    }
  };

  const handleDeleteRutina = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar la rutina completa "${rutina.nombre}"?`)) {
      setIsDeleting(true);
      try {
        await deleteRutina(rutina.id);
        router.push("/dashboard/admin/rutinas");
      } catch (e) {
        alert("Error al eliminar la rutina");
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteEjercicio = async (diaId: string, ejercicioId: string) => {
    if (!confirm("¿Eliminar este ejercicio?")) return;
    
    // Update state instantly
    setDias((prev: any[]) => prev.map((d: any) => {
      if (d.id === diaId) {
        return { ...d, ejercicios: d.ejercicios.filter((e: any) => e.id !== ejercicioId) };
      }
      return d;
    }));

    try {
      await deleteEjercicio(ejercicioId);
    } catch (e) {
      alert("Error al eliminar el ejercicio");
      router.refresh(); // revert on error
    }
  };

  const handleLoadTemplate = async (templateId: string, templateNombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres cargar la plantilla "${templateNombre}" en la rutina de este alumno? Esto reemplazará y borrará todos los ejercicios que tenga configurados actualmente.`)) {
      return;
    }
    
    setIsLoadingTemplate(templateId);
    try {
      const res = await cargarPlantillaEnRutina(templateId, rutina.id);
      if (res.success) {
        alert("Plantilla cargada con éxito.");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Error al cargar la plantilla.");
    } finally {
      setIsLoadingTemplate(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Cabecera de la Rutina (Rediseñada para evitar solapamientos) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="flex-1 min-w-0">
            <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 block">Nombre de la Rutina</label>
            <div className="flex gap-3 items-center">
              <input 
                value={rutinaNombre}
                onChange={(e) => setRutinaNombre(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={(e) => { if(e.key === 'Enter') { e.currentTarget.blur(); } }}
                className="w-full bg-transparent border-b border-transparent focus:border-yellow-500/50 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight pb-1 focus:outline-none transition-colors"
                placeholder="Escribe el nombre de la rutina..."
              />
              {isSavingName && <span className="text-zinc-500 text-xs animate-pulse shrink-0">Guardando...</span>}
            </div>
          </div>
        </div>

        {/* Barra de Acciones y Etiquetas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              {rutina.es_plantilla ? "Plantilla General" : "Personalizada"}
            </span>
            <span className="text-zinc-400 text-xs uppercase tracking-wider font-bold">
              {rutina.genero === "M" ? "Hombres ♂" : rutina.genero === "F" ? "Mujeres ♀" : "Unisex ⚧"} · {rutina.nivel || "General"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            {rutina.es_plantilla ? (
              <AssignCurrentRutinaModal usuarios={usuarios} rutinaId={rutina.id} />
            ) : (
              <LoadTemplateModal 
                plantillas={plantillas} 
                rutinaDestinoId={rutina.id} 
                tieneEjercicios={dias.some((dia: any) => dia.ejercicios && dia.ejercicios.length > 0)} 
              />
            )}
            <button 
              onClick={handleDeleteRutina}
              disabled={isDeleting}
              className="p-3 bg-red-950/40 text-red-500 hover:bg-red-900 hover:text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
              title="Eliminar rutina completa"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "Borrando..." : "Borrar Rutina"}</span>
            </button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {dias.map((dia: any) => (
          <div key={dia.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-bold text-lg text-white w-32">{dia.nombre_dia}</h2>
              
              {/* Quick Add Inline */}
              <div className="flex flex-1 w-full max-w-md gap-2">
                <select 
                  value={selectedVideos[dia.id] || ""} 
                  onChange={(e) => setSelectedVideos((prev: Record<string, string>) => ({ ...prev, [dia.id]: e.target.value }))}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Seleccionar Ejercicio...</option>
                  {localVideos.map(v => {
                    const isSubfolder = v.includes("/");
                    const folderName = isSubfolder ? v.split("/")[0] : "";
                    const fileName = v.split("/").pop()?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || v;
                    return (
                      <option key={v} value={v}>
                        {isSubfolder ? `[${folderName}] ` : ""}{fileName}
                      </option>
                    );
                  })}
                </select>
                <button 
                  onClick={() => handleQuickAdd(dia.id)}
                  disabled={!selectedVideos[dia.id] || isAddingToDia === dia.id}
                  className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-zinc-950 p-2 rounded-lg transition-colors flex-shrink-0"
                  title="Agregar Ejercicio"
                >
                  {isAddingToDia === dia.id ? <span className="w-5 h-5 block animate-spin rounded-full border-2 border-zinc-950 border-t-transparent"></span> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Droppable droppableId={dia.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-2 min-h-[60px]"
                >
                  {dia.ejercicios.map((ej: any, index: number) => (
                    <Draggable key={ej.id} draggableId={ej.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-2 p-3 bg-zinc-950 border ${snapshot.isDragging ? 'border-yellow-500 shadow-xl' : 'border-zinc-800'} rounded-xl flex items-center gap-3 transition-colors`}
                        >
                          <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-white cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                                {ej.tipo === "superset" ? "Superset" : ej.tipo === "drop_set" ? "Drop Set" : "Normal"}
                              </span>
                              <h4 className="font-bold text-white text-sm">
                                {ej.tipo === "superset" ? ej.movimientos.join(" + ") : ej.nombre}
                              </h4>
                              {ej.video_url && <a href={ej.video_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><PlayCircle className="w-4 h-4" /></a>}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-zinc-400">
                              {ej.tipo === "drop_set" ? (
                                <>
                                  <span><strong className="text-zinc-300">{ej.pesos}</strong> pesos</span>
                                  {ej.series_texto && <span><strong className="text-zinc-300">{ej.series_texto}</strong></span>}
                                </>
                              ) : (
                                <>
                                  <span><strong className="text-zinc-300">{ej.tipo === "superset" ? (ej.series_texto || ej.series) : ej.series}</strong> sets</span>
                                  <span><strong className="text-zinc-300">{ej.tipo === "superset" ? ej.reps_por_movimiento.join(" · ") : ej.rango_reps}</strong> reps</span>
                                </>
                              )}
                              {ej.rir && <span>RIR <strong className="text-zinc-300">{ej.rir}</strong></span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800" title="Editar">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEjercicio(dia.id, ej.id)}
                              className="p-2 text-red-900 hover:text-red-500 transition-colors rounded-lg hover:bg-red-950" 
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {dia.ejercicios.length === 0 && (
                    <div className="text-center py-4 text-sm text-zinc-600 italic">
                      Día de descanso (vacío)
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
