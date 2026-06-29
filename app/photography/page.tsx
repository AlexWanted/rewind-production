'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, LazyMotion, motion } from 'motion/react';
import Image from 'next/image';
import PhotoModal, { PhotoData } from '@/components/PhotoModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, toPhotoData } from '@/lib/supabase';
import { presignUrls, extractKeyFromUrl } from '@/lib/presign';

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('"order"', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const fetchedPhotos = data.map(toPhotoData);
          fetchedPhotos.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
          });

          const allKeys: string[] = [];
          fetchedPhotos.forEach(p => {
            (p.images || []).forEach(img => {
              const key = extractKeyFromUrl(img);
              if (key) allKeys.push(key);
            });
          });

          if (allKeys.length > 0) {
            const presigned = await presignUrls(allKeys);
            fetchedPhotos.forEach(p => {
              p.images = (p.images || []).map(img => {
                const key = extractKeyFromUrl(img);
                return (key && presigned[key]) ? presigned[key] : img;
              });
            });
          }

          setPhotos(fetchedPhotos);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <main className="bg-zinc-950 min-h-screen text-white">
      <Navbar />
      
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4">
              Наши <span className="text-orange-500">Фотосеты</span>
            </h1>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-white">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}