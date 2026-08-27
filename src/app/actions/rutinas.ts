"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Middleware manual para verificar admin
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).rol !== "admin") {
    throw new Error("No autorizado");
  }
}

export async function getRutinas() {
  await checkAdmin();
  return prisma.rutina.findMany({
    include: {
      _count: {
        select: { usuarios: true, dias: true }
      }
    },
    orderBy: { fecha_actualizacion: "desc" }
  });
}

export async function createRutina(data: { nombre: string; genero: string; nivel: string }) {
  await checkAdmin();
  const rutina = await prisma.rutina.create({
    data: {
      nombre: data.nombre,
      genero: data.genero,
      nivel: data.nivel,
      es_plantilla: true,
    }
  });
  revalidatePath("/dashboard/admin/rutinas");
  return rutina;
}

export async function getRutinaById(id: string) {
  await checkAdmin();
  return prisma.rutina.findUnique({
    where: { id },
    include: {
      dias: {
        orderBy: { orden: "asc" },
        include: {
          ejercicios: {
            orderBy: { orden: "asc" }
          }
        }
      }
    }
  });
}

export async function addDiaToRutina(rutinaId: string, nombre_dia: string) {
  await checkAdmin();
  
  // Obtener el último orden
  const diasCount = await prisma.diaRutina.count({ where: { rutinaId } });
  
  const dia = await prisma.diaRutina.create({
    data: {
      rutinaId,
      nombre_dia,
      orden: diasCount,
    }
  });
  revalidatePath(`/dashboard/admin/rutinas/${rutinaId}`);
  return dia;
}

export async function addEjercicioToDia(
  diaId: string, 
  data: { 
    tipo?: string;
    nombre?: string | null; 
    video_url?: string | null; 
    series?: number | null; 
    rango_reps?: string | null; 
    rir?: string | null; 
    tempo?: string | null;
    movimientos?: string[];
    reps_por_movimiento?: string[];
    series_texto?: string | null;
    pesos?: number | null;
  }
) {
  await checkAdmin();
  
  const ejerciciosCount = await prisma.ejercicio.count({ where: { dia_rutinaId: diaId } });
  
  const ejercicio = await prisma.ejercicio.create({
    data: {
      dia_rutinaId: diaId,
      orden: ejerciciosCount,
      tipo: data.tipo ?? "normal",
      nombre: data.nombre,
      video_url: data.video_url,
      series: data.series,
      rango_reps: data.rango_reps,
      rir: data.rir,
      tempo: data.tempo,
      movimientos: data.movimientos ?? [],
      reps_por_movimiento: data.reps_por_movimiento ?? [],
      series_texto: data.series_texto,
      pesos: data.pesos,
    }
  });
  
  // Esto forzará que se revalide todo
  revalidatePath(`/dashboard/admin/rutinas/[id]`, "page");
  return ejercicio;
}

export async function reorderEjercicios(diaId: string, orderedIds: string[]) {
  await checkAdmin();
  
  const updates = orderedIds.map((id, index) => 
    prisma.ejercicio.update({
      where: { id },
      data: { orden: index }
    })
  );
  
  await prisma.$transaction(updates);
  return { success: true };
}

export async function getAllUsers() {
  await checkAdmin();
  return prisma.user.findMany({
    where: { rol: "alumno" },
    select: { id: true, name: true, email: true, nivel: true, genero: true, rutinaId: true },
    orderBy: { name: "asc" }
  });
}

