"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registerCheckIn(qrData: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const userId = (session.user as any).id;

  // Validar que el QR corresponda al gimnasio
  if (qrData !== "JPES-GYM-CHECKIN-V1") {
    throw new Error("Código QR inválido para este gimnasio.");
  }

  // Verificar si ya hizo check-in hoy para evitar duplicados
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const existingCheckIn = await prisma.checkIn.findFirst({
    where: {
      usuarioId: userId,
      fecha_hora: {
        gte: hoy,
      }
    }
  });

  if (existingCheckIn) {
    throw new Error("Ya has registrado tu asistencia el día de hoy.");
  }

  await prisma.checkIn.create({
    data: {
      usuarioId: userId,
      metodo: "qr",
    }
  });

  return { success: true, message: "¡Asistencia registrada correctamente!" };
}
