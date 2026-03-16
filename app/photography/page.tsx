'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import PhotoModal, { PhotoData } from '@/components/PhotoModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
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
              All <span className="text-orange-500">Photography</span>
            </h1>
            <p className="text-gray-400 max-w-xl font-light">
              Explore our complete archive of live performances, intimate studio sessions, and striking artist portraits.
            </p>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-white">Loading...</div>
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
                  className={`relative group overflow-hidden bg-zinc-900 rounded-sm cursor-pointer ${photo.span}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
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
