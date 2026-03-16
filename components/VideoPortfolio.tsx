'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import VideoModal, { VideoData } from './VideoModal';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const fallbackVideos: VideoData[] = [
  {
    id: 1,
    title: 'Neon Dreams',
    artist: 'The Midnight Echoes',
    category: 'Music Video',
    image: 'https://picsum.photos/seed/neon/800/600',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    year: 2025,
    director: 'Alex Mercer',
    cinematographer: 'Jordan Lee',
    editor: 'Sam Rivera',
    producer: 'Elena Rostova',
    description: 'A cyberpunk-inspired visual journey through the neon-lit streets of a futuristic metropolis. Shot on location in Tokyo.'
  },
  {
    id: 2,
    title: 'Acoustic Session',
    artist: 'Sarah Jenkins',
    category: 'Live Performance',
    image: 'https://picsum.photos/seed/acoustic/800/600',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    year: 2024,
    director: 'Marcus Chen',
    cinematographer: 'David Smith',
    editor: 'Marcus Chen',
    producer: 'Sarah Jenkins',
    description: 'An intimate, one-take acoustic performance recorded live at Soundscape Studios.'
  },
  {
    id: 3,
    title: 'Rhythm & Flow',
    artist: 'DJ Pulse',
    category: 'Tour Visuals',
    image: 'https://picsum.photos/seed/dj/800/600',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    year: 2025,
    director: 'Elena Rostova',
    cinematographer: 'Michael Chang',
    editor: 'Chris Vance',
    producer: 'Pulse Records',
    description: "High-energy, abstract tour visuals created for DJ Pulse's 2025 World Tour."
  },
  {
    id: 4,
    title: 'Urban Symphony',
    artist: 'City Lights',
    category: 'Music Video',
    image: 'https://picsum.photos/seed/city/800/600',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    year: 2023,
    director: 'Sam Rivera',
    cinematographer: 'Jordan Lee',
    editor: 'Alex Mercer',
    producer: 'Urban Sound',
    description: 'A gritty, fast-paced exploration of city life, synchronized perfectly to the driving beat of City Lights.'
  },
];

export default function VideoPortfolio() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
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
              Featured <span className="text-orange-500">Work</span>
            </h2>
            <p className="text-gray-400 max-w-xl font-light">
              A curated selection of our latest music videos, live sessions, and visual projects for artists across the globe.
            </p>
          </div>
          <Link href="/works" className="px-6 py-3 border border-white/20 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm text-center">
            View All Projects
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-white">Loading...</div>
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
                className="group relative aspect-video overflow-hidden bg-zinc-900 cursor-pointer rounded-sm"
              >
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
