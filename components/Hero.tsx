'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-40"
        >
          <source src="/uploads/misc/1773866875776-29482824-site-banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight leading-[0.85] mb-8"
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
          <a href="#work"
            className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-sm">
            Наши Работы
          </a>
		  
          {/* <button className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <PlayCircle size={48} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-300 text-orange-500" />
            <span className="text-sm font-medium uppercase tracking-widest">Шоурил</span>
          </button> */}
        </motion.div>
      </div>
    </section>
  );
}
