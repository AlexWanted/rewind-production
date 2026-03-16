'use client';

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-black relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-6">
              Let&apos;s <span className="text-orange-500">Create</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-12">
              Ready to bring your vision to life? Reach out to us to discuss your next music video, live session, or photography project.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Mail className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                  <a href="mailto:hello@rewindproduction.com" className="text-lg font-light hover:text-orange-500 transition-colors">
                    hello@rewindproduction.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Phone className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                  <a href="tel:+13235550198" className="text-lg font-light hover:text-orange-500 transition-colors">
                    +1 (323) 555-0198
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <MapPin className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Studio</p>
                  <p className="text-lg font-light">
                    1234 Sunset Blvd, Los Angeles, CA 90028
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full bg-zinc-900/50 p-8 md:p-12 rounded-sm border border-white/5"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="project" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Type</label>
                <select
                  id="project"
                  className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light appearance-none"
                >
                  <option value="music-video">Music Video</option>
                  <option value="live-session">Live Session</option>
                  <option value="photography">Photography</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors font-light resize-none"
                  placeholder="Tell us about your vision..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-semibold uppercase tracking-widest py-4 hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-sm"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
