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

export async function assignRutina(usuarioId: string, rutinaId: string | null) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: usuarioId },
    data: { rutinaId }
  });
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
