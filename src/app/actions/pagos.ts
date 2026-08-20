"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).rol !== "admin") {
    throw new Error("No autorizado");
  }
}

export async function getUsuariosFinanzas() {
  await checkAdmin();
  return prisma.user.findMany({
    where: { rol: "alumno" },
    select: {
      id: true,
      name: true,
      email: true,
      fecha_vencimiento_membresia: true,
      activo: true,
    },
    orderBy: { name: "asc" }
  });
}

export async function registrarPagoEfectivo(usuarioId: string) {
  await checkAdmin();
  
  const usuario = await prisma.user.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error("Usuario no encontrado");

  // Calcular nueva fecha de vencimiento (30 días desde hoy o desde el vencimiento actual si es futuro)
  const hoy = new Date();
  let nuevaFecha = new Date();
  
  if (usuario.fecha_vencimiento_membresia && usuario.fecha_vencimiento_membresia > hoy) {
    nuevaFecha = new Date(usuario.fecha_vencimiento_membresia);
  }
  
  nuevaFecha.setDate(nuevaFecha.getDate() + 30);

  // Registrar el pago
  await prisma.pago.create({
    data: {
      usuarioId,
      periodo: `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`,
      monto: 0, // Aquí iría el costo real de la mensualidad en efectivo
      estado: "pagado",
      fecha_pago: hoy,
      referencia_wompi: "EFECTIVO-QR"
    }
  });

  // Actualizar membresía
  await prisma.user.update({
    where: { id: usuarioId },
    data: { fecha_vencimiento_membresia: nuevaFecha }
  });

  revalidatePath("/dashboard/admin/usuarios");
  revalidatePath("/dashboard/pagos");
  return { success: true, nuevaFecha };
}

export async function getMembresiaAlumno() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  return prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true,
      fecha_vencimiento_membresia: true,
      pagos: {
        orderBy: { fecha_pago: "desc" },
        take: 5
      }
    }
  });
}
