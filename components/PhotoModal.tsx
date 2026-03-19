'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export type PhotoData = {
  id: string;
  images: string[];
  src?: string; // For backwards compatibility
  alt: string;
  photographer?: string;
  location?: string;
  date?: string;
  camera?: string;
  order?: number;
};

interface PhotoModalProps {
  photo: PhotoData;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const images = photo.images?.length > 0 ? photo.images : (photo.src ? [photo.src] : []);
  const currentIndex = Math.abs(page % images.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

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
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
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
        {/* Секция с изображением */}
        <div className="w-full lg:w-2/3 bg-black flex items-center justify-center relative min-h-[50vh] lg:min-h-[80vh] group">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {images[currentIndex] && (
                <Image
                  src={images[currentIndex]}
                  alt={`${photo.alt} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="absolute left-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="absolute right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Секция с информацией о фото */}
        <div className="w-full lg:w-1/3 p-8 lg:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            {photo.date && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-semibold mb-2 block">
                Фотосессия • {photo.date}
              </span>
            )}
            <h2 className="text-3xl font-display uppercase tracking-wider mb-1 text-white">
              {photo.alt}
            </h2>
          </div>

          <div className="space-y-4 mt-auto border-t border-white/10 pt-6">
            {photo.photographer && (
              <div className="grid grid-cols-3 gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Фотограф</span>
                <span className="text-sm text-white font-medium col-span-2">{photo.photographer}</span>
              </div>
            )}
            {photo.location && (
              <div className="grid grid-cols-3 gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Локация</span>
                <span className="text-sm text-white font-medium col-span-2">{photo.location}</span>
              </div>
            )}
            {photo.camera && (
              <div className="grid grid-cols-3 gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-500 col-span-1">Камера</span>
                <span className="text-sm text-white font-medium col-span-2">{photo.camera}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
