'use client';

import { motion } from 'motion/react';
import { Video, Camera, Scissors, Mic2 } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Музыкальные Клипы',
    description: 'Полномасштабное производство музыкальных клипов от концепции до финального монтажа. Мы воплощаем ваше звуковое видение в жизнь с помощью кинематографичного сторителлинга.',
    icon: Video,
  },
  {
    id: '02',
    title: 'Live-Сессии',
    description: 'Высококачественная многокамерная запись живых выступлений, передающая сырую энергию вашей группы в студии или на сцене.',
    icon: Mic2,
  },
  {
    id: '03',
    title: 'Фотография',
    description: 'Пресс-снимки, фотографии для обложек альбомов и документальное освещение вашего творческого процесса за кулисами.',
    icon: Camera,
  },
  {
    id: '04',
    title: 'Постпродакшн',
    description: 'Профессиональный монтаж, цветокоррекция и визуальные эффекты, чтобы придать вашим материалам отполированный вид по стандартам индустрии.',
    icon: Scissors,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-6">
              Что Мы <span className="text-orange-500">Делаем</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Мы специализируемся на создании визуального контента, который усиливает музыку. От высококлассных музыкальных клипов до интимных live-сессий — мы берем на себя каждый этап производственного процесса.
            </p>
          </div>
          /*! <div className="md:w-1/3 flex justify-end">
            <div className="w-24 h-24 rounded-full border border-orange-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-semibold text-center leading-tight">
                Творческое<br />Видение
              </span>
            </div>
          </div> */
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative pl-8 md:pl-16 border-l border-white/10 hover:border-orange-500 transition-colors duration-500"
            >
              <div className="absolute -left-[1px] top-0 w-[2px] h-0 bg-orange-500 group-hover:h-full transition-all duration-500 ease-out" />
              
              <div className="flex items-center gap-6 mb-6">
                <span className="text-4xl font-display text-white/20 group-hover:text-orange-500/50 transition-colors duration-300">
                  {service.id}
                </span>
                <service.icon size={32} className="text-orange-500" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-3xl font-display uppercase tracking-wider mb-4 group-hover:text-orange-500 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
