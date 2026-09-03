import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getAllVideoFiles(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllVideoFiles(fullPath, baseDir));
    } else {
      if (/\.(mp4|webm|ogg|mov)$/i.test(file)) {
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, "/");
        results.push(relative);
      }
    }
  }
  return results;
}

export async function GET() {
  try {
    const videosDirectory = path.join(process.cwd(), "public", "videos");
    const videoFiles = getAllVideoFiles(videosDirectory);
    return NextResponse.json({ videos: videoFiles });
  } catch (error) {
    console.error("Error al leer carpeta de videos:", error);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}

