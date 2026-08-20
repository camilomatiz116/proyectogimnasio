"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, PlayCircle, Trash2, Edit, Plus } from "lucide-react";
import { addEjercicioToDia, reorderEjercicios, updateRutinaName } from "@/app/actions/rutinas";
import { useRouter } from "next/navigation";

export default function BuilderClient({ rutina }: { rutina: any }) {
  const router = useRouter();
  const [dias, setDias] = useState(rutina.dias || []);
  const [rutinaNombre, setRutinaNombre] = useState(rutina.nombre);
  const [isSavingName, setIsSavingName] = useState(false);
  const [localVideos, setLocalVideos] = useState<string[]>([]);
  
  const [isAddingEj, setIsAddingEj] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setLocalVideos(data.videos || []))
      .catch(console.error);
  }, []);

  const handleAddDia = async () => {
    if (!newDiaName.trim()) return;
    try {
      await addDiaToRutina(rutina.id, newDiaName);
      setNewDiaName("");
      setIsAddingDia(false);
      // Let Server Action revalidate handle data refresh, but we might need to refresh manually for client component if it doesn't trigger
    } catch (e) {
      alert("Error al agregar día");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceDiaId = result.source.droppableId;
    const destDiaId = result.destination.droppableId;
    
    // Solo soportamos reordenamiento dentro del mismo día por ahora para simplicidad
    if (sourceDiaId !== destDiaId) {
      alert("No se puede mover entre días todavía.");
      return;
    }

    const diaIndex = dias.findIndex((d: any) => d.id === sourceDiaId);
    if (diaIndex === -1) return;

    const newDias = [...dias];
    const ejercicios = [...newDias[diaIndex].ejercicios];
    
    // Mover
    const [movedItem] = ejercicios.splice(result.source.index, 1);
    ejercicios.splice(result.destination.index, 0, movedItem);
    
    newDias[diaIndex].ejercicios = ejercicios;
    setDias(newDias); // Update optimistly

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

  return (
    <div className="space-y-6 pb-24">
      {/* Título editable */}
      <div className="mb-8">
        <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 block">Nombre de la Rutina</label>
        <div className="flex gap-3">
          <input 
            value={rutinaNombre}
            onChange={(e) => setRutinaNombre(e.target.value)}
            onBlur={handleUpdateName}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.currentTarget.blur(); } }}
            className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-yellow-500 text-3xl sm:text-4xl font-black text-white uppercase tracking-tight pb-2 focus:outline-none transition-colors"
            placeholder="Escribe el nombre de la rutina..."
          />
          {isSavingName && <span className="text-zinc-500 text-sm animate-pulse flex-shrink-0 self-end mb-3">Guardando...</span>}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {dias.map((dia: any) => (
          <div key={dia.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-lg text-white">{dia.nombre_dia}</h2>
              <button 
                onClick={() => setIsAddingEj(dia.id)}
                className="text-xs bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-1 px-3 rounded flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Ejercicio</span>
              </button>
            </div>
            
            <Droppable droppableId={dia.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-2 min-h-[100px]"
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
                              <h4 className="font-bold text-white text-sm">{ej.nombre}</h4>
                              {ej.video_url && <a href={ej.video_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><PlayCircle className="w-4 h-4" /></a>}
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-zinc-400">
                              <span><strong className="text-zinc-300">{ej.series}</strong> sets</span>
                              <span><strong className="text-zinc-300">{ej.rango_reps}</strong> reps</span>
                              {ej.rir && <span>RIR <strong className="text-zinc-300">{ej.rir}</strong></span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-900 hover:text-red-500 transition-colors rounded-lg hover:bg-red-950">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {dia.ejercicios.length === 0 && !isAddingEj && (
                    <div className="text-center py-6 text-sm text-zinc-500">
                      No hay ejercicios en este día.
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            {/* Quick Add Form */}
            {isAddingEj === dia.id && (
              <NewEjercicioForm diaId={dia.id} localVideos={localVideos} onCancel={() => setIsAddingEj(null)} />
            )}
          </div>
        ))}
      </DragDropContext>

      {/* Add Day Button */}
      {!isAddingDia ? (
        <button 
          onClick={() => setIsAddingDia(true)}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 rounded-2xl p-6 flex flex-col items-center justify-center transition-colors"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">Agregar Día de Entrenamiento</span>
        </button>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Nuevo Día</h3>
          <div className="flex gap-3">
            <input 
              value={newDiaName}
              onChange={e => setNewDiaName(e.target.value)}
              placeholder="Ej: Lunes - Pierna Enfocada"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              autoFocus
            />
            <button onClick={handleAddDia} className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold px-6 rounded-lg">Guardar</button>
            <button onClick={() => setIsAddingDia(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewEjercicioForm({ diaId, localVideos, onCancel }: { diaId: string, localVideos: string[], onCancel: () => void }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [videoLocal, setVideoLocal] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNombre(val);
    
    if (val.length > 2) {
      const match = localVideos.find(v => {
        const vName = v.toLowerCase().replace(".mp4", "").replace(".webm", "");
        const input = val.toLowerCase();
        return vName.includes(input) || input.includes(vName);
      });
      if (match) {
        setVideoLocal(`/videos/${match}`);
      }
    }
  };

  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
      <form action={async (formData) => {
        const video_url_ext = formData.get("video_url_ext") as string;
        const finalVideoUrl = video_url_ext || videoLocal || undefined;

        await addEjercicioToDia(diaId, {
          nombre: formData.get("nombre") as string,
          series: parseInt(formData.get("series") as string),
          rango_reps: formData.get("rango_reps") as string,
          rir: formData.get("rir") as string,
          video_url: finalVideoUrl,
        });
        onCancel();
        router.refresh();
      }} className="space-y-3">
        <input required name="nombre" value={nombre} onChange={handleNombreChange} placeholder="Nombre del Ejercicio (ej: Press Banca)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm" />
        
        <div className="flex gap-2">
          <input required name="series" type="number" placeholder="Series" className="w-[15%] bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm" />
          <input required name="rango_reps" placeholder="Reps (ej: 10-12)" className="w-[20%] bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm" />
          <input name="rir" placeholder="RIR (opcional)" className="w-[15%] bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm" />
          <select name="video_local" value={videoLocal} onChange={e => setVideoLocal(e.target.value)} className="w-[25%] bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm focus:outline-none">
            <option value="">Video Carpeta</option>
            {localVideos.map(v => (
              <option key={v} value={`/videos/${v}`}>{v}</option>
            ))}
          </select>
          <input name="video_url_ext" placeholder="O Link Externo (YouTube)" className="w-[25%] bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white text-sm" />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white">Cancelar</button>
          <button type="submit" className="bg-yellow-500 text-zinc-950 px-3 py-1.5 rounded-lg text-xs font-bold">Guardar</button>
        </div>
      </form>
    </div>
  );
}
