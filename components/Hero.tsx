'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div data-video-controls="hidden" className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={true}
          playsInline={true}
		      data-video-initialized="true"
		      preload="auto"
          className="object-cover w-full h-full opacity-50">
          <source src="/uploads/misc/1773867797446-85208419-site-banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/15 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-7xl font-display font-semibold uppercase tracking-wide leading-[0.55] mb-4">
          Визуал, Который <br/>
          Говорит <span className="text-orange-500 bg-clip-text mb-12 text-shadow-orange">Громче
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light">
          Мы создаем кинематографичный визуальный контент для артистов, который запоминается
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-6">
          <a href="#work"
            className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white hover:shadow-orange-500/50 transition-all duration-300 rounded-sm">
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
