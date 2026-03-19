'use client';

import { motion } from 'motion/react';
import { Video, Camera, Mic2, Clapperboard } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Музыкальные Клипы',
    description: 'Производство музыкальных клипов от идеи до финального результата',
    icon: Video,
    price: '50'
  },
  {
    id: '02',
    title: 'Сниппеты',
    description: 'Динамичные короткие видео для продвижения ваших треков',
    icon: Clapperboard,
    price: '15'
  },
  {
    id: '03',
    title: 'Фотосессии',
    description: 'Фотографии для соцсетей, карточки артиста или обложек релизов',
    icon: Camera,
    price: '10'
  },
  {
    id: '04',
    title: 'Лайв видео',
    description: 'Многокамерная запись ваших живых выступлений, как концертная, так и студийная',
    icon: Mic2,
    price: '60'
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-display font-medium uppercase tracking-normal mb-6">
              Что Мы <span className="text-orange-500 drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)]">Делаем</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Мы специализируемся на создании визуального контента, который усиливает музыку. Подстроимся под вашу идею и визуальный стиль
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative pl-8 md:pl-16 border-l border-white/10 hover:border-orange-500 transition-colors duration-500">
              <div className="absolute -left-px top-0 w-[2px] h-0 bg-orange-500 group-hover:h-full transition-all duration-500 ease-out" />
              
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
              <p>
              От <span className="text-orange-500 mb-4">{service.price}</span> тыс. рублей
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
