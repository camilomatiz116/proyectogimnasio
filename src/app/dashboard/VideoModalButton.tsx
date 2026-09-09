"use client";

import { useState } from "react";
import { PlayCircle, X, Layers } from "lucide-react";

interface VideoModalButtonProps {
  videoUrl?: string | null;
  videosUrls?: (string | null)[] | null;
  titulo: string;
  movimientos?: string[];
  buttonText?: string;
  className?: string;
}

export default function VideoModalButton({
  videoUrl,
  videosUrls,
  titulo,
  movimientos = [],
  buttonText,
  className,
}: VideoModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Recopilar lista limpia de URLs locales MP4
  const isValidVideoUrl = (u: any) => typeof u === "string" && (u.startsWith("/videos/") || u.endsWith(".mp4") || u.includes(".mp4"));
  const rawList = (videosUrls && videosUrls.length > 0 ? videosUrls : videoUrl ? [videoUrl] : []).filter(isValidVideoUrl) as string[];

  // Eliminar duplicados manteniendo orden
  const videoList = Array.from(new Set(rawList));

  const [activeTab, setActiveTab] = useState<number | "all">(0);

  if (videoList.length === 0) return null;


  const isLocalVideo = (url: string) => url.startsWith("/") || url.endsWith(".mp4") || url.includes(".mp4");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const renderSinglePlayer = (url: string, keyIdx: number) => {
    const isLocal = isLocalVideo(url);
    return (
      <div key={keyIdx} className="aspect-video w-full bg-black relative rounded-xl overflow-hidden border border-zinc-800">
        {isLocal ? (
          <video
            src={url}
            controls
            autoPlay={videoList.length === 1 || activeTab !== "all"}
            className="w-full h-full object-contain"
          >
            Tu navegador no soporta el reproductor de video.
          </video>
        ) : (
          <iframe
            src={getYouTubeEmbedUrl(url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    );
  };

  const defaultText = videoList.length > 1 ? `Ver Videos (${videoList.length})` : "Ver Video";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "flex items-center justify-center space-x-1.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors w-full md:w-auto"
        }
      >
        {videoList.length > 1 ? <Layers className="w-4 h-4 text-yellow-500" /> : <PlayCircle className="w-4 h-4" />}
        <span>{buttonText || defaultText}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl w-full ${videoList.length > 1 && activeTab === "all" ? "max-w-5xl" : "max-w-3xl"} overflow-hidden shadow-2xl transition-all duration-300`}>
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">{titulo}</h3>
                {videoList.length > 1 && (
                  <p className="text-zinc-400 text-xs mt-0.5">Ejercicio combinado · {videoList.length} videos disponibles</p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full p-1.5 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas cuando hay múltiples videos */}
            {videoList.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-zinc-950/60 border-b border-zinc-800/80 overflow-x-auto">
                {videoList.map((_, idx) => {
                  const label = movimientos[idx] ? `Video ${idx + 1}: ${movimientos[idx]}` : `Video ${idx + 1}`;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? "bg-yellow-500 text-zinc-950 shadow-md"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeTab === "all"
                      ? "bg-yellow-500 text-zinc-950 shadow-md"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  Ver ambos a la vez 🎬
                </button>
              </div>
            )}

            {/* Body con Video(s) */}
            <div className="p-3 sm:p-4 bg-zinc-950/40 max-h-[80vh] overflow-y-auto">
              {videoList.length === 1 ? (
                renderSinglePlayer(videoList[0], 0)
              ) : activeTab === "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoList.map((url, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <p className="text-xs font-bold text-yellow-500 uppercase tracking-wide">
                        {movimientos[idx] ? `${idx + 1}. ${movimientos[idx]}` : `Ejercicio ${idx + 1}`}
                      </p>
                      {renderSinglePlayer(url, idx)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {movimientos[activeTab as number] && (
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-wide">
                      {movimientos[activeTab as number]}
                    </p>
                  )}
                  {renderSinglePlayer(videoList[activeTab as number], activeTab as number)}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

