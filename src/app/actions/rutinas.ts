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

export async function addEjercicioToDia(diaId: string, data: { nombre: string; video_url?: string; series: number; rango_reps: string; rir?: string; tempo?: string }) {
  await checkAdmin();
  
  const ejerciciosCount = await prisma.ejercicio.count({ where: { dia_rutinaId: diaId } });
  
  const ejercicio = await prisma.ejercicio.create({
    data: {
      dia_rutinaId: diaId,
      orden: ejerciciosCount,
      ...data
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
