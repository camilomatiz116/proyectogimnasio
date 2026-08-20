"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export default function VideoModalButton({ videoUrl, titulo }: { videoUrl: string, titulo: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Determinar si es un video local (.mp4, .webm, etc) o un enlace de YouTube
  const isLocalVideo = videoUrl.startsWith("/") || videoUrl.endsWith(".mp4");
  
  // Extraer ID de YouTube si es necesario
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Si no es youtube, retornar la URL normal (por si es otro reproductor)
    } catch {
      return url;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
      >
        <PlayCircle className="w-4 h-4" />
        <span>Ver Video</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
              <h3 className="font-bold text-white text-lg">{titulo}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="aspect-video w-full bg-black relative">
              {isLocalVideo ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta el reproductor de video.
                </video>
              ) : (
                <iframe 
                  src={getYouTubeEmbedUrl(videoUrl)} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
