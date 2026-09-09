import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const STOPWORDS = new Set(["al", "del", "de", "con", "en", "la", "las", "el", "los", "por", "un", "una", "y", "o", "mas", "para"]);

function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0 && !STOPWORDS.has(w));
}

function findBestMp4(
  query: string, 
  mp4Files: { fullRelative: string; rawName: string; isFem: boolean }[],
  isRutinaFem: boolean
): string | null {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;

  let bestFile: string | null = null;
  let bestScore = 0;

  for (const f of mp4Files) {
    if (isRutinaFem && !f.isFem) continue; // Priorizar carpeta femenina si es rutina de mujeres
    if (!isRutinaFem && f.isFem) continue; // Priorizar carpeta masculina si no es mujer

    const fTokens = tokenize(f.rawName);
    let matches = 0;
    for (const qt of qTokens) {
      if (fTokens.some(ft => ft.includes(qt) || qt.includes(ft))) {
        matches++;
      }
    }
    const score = matches / Math.max(qTokens.length, fTokens.length);

    // Requiere al menos 50% de coincidencia de palabras clave
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestFile = f.fullRelative;
    }
  }

  // Si no se encontró en la carpeta de su género, buscar en la carpeta general
  if (!bestFile) {
    for (const f of mp4Files) {
      const fTokens = tokenize(f.rawName);
      let matches = 0;
      for (const qt of qTokens) {
        if (fTokens.some(ft => ft.includes(qt) || qt.includes(ft))) {
          matches++;
        }
      }
      const score = matches / Math.max(qTokens.length, fTokens.length);
      if (score > bestScore && score >= 0.4) {
        bestScore = score;
        bestFile = f.fullRelative;
      }
    }
  }

  return bestFile;
}

function getAllMp4Files(): { fullRelative: string; rawName: string; isFem: boolean }[] {
  const videosDir = path.join(process.cwd(), "public", "videos");
  const results: { fullRelative: string; rawName: string; isFem: boolean }[] = [];

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
          rawName: file.replace(".mp4", "").replace("-fem", ""),
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

    let matchVideosList: string[] = [];

    // 1. Buscar coincidencias por cada movimiento de superset
    if (ej.movimientos && ej.movimientos.length > 0) {
      for (const mov of ej.movimientos) {
        const found = findBestMp4(mov, mp4Files, isRutinaFem);
        if (found) matchVideosList.push(found);
      }
    }

    // 2. Buscar coincidencia por el nombre principal
    let mainMatch = ejNombre ? findBestMp4(ejNombre, mp4Files, isRutinaFem) : null;

    let finalVideoUrl: string | null = mainMatch || (matchVideosList.length > 0 ? matchVideosList[0] : null);

    // Verificar existencia en disco
    if (finalVideoUrl) {
      const diskPath = path.join(process.cwd(), "public", finalVideoUrl);
      if (!fs.existsSync(diskPath)) {
        finalVideoUrl = null;
      }
    }

    await prisma.ejercicio.update({
      where: { id: ej.id },
      data: {
        video_url: finalVideoUrl,
        videos_urls: matchVideosList.length > 0 ? matchVideosList : (finalVideoUrl ? [finalVideoUrl] : [])
      }
    });

    if (finalVideoUrl) {
      updatedCount++;
      console.log(`✅ Vincular "${ejNombre}": ${finalVideoUrl}`);
    } else {
      nulledCount++;
      console.log(`❌ Sin MP4 para "${ejNombre}"`);
    }
  }

  console.log(`\n¡Búsqueda inteligente completada! Ejercicios vinculados con MP4: ${updatedCount}, Sin video: ${nulledCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