async function clonarPlantillaEnUsuario(usuarioId: string, plantillaId: string) {
  const user = await prisma.user.findUnique({
    where: { id: usuarioId },
    select: { id: true, name: true, genero: true, nivel: true, rutinaId: true }
  });
  if (!user) throw new Error("Usuario no encontrado");

  // 1. Obtener la plantilla con sus días y ejercicios
  const plantilla = await prisma.rutina.findUnique({
    where: { id: plantillaId },
    include: {
      dias: {
        include: {
          ejercicios: {
            orderBy: { orden: "asc" }
          }
        }
      }
    }
  });
  if (!plantilla) throw new Error("Plantilla no encontrada");

  let rutinaDestinoId = user.rutinaId;

  // 2. Si el usuario no tiene rutina, o su rutina es una plantilla (por error antiguo), crearle una nueva
  if (!rutinaDestinoId) {
    const nuevaRutina = await prisma.rutina.create({
      data: {
        nombre: `Rutina de ${user.name?.split(" ")[0] || "Alumno"}`,
        genero: user.genero || plantilla.genero || "U",
        nivel: user.nivel || plantilla.nivel || "general",
        es_plantilla: false,
      }
    });
    rutinaDestinoId = nuevaRutina.id;
    await prisma.user.update({
      where: { id: usuarioId },
      data: { rutinaId: nuevaRutina.id }
    });
  } else {
    // Si ya tiene rutina, verificar que no sea una plantilla. Si es plantilla, crearle una nueva
    const rutinaActual = await prisma.rutina.findUnique({ where: { id: rutinaDestinoId } });
    if (rutinaActual?.es_plantilla) {
      const nuevaRutina = await prisma.rutina.create({
        data: {
          nombre: `Rutina de ${user.name?.split(" ")[0] || "Alumno"}`,
          genero: user.genero || plantilla.genero || "U",
          nivel: user.nivel || plantilla.nivel || "general",
          es_plantilla: false,
        }
      });
      rutinaDestinoId = nuevaRutina.id;
      await prisma.user.update({
        where: { id: usuarioId },
        data: { rutinaId: nuevaRutina.id }
      });
    }
  }

  // 3. Eliminar todos los días antiguos de la rutina destino
  await prisma.diaRutina.deleteMany({
    where: { rutinaId: rutinaDestinoId }
  });

  // 4. Copiar días y ejercicios de la plantilla a la rutina destino
  for (const diaPlantilla of plantilla.dias) {
    const nuevoDia = await prisma.diaRutina.create({
      data: {
        rutinaId: rutinaDestinoId,
        nombre_dia: diaPlantilla.nombre_dia,
        orden: diaPlantilla.orden
      }
    });

    for (const ejPlantilla of diaPlantilla.ejercicios) {
      await prisma.ejercicio.create({
        data: {
          dia_rutinaId: nuevoDia.id,
          orden: ejPlantilla.orden,
          tipo: ejPlantilla.tipo,
          nombre: ejPlantilla.nombre,
          video_url: ejPlantilla.video_url,
          series: ejPlantilla.series,
          rango_reps: ejPlantilla.rango_reps,
          rir: ejPlantilla.rir,
          tempo: ejPlantilla.tempo,
          movimientos: ejPlantilla.movimientos,
          reps_por_movimiento: ejPlantilla.reps_por_movimiento,
          series_texto: ejPlantilla.series_texto,
          pesos: ejPlantilla.pesos
        }
      });
    }
  }
}

export async function assignRutina(usuarioId: string, rutinaId: string | null) {
  await checkAdmin();
  if (rutinaId === null) {
    await prisma.user.update({
      where: { id: usuarioId },
      data: { rutinaId: null }
    });
  } else {
    // Verificar si la rutina seleccionada es una plantilla
    const rutina = await prisma.rutina.findUnique({ where: { id: rutinaId } });
    if (rutina?.es_plantilla) {
      await clonarPlantillaEnUsuario(usuarioId, rutinaId);
    } else {
      await prisma.user.update({
        where: { id: usuarioId },
        data: { rutinaId }
      });
    }
  }
  revalidatePath("/dashboard/admin/rutinas");
  return { success: true };
}

export async function deleteRutina(rutinaId: string) {
  await checkAdmin();
  await prisma.rutina.delete({
    where: { id: rutinaId }
  });
  revalidatePath("/dashboard/admin/rutinas");
  return { success: true };
}

export async function updateRutinaName(rutinaId: string, nombre: string) {
  await checkAdmin();
  await prisma.rutina.update({
    where: { id: rutinaId },
    data: { nombre }
  });
  revalidatePath(`/dashboard/admin/rutinas/${rutinaId}`);
  revalidatePath("/dashboard/admin/rutinas");
  return { success: true };
}

