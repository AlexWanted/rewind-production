'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/concert/1920/1080?blur=2"
          alt="Showreel Background"
          fill
          className="object-cover opacity-40"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        /*! <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-widest text-gray-300">
            Открыта запись на 2026
          </span>
        </motion.div> */

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-6xl md:text-8xl lg:text-9xl font-display uppercase tracking-tighter leading-[0.85] mb-8"
        >
          Визуал, Который <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Говорит Громче
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light"
        >
          Мы создаем кинематографичные музыкальные клипы, live-сессии и визуальную айдентику для артистов, которые хотят оставить след.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a
            href="#work"
            className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-sm"
          >
            Наши Работы
          </a>
          <button className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <PlayCircle size={48} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-300 text-orange-500" />
            <span className="text-sm font-medium uppercase tracking-widest">Шоурил</span>
          </button>
        </motion.div>
      </div>

      { /* Scroll indicator */ }
      /*! <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Вниз</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div> */
    </section>
  );
}
