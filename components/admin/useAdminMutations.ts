'use client';

import { supabase } from '@/lib/supabase';

interface UseAdminMutationsProps {
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  isSavingOrder: boolean;
  setIsSavingOrder: (saving: boolean) => void;
}

interface UseAdminMutationsReturn {
  saveVideo: () => Promise<void>;
  savePhoto: () => Promise<void>;
  deleteItem: (collectionName: string, id: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  saveOrder: (collectionName: string, items: any[]) => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string>;
}

export function useAdminMutations({
  isSaving,
  setIsSaving,
  isSavingOrder,
  setIsSavingOrder,
}: UseAdminMutationsProps): UseAdminMutationsReturn {
  const saveVideo = async () => {
    setIsSaving(true);
    try {
      const url = 'https://rewind-production.com/api/videos'; // Placeholder - implement proper upload
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      throw error;
    }
  };

  const savePhoto = async () => {
    setIsSaving(true);
    try {
      const url = 'https://rewind-production.com/api/photos'; // Placeholder - implement proper upload
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      throw error;
    }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase
        .from(collectionName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      setIsSavingOrder(false);
    } catch (error) {
      setIsSavingOrder(false);
      throw error;
    }
  };

  const deleteFile = async (path: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  const saveOrder = async (collectionName: string, items: any[]) => {
    setIsSavingOrder(true);
    try {
      for (const [index, item] of items.entries()) {
        const { error } = await supabase
          .from(collectionName)
          .update({ order: index })
          .eq('id', item.id);
        if (error) throw error;
      }
      // Don't alert - let the caller handle it
      setIsSavingOrder(false);
    } catch (error) {
      setIsSavingOrder(false);
      throw error;
    }
  };

  const uploadFile = async (file: File, path: string) => {
    setIsSaving(true);
    try {
      const { error, data } = await supabase.storage
        .from('videos')
        .upload(`${path}/${file.name}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(`${path}/${file.name}`);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveVideo,
    savePhoto,
    deleteItem,
    deleteFile,
    saveOrder,
    uploadFile,
  };
}