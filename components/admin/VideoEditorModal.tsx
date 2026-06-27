'use client';

import { useState, useEffect } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';
import { VideoData } from '@/lib/supabase';

interface VideoEditorModalProps {
  video: Partial<VideoData> | null;
  activeTab: 'videos' | 'snippets' | 'lives' | 'photos' | 'files';
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  videoImageFile: File | null;
  videoFile: File | null;
  setVideoImageFile: (file: File | null) => void;
  setVideoFile: (file: File | null) => void;
  setEditingVideo: (video: Partial<VideoData> | null) => void;
}

export function VideoEditorModal({
  video,
  activeTab,
  onClose,
  onSave,
  isSaving,
  videoImageFile,
  videoFile,
  setVideoImageFile,
  setVideoFile,
  setEditingVideo,
}: VideoEditorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const computedImagePreview = (() => {
    if (videoImageFile) {
      return URL.createObjectURL(videoImageFile);
    }
    if (video?.image) {
      return video.image;
    }
    return null;
  })();

  const computedVideoPreview = (() => {
    if (videoFile) {
      return URL.createObjectURL(videoFile);
    }
    if (video?.videoUrl) {
      return video.videoUrl;
    }
    return null;
  })();

  useEffect(() => {
  }, [videoFile, video?.videoUrl]);

  useEffect(() => {
    return () => {
      if (computedImagePreview) URL.revokeObjectURL(computedImagePreview);
      if (computedVideoPreview) URL.revokeObjectURL(computedVideoPreview);
    };
  }, [computedImagePreview, computedVideoPreview]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display uppercase">{video.id ? 'Edit Video' : 'Add Video'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Title" value={video.title || ''} onChange={e => setEditingVideo({...video, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
          <input placeholder="Artist" value={video.artist || ''} onChange={e => setEditingVideo({...video, artist: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          {activeTab !== 'snippets' && activeTab !== 'lives' && (
            <input placeholder="Category" value={video.category || ''} onChange={e => setEditingVideo({...video, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          )}
          
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-400">Thumbnail Image</label>
            <div className="flex gap-4 items-center">
              {computedImagePreview && (
                <img src={computedImagePreview} alt="Preview" className="w-24 h-16 object-cover rounded-sm" />
              )}
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-sm flex items-center gap-2 transition-colors text-sm">
                <UploadCloud size={18} /> Choose Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setVideoImageFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-400">Video File</label>
            <div className="flex gap-4 items-center">
              {computedVideoPreview && (
                <span className="text-sm text-green-400 truncate max-w-[200px]">
                  {videoFile ? videoFile.name : 'Video uploaded'}
                </span>
              )}
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-sm flex items-center gap-2 transition-colors text-sm">
                <UploadCloud size={18} /> Choose Video
                <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && setVideoFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <input placeholder="Year" type="number" value={video.year || ''} onChange={e => setEditingVideo({...video, year: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Director" value={video.director || ''} onChange={e => setEditingVideo({...video, director: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Cinematographer" value={video.cinematographer || ''} onChange={e => setEditingVideo({...video, cinematographer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Editor" value={video.editor || ''} onChange={e => setEditingVideo({...video, editor: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Producer" value={video.producer || ''} onChange={e => setEditingVideo({...video, producer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
          <textarea placeholder="Description" value={video.description || ''} onChange={e => setEditingVideo({...video, description: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2 h-32" />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white">Cancel</button>
          <button type="submit" onClick={onSave} disabled={isSaving} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm flex items-center gap-2 disabled:opacity-50">
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}