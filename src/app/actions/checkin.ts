"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registerCheckIn(qrData: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { qr_auto_login: true, name: true }
  });

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

  const autoLoginText = user?.qr_auto_login 
    ? "Acceso automático activo para tus próximos escaneos." 
    : "Configuración: Se solicitarán credenciales en cada sesión nueva.";

  return { 
    success: true, 
    message: `¡Asistencia registrada correctamente, ${user?.name || "Alumno"}! ${autoLoginText}` 
  };

}
