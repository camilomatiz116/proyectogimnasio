import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const videosDirectory = path.join(process.cwd(), "public", "videos");
    
    if (!fs.existsSync(videosDirectory)) {
      return NextResponse.json({ videos: [] });
    }

    const fileNames = fs.readdirSync(videosDirectory);
    // Filter only video files (mp4, webm, etc.)
    const videoFiles = fileNames.filter((file) => 
      file.endsWith(".mp4") || file.endsWith(".webm") || file.endsWith(".ogg") || file.endsWith(".mov")
    );

    return NextResponse.json({ videos: videoFiles });
  } catch (error) {
    console.error("Error al leer carpeta de videos:", error);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}
