"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registrarAlumno(data: { name: string; email: string; password: string }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "El correo ya está registrado" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        rol: "alumno",
      },
    });

    revalidatePath("/dashboard/admin/usuarios");
    return { success: true };
  } catch (error: any) {
    console.error("Error al registrar alumno:", error);
    return { success: false, error: error.message || "Error interno del servidor" };
  }
}
