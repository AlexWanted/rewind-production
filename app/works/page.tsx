'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, LazyMotion, motion } from 'motion/react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import VideoModal, { VideoData } from '@/components/VideoModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, toVideoData, PUBLIC_VIDEO_FIELDS } from '@/lib/supabase';
import { presignUrls, extractKeyFromUrl } from '@/lib/presign';

export default function WorksPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select(PUBLIC_VIDEO_FIELDS)
          .order('"order"', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const fetchedVideos = data.map(toVideoData);

          const allKeys: string[] = [];
          fetchedVideos.forEach(v => {
            const imgKey = extractKeyFromUrl(v.image);
            if (imgKey) allKeys.push(imgKey);
            const vidKey = extractKeyFromUrl(v.videoUrl);
            if (vidKey) allKeys.push(vidKey);
          });

          if (allKeys.length > 0) {
            const presigned = await presignUrls(allKeys);
            fetchedVideos.forEach(v => {
              const imgKey = extractKeyFromUrl(v.image);
              if (imgKey && presigned[imgKey]) v.image = presigned[imgKey];
              const vidKey = extractKeyFromUrl(v.videoUrl);
              if (vidKey && presigned[vidKey]) v.videoUrl = presigned[vidKey];
            });
          }

          setVideos(fetchedVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6">
          <section id="musicvideo" className="mb-16">
            <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4">
              Наши <span className="text-orange-500">Клипы</span>
            </h1>
             <p className="text-gray-400 max-w-xl font-light">
              Полноценные музыкальные видео.
            </p>
          </section>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-white">Загрузка...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {videos.filter(v => v.category !== 'Snippet' && v.category !== 'Live').map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative aspect-video overflow-hidden bg-zinc-900 cursor-pointer rounded-sm">
                    <Image
                      src={video.image}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
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
                        <span className="w-8 h-px bg-white/30" />
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

              {videos.some(v => v.category === 'Snippet') && (
                <>
                  <section id="snippet" className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter mb-4">
                      Короткие <span className="text-orange-500">Сниппеты</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl font-light">
                      Короткие видео, демонстрирующие часть трека.
                    </p>
                  </section>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24">
                    {videos.filter(v => v.category === 'Snippet').map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onClick={() => setSelectedVideo(video)}
                        className="group relative aspect-9/16 overflow-hidden bg-zinc-900 cursor-pointer rounded-sm">
<Image
                           src={video.image}
                           alt={video.title}
                           fill
                           sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                           className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                           referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                          <div className="w-12 h-12 rounded-full bg-orange-500/90 flex items-center justify-center backdrop-blur-sm">
                            <Play className="text-white ml-1" size={20} />
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-semibold">
                              Snippet
                            </span>
                            <span className="w-8 h-px bg-white/30" />
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
                </>
              )}

              {videos.some(v => v.category === 'Live') && (
                <>
                  <section id="live" className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter mb-4">
                      Концертные <span className="text-orange-500">Лайвы</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl font-light">
                      Концертные выступления и студийные записи.
                    </p>
                  </section>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {videos.filter(v => v.category === 'Live').map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                          <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center backdrop-blur-sm">
                            <Play className="text-white ml-1" size={24} />
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-2xl font-display uppercase tracking-wider mb-1">
                            {video.artist}
                          </h3>
                          <p className="text-gray-300 text-sm font-light">
                            {video.title}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}