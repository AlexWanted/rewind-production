'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import PhotoModal, { PhotoData } from './PhotoModal';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const fallbackPhotos: PhotoData[] = [];

export default function PhotoPortfolio() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, 'photos'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          let fetchedPhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          fetchedPhotos.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
          });
          setPhotos(fetchedPhotos.slice(0, 4));
        } else {
          setPhotos(fallbackPhotos);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos(fallbackPhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <section id="photos" className="py-24 bg-zinc-950 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-display font-medium uppercase tracking-normal mb-4">
              Наши <span className="text-orange-500 drop-shadow-[0px_0px_23px_rgba(255,89,0,0.6)]">Фотосеты</span>
            </h2>
            {/* <p className="text-gray-400 max-w-xl font-light">
              Запечатлеваем сырую энергию живых выступлений, интимные студийные сессии и яркие портреты артистов.
            </p> */}
          </div>
          <Link href="/photography" className="px-6 py-3 border border-white/20 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm text-center">
            Больше Фотографий
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-white">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative group overflow-hidden bg-zinc-900 rounded-sm cursor-pointer`}>
                <Image
                  src={photo.images?.[0] || photo.src || ''}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"/>
                {/* Легкое затемнение при наведении, без кнопки View */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
