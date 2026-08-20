"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autenticado");

  const userId = (session.user as any).id;
  
  const telefono = formData.get("telefono") as string;
  const grupo_rh = formData.get("grupo_rh") as string;
  const edad = parseInt(formData.get("edad") as string) || null;
  const altura = parseFloat(formData.get("altura") as string) || null;
  const nivel = formData.get("nivel") as string;
  const genero = formData.get("genero") as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      telefono,
      grupo_rh,
      edad,
      altura,
      nivel,
      genero,
    }
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
}
