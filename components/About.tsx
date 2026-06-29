'use client';

import { LazyMotion, motion } from 'motion/react';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { presignUrls } from '@/lib/presign';

export default function About() {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  useEffect(() => {
    const fetchPhotoUrl = async () => {
      const urls = await presignUrls(['misc/1773881738735-441575069-_______12-03_5.jpg']);
      const url = urls['misc/1773881738735-441575069-_______12-03_5.jpg'];
      if (url) {
        setPhotoUrl(url);
      }
    };
    fetchPhotoUrl();
  }, []);
	
  return (
    <section id="about" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative aspect-4/5 w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-orange-500/20 translate-x-4 translate-y-4 rounded-sm" />
			{photoUrl && <Image src={photoUrl} alt="Director on set" fill sizes="100vw" className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer"/>}
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md px-6 py-4 border border-white/10">
              <p className="text-display uppercase tracking-widest text-sm text-orange-500 mb-1">Основано в 2018</p>
              <p className="text-white font-light text-xs uppercase tracking-wider">Базируемся в Москве</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <h2 className="text-5xl md:text-7xl font-display font-medium uppercase tracking-normal mb-8">
              Команда <span className="text-orange-500  drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)]">Rewind</span>
            </h2>
            
            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
              <p>
                rewind production с самого своего основания специализируется на создании музыкального визуала
              </p>
              <p>
                Для нас важно создавать контент, который будет нравиться в первую очередь артисту и его слушателям. Мы стараемся адаптироваться под ваш визуальный стиль, идеи и концепцию вашей музыки
              </p>
              <p>
                За последние несколько лет мы провели несколько сотен съёмок, как для начинающих артистов, так и в сотрудничестве с выпускающими лейблами
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
              <div>
                <p className="text-7xl font-display font-bold text-orange-500  drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)] mb-2">20+</p>
                <p className="text-2xl uppercase tracking-widest font-semibold text-white">Музыкальных Клипов</p>
              </div>
              <div>
                <p className="text-7xl font-display font-bold text-orange-500  drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)] mb-2">1000+</p>
                <p className="text-2xl uppercase tracking-widest font-semibold text-white">Готовых сниппетов</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
