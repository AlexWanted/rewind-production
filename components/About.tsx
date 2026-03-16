'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative aspect-[4/5] w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-orange-500/20 translate-x-4 translate-y-4 rounded-sm" />
            <Image
              src="https://picsum.photos/seed/director/800/1000"
              alt="Director on set"
              fill
              className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
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
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-8">
              Команда <span className="text-orange-500">Rewind</span>
            </h2>
            
            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
              <p>
                Rewind Production родилась из общей одержимости музыкой и кино. Мы — коллектив режиссеров, операторов и монтажеров, преданных делу перевода звука в поразительные визуальные образы.
              </p>
              <p>
                Мы верим, что у каждого артиста есть своя уникальная частота. Наша работа — настроиться на эту частоту и построить вокруг нее визуальный мир. Будь то суровое андеграундное хип-хоп видео или масштабная кинематографичная работа для инди-рок группы, мы подходим к каждому проекту с одинаковой страстью и точностью.
              </p>
              <p>
                За последние пять лет мы сотрудничали как с восходящими талантами, так и с признанными иконами, помогая им рассказывать свои истории через объектив камеры.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
              <div>
                <p className="text-4xl font-display text-white mb-2">150+</p>
                <p className="text-xs uppercase tracking-widest text-orange-500">Музыкальных Клипов</p>
              </div>
              <div>
                <p className="text-4xl font-display text-white mb-2">50M+</p>
                <p className="text-xs uppercase tracking-widest text-orange-500">Просмотров на YouTube</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
