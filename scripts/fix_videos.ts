import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getAllMp4Files(): { fullRelative: string; cleanName: string; isFem: boolean }[] {
  const videosDir = path.join(process.cwd(), "public", "videos");
  const results: { fullRelative: string; cleanName: string; isFem: boolean }[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else if (file.endsWith(".mp4")) {
        const relative = path.relative(path.join(process.cwd(), "public"), fullPath).replace(/\\/g, "/");
        results.push({
          fullRelative: `/${relative}`,
          cleanName: normalize(file.replace(".mp4", "").replace("-fem", "")),
          isFem: relative.includes("avanzadomujeres")
        });
      }
    }
  }

  scan(videosDir);
  return results;
}

async function main() {
  const mp4Files = getAllMp4Files();
  console.log(`Archivos MP4 locales encontrados: ${mp4Files.length}`);

  const ejercicios = await prisma.ejercicio.findMany({
    include: {
      dia_rutina: {
        include: {
          rutina: true
        }
      }
    }
  });

  let updatedCount = 0;
  let nulledCount = 0;

  for (const ej of ejercicios) {
    const isRutinaFem = ej.dia_rutina?.rutina?.genero === "F";
    const ejNombre = ej.nombre || (ej.movimientos ? ej.movimientos.join(" ") : "");
    const normalizedEj = normalize(ejNombre);

    let matchVideo: string | null = null;
    let matchVideosList: string[] = [];

    // Buscar coincidencia para supersets / movimientos
    if (ej.movimientos && ej.movimientos.length > 0) {
      for (const mov of ej.movimientos) {
        const normMov = normalize(mov);
        const found = mp4Files.find(f => {
          if (isRutinaFem && f.isFem && f.cleanName.includes(normMov)) return true;
          return f.cleanName.includes(normMov) || normMov.includes(f.cleanName);
        });
        if (found) {
          matchVideosList.push(found.fullRelative);
        }
      }
    }

    // Buscar coincidencia para el nombre del ejercicio
    if (normalizedEj) {
      const found = mp4Files.find(f => {
        if (isRutinaFem && f.isFem && (f.cleanName.includes(normalizedEj) || normalizedEj.includes(f.cleanName))) return true;
        return f.cleanName.includes(normalizedEj) || normalizedEj.includes(f.cleanName);
      });
      if (found) {
        matchVideo = found.fullRelative;
      }
    }

    let finalVideoUrl = ej.video_url;

    // Si el video_url actual es una URL externa (http/https), o fitcron/eresfitness, reemplazarla
    if (!finalVideoUrl || finalVideoUrl.startsWith("http") || !finalVideoUrl.startsWith("/videos/")) {
      finalVideoUrl = matchVideo || (matchVideosList.length > 0 ? matchVideosList[0] : null);
    }

    // Verificar si el archivo en finalVideoUrl existe realmente en el disco
    if (finalVideoUrl) {
      const diskPath = path.join(process.cwd(), "public", finalVideoUrl);
      if (!fs.existsSync(diskPath)) {
        finalVideoUrl = matchVideo || (matchVideosList.length > 0 ? matchVideosList[0] : null);
        if (finalVideoUrl && !fs.existsSync(path.join(process.cwd(), "public", finalVideoUrl))) {
          finalVideoUrl = null;
        }
      }
    }

    await prisma.ejercicio.update({
      where: { id: ej.id },
      data: {
        video_url: finalVideoUrl,
        videos_urls: matchVideosList.length > 0 ? matchVideosList : (finalVideoUrl ? [finalVideoUrl] : [])
      }
    });

    if (finalVideoUrl) updatedCount++;
    else nulledCount++;
  }

  console.log(`¡Limpieza y vinculación completadas! Ejercicios con video MP4 local: ${updatedCount}, Ejercicios sin video (Falta video explicativo): ${nulledCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