export async function getOrCreateUserRoutine(userId: string) {
  await checkAdmin();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, rutinaId: true }
  });
  
  if (!user) throw new Error("Usuario no encontrado");
  
  if (user.rutinaId) {
    // Si la rutina existe, verificar si tiene días, si no, crearlos
    const daysCount = await prisma.diaRutina.count({ where: { rutinaId: user.rutinaId } });
    if (daysCount === 0) {
      const diasDefault = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      for (let i = 0; i < diasDefault.length; i++) {
        await prisma.diaRutina.create({
          data: { rutinaId: user.rutinaId, nombre_dia: diasDefault[i], orden: i }
        });
      }
    }
    return user.rutinaId;
  }
  
  // Create new routine
  const rutina = await prisma.rutina.create({
    data: {
      nombre: `Rutina de ${user.name?.split(" ")[0] || "Alumno"}`,
      genero: "U",
      nivel: "general",
      es_plantilla: false,
    }
  });
  
  // Create default days
  const diasDefault = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  for (let i = 0; i < diasDefault.length; i++) {
    await prisma.diaRutina.create({
      data: { rutinaId: rutina.id, nombre_dia: diasDefault[i], orden: i }
    });
  }
  
  // Assign to user
  await prisma.user.update({
    where: { id: userId },
    data: { rutinaId: rutina.id }
  });
  
  revalidatePath("/dashboard/admin/rutinas");
  return rutina.id;
}

export async function deleteEjercicio(ejercicioId: string) {
  await checkAdmin();
  await prisma.ejercicio.delete({
    where: { id: ejercicioId }
  });
  // No revalidar porque el UI se actualiza optimistamente
  return { success: true };
}

export async function getPlantillas() {
  await checkAdmin();
  return prisma.rutina.findMany({
    where: { es_plantilla: true },
    include: {
      _count: {
        select: { usuarios: true, dias: true }
      }
    },
    orderBy: { fecha_actualizacion: "desc" }
  });
}

export async function cargarPlantillaEnRutina(plantillaId: string, rutinaDestinoId: string) {
  await checkAdmin();
  
  // 1. Obtener la plantilla con sus días y ejercicios
  const plantilla = await prisma.rutina.findUnique({
    where: { id: plantillaId },
    include: {
      dias: {
        include: {
          ejercicios: {
            orderBy: { orden: "asc" }
          }
        }
      }
    }
  });
  
  if (!plantilla) throw new Error("Plantilla no encontrada");
  
  // 2. Obtener la rutina destino
  const rutinaDestino = await prisma.rutina.findUnique({
    where: { id: rutinaDestinoId }
  });
  
  if (!rutinaDestino) throw new Error("Rutina destino no encontrada");
  
  // 3. Eliminar todos los días antiguos de la rutina destino (por cascade delete, borrará también los ejercicios)
  await prisma.diaRutina.deleteMany({
    where: { rutinaId: rutinaDestinoId }
  });
  
  // 4. Copiar los días y ejercicios de la plantilla a la rutina destino
  for (const diaPlantilla of plantilla.dias) {
    const nuevoDia = await prisma.diaRutina.create({
      data: {
        rutinaId: rutinaDestinoId,
        nombre_dia: diaPlantilla.nombre_dia,
        orden: diaPlantilla.orden
      }
    });
    
    for (const ejPlantilla of diaPlantilla.ejercicios) {
      await prisma.ejercicio.create({
        data: {
          dia_rutinaId: nuevoDia.id,
          orden: ejPlantilla.orden,
          tipo: ejPlantilla.tipo,
          nombre: ejPlantilla.nombre,
          video_url: ejPlantilla.video_url,
          series: ejPlantilla.series,
          rango_reps: ejPlantilla.rango_reps,
          rir: ejPlantilla.rir,
          tempo: ejPlantilla.tempo,
          movimientos: ejPlantilla.movimientos,
          reps_por_movimiento: ejPlantilla.reps_por_movimiento,
          series_texto: ejPlantilla.series_texto,
          pesos: ejPlantilla.pesos
        }
      });
    }
  }
  
  // 5. Revalidar las páginas
  revalidatePath(`/dashboard/admin/rutinas/${rutinaDestinoId}`);
  revalidatePath(`/dashboard/admin/rutinas`);
  revalidatePath(`/dashboard`);
  
  return { success: true };
}
