'use client';

import { useState } from 'react';
import { LazyMotion, m } from 'motion/react';
import { Mail, Phone, Instagram, Youtube, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    project: 'Сниппеты',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Новая заявка: ${formData.project}`;
    const body = `Имя: ${formData.name}\nEmail: ${formData.email}\nTelegram: ${formData.telegram}\nТип проекта: ${formData.project}\n\nСообщение:\n${formData.message}`;
    window.location.href = `mailto:rewindthetape@yandex.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="py-32 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-display font-medium uppercase tracking-normal mb-6">
              Давайте <span className="text-orange-500  rop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)]">Творить</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-12">
              Готовы воплотить свое видение в жизнь? Свяжитесь с нами, чтобы обсудить ваше следующее музыкальное видео или фотопроект
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Mail className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                  <a href="mailto:rewindthetape@yandex.ru" className="text-lg font-light hover:text-orange-500 transition-colors">
                    rewindthetape@yandex.ru
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Phone className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Телефон</p>
                  <a href="tel:+79152558875" className="text-lg font-light hover: drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)] transition-colors">
                    +7 (915) 255-88-75
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Send className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Telegram</p>
                  <a href="https://t.me/rewindproduction/" className="text-lg font-light hover:text-orange-500 transition-colors">
                    @rewindproduction
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-6">
              <a href="https://instagram.com/_rewindthetape_/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com/c/RewindTheTape" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Youtube size={18} />
              </a>
              <a href="https://t.me/potseluev_ph" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Send size={18} />
              </a>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full bg-zinc-900/50 p-8 md:p-12 rounded-sm border border-white/5"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Имя</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telegram" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Ссылка на Telegram</label>
                <input
                  type="text"
                  id="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light"
                  placeholder="@username или t.me/username"
                />
              </div>

              <div>
                <label htmlFor="project" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Тип проекта</label>
                <select
                  id="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light appearance-none">
                  <option value="Сниппеты">Сниппеты</option>
                  <option value="Фотосессия">Фотосессия</option>
                  <option value="Концертная съёмка">Концертная съёмка</option>
                  <option value="Клип, муд видео">Клип, муд видео</option>
                  <option value="Студийный лайв">Студийный лайв</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Сообщение</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light resize-none"
                  placeholder="Расскажите нам о вашем видении..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-semibold uppercase tracking-widest py-4 hover:bg-orange-500 hover:text-white hover:shadow-orange-500/50 transition-all duration-300 rounded-sm">
                Отправить сообщение
              </button>
            </form>
          </m.div>
        </div>
      </div>
    </section>
  );
}
