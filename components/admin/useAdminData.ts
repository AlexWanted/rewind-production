'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

      setVideos((videosData.data || []).map((item: any) => ({ ...item, order: item.order ?? 999 })));
      setPhotos((photosData.data || []).map((item: any) => ({ ...item, order: item.order ?? 999 })));

      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData.files || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Don't alert on fetch errors - let the UI handle it
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (loading && !hasFetched) {
      fetchData();
    }
  }, [loading, hasFetched]);

  return { fetchData };
}