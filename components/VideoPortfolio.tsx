'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import VideoModal, { VideoData } from './VideoModal';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const fallbackVideos: VideoData[] = [];

export default function VideoPortfolio() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          let fetchedVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          fetchedVideos = fetchedVideos.filter(v => v.category !== 'Snippet' && v.category !== 'Live');
          fetchedVideos.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
          });
          setVideos(fetchedVideos.slice(0, 4));
        } else {
          setVideos(fallbackVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section id="work" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4">
              Наши <span className="text-orange-500">Работы</span>
            </h2>
            {/* <p className="text-gray-400 max-w-xl font-light">
              Тщательно отобранная коллекция наших последних музыкальных клипов, live-сессий и визуальных проектов для артистов со всего мира.
            </p> */}
          </div>
          <Link href="/works" className="px-6 py-3 border border-white/20 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm text-center">
            Больше Видео
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-white">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedVideo(video)}
                className="group relative aspect-video overflow-hidden bg-zinc-900 cursor-pointer rounded-sm">
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                  <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center backdrop-blur-sm">
                    <Play className="text-white ml-1" size={24} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-semibold">
                      {video.category}
                    </span>
                    <span className="w-8 h-[1px] bg-white/30" />
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-wider mb-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-300 text-sm font-light">
                    {video.artist}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
