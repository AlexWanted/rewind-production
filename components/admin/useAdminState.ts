'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseAdminStateReturn {
  videos: any[];
  snippets: any[];
  lives: any[];
  photos: any[];
  files: any[];
  activeTab: string;
  loading: boolean;
  isSaving: boolean;
  isSavingOrder: boolean;
  editingVideo: any;
  videoImageFile: File | null;
  videoFile: File | null;
  editingPhoto: any;
  photoFiles: File[];
  photoPreviews: string[];

  setVideos: (videos: any[]) => void;
  setSnippets: (snippets: any[]) => void;
  setLives: (lives: any[]) => void;
  setPhotos: (photos: any[]) => void;
  setFiles: (files: any[]) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setIsSavingOrder: (saving: boolean) => void;
  setEditingVideo: (video: any) => void;
  setVideoImageFile: (file: File | null) => void;
  setVideoFile: (file: File | null) => void;
  setEditingPhoto: (photo: any) => void;
  setPhotoFiles: (files: File[]) => void;
  setPhotoPreviews: (previews: string[]) => void;
}

export function useAdminState() {
  const [videos, setVideos] = useState<any[]>([]);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [lives, setLives] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [videoImageFile, setVideoImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  return {
    // State
    videos,
    snippets,
    lives,
    photos,
    files,
    activeTab,
    loading,
    isSaving,
    isSavingOrder,
    editingVideo,
    videoImageFile,
    videoFile,
    editingPhoto,
    photoFiles,
    photoPreviews,
    // Setters
    setVideos,
    setSnippets,
    setLives,
    setPhotos,
    setFiles,
    setActiveTab,
    setLoading,
    setIsSaving,
    setIsSavingOrder,
    setEditingVideo,
    setVideoImageFile,
    setVideoFile,
    setEditingPhoto,
    setPhotoFiles,
    setPhotoPreviews,
  };
}