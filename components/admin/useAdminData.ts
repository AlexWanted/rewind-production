'use client';

import { useEffect, useState } from 'react';
import { supabase, toVideoData, toPhotoData } from '@/lib/supabase';
import { presignUrls, extractKeyFromUrl } from '@/lib/presign';

interface UseAdminDataProps {
  videos: any[];
  setVideos: (videos: any[]) => void;
  snippets: any[];
  setSnippets: (snippets: any[]) => void;
  lives: any[];
  setLives: (lives: any[]) => void;
  photos: any[];
  setPhotos: (photos: any[]) => void;
  files: any[];
  setFiles: (files: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function useAdminData({ videos, setVideos, snippets, setSnippets, lives, setLives, photos, setPhotos, files, setFiles, loading, setLoading }: UseAdminDataProps) {
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [videosData, photosData, filesResponse] = await Promise.all([
        supabase.from('videos').select('*').order('"order"', { ascending: true }).order('created_at', { ascending: false }),
        supabase.from('photos').select('*').order('"order"', { ascending: true }).order('created_at', { ascending: false }),
        fetch('/api/files'),
      ]);

      if (videosData.error) throw videosData.error;
      if (photosData.error) throw photosData.error;

      // Normalize video URLs like public pages do
      const normalizedVideos = (videosData.data || []).map((item: any) => {
        const v = toVideoData(item);
        v.order = v.order ?? 999;
        return v;
      });

      // Normalize photo URLs like public pages do
      const normalizedPhotos = (photosData.data || []).map((item: any) => {
        const p = toPhotoData(item);
        p.order = p.order ?? 999;
        return p;
      });

      // Presign URLs for videos
      const videoKeys: string[] = [];
      normalizedVideos.forEach(v => {
        const imgKey = extractKeyFromUrl(v.image);
        if (imgKey) videoKeys.push(imgKey);
        const vidKey = extractKeyFromUrl(v.videoUrl);
        if (vidKey) videoKeys.push(vidKey);
      });

      // Presign URLs for photos
      const photoKeys: string[] = [];
      normalizedPhotos.forEach(p => {
        (p.images || []).forEach(img => {
          const key = extractKeyFromUrl(img);
          if (key) photoKeys.push(key);
        });
      });

      const allKeys = [...videoKeys, ...photoKeys];
      if (allKeys.length > 0) {
        // Batch presign requests because /api/presign has a 50-key limit
        let presigned: Record<string, string> = {};
        const chunkSize = 50;
        for (let i = 0; i < allKeys.length; i += chunkSize) {
          const chunk = allKeys.slice(i, i + chunkSize);
          const result = await presignUrls(chunk);
          presigned = { ...presigned, ...result };
        }

        normalizedVideos.forEach(v => {
          const imgKey = extractKeyFromUrl(v.image);
          if (imgKey && presigned[imgKey]) v.image = presigned[imgKey];
          const vidKey = extractKeyFromUrl(v.videoUrl);
          if (vidKey && presigned[vidKey]) v.videoUrl = presigned[vidKey];
        });

        normalizedPhotos.forEach(p => {
          p.images = (p.images || []).map(img => {
            const key = extractKeyFromUrl(img);
            return (key && presigned[key]) ? presigned[key] : img;
          });
        });
      }

      setVideos(normalizedVideos);
      setPhotos(normalizedPhotos);

      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData.files || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  return { fetchData };
}