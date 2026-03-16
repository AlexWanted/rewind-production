'use client';

import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export type VideoData = {
  id: number;
  title: string;
  artist: string;
  category: string;
  image: string;
  videoUrl: string;
  year: number;
  director: string;
  cinematographer: string;
  editor: string;
  producer: string;
  description: string;
};

interface VideoModalProps {
  video: VideoData;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  // Блокируем скролл страницы при открытом модальном окне
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full backdrop-blur-md"
      >
        <X size={28} />
      </button>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-7xl bg-zinc-950 border border-white/10 rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-2xl max-h-[90vh]"
      >
        {/* Секция с видеоплеером */}
        <div className="w-full lg:w-2/3 bg-black flex items-center justify-center relative">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain max-h-[50vh] lg:max-h-[90vh]"
            controlsList="nodownload"
          />
        </div>

        {/* Секция с информацией о видео */}
        <div className="w-full lg:w-1/3 p-8 lg:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-semibold mb-2 block">
              {video.category} • {video.year}
            </span>
            <h2 className="text-3xl font-display uppercase tracking-wider mb-1 text-white">
              {video.title}
            </h2>
            <p className="text-xl text-gray-400 font-light">
              {video.artist}
            </p>
          </div>

          <p className="text-gray-300 font-light leading-relaxed mb-8 text-sm">
            {video.description}
          </p>

          <div className="space-y-4 mt-auto border-t border-white/10 pt-6">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Director</span>
              <span className="text-sm text-white font-medium col-span-2">{video.director}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">DoP</span>
              <span className="text-sm text-white font-medium col-span-2">{video.cinematographer}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Editor</span>
              <span className="text-sm text-white font-medium col-span-2">{video.editor}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Producer</span>
              <span className="text-sm text-white font-medium col-span-2">{video.producer}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
