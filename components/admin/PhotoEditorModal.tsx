'use client';

import { useState, useEffect } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';
import { PhotoData } from '@/lib/supabase';

interface PhotoEditorModalProps {
  photo: Partial<PhotoData> | null;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  photoFiles: File[];
  photoPreviews: string[];
  setPhotoFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  setPhotoPreviews: (previews: string[] | ((prev: string[]) => string[])) => void;
  setEditingPhoto: (photo: Partial<PhotoData> | null) => void;
  removeNewPhoto: (index: number) => void;
  removeExistingPhoto: (index: number) => void;
}

export function PhotoEditorModal({
  photo,
  onClose,
  onSave,
  isSaving,
  photoFiles,
  photoPreviews,
  setPhotoFiles,
  setPhotoPreviews,
  setEditingPhoto,
  removeNewPhoto,
  removeExistingPhoto,
}: PhotoEditorModalProps) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display uppercase">{photo.id ? 'Edit Photo' : 'Add Photo'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-400">Images</label>
            
            <div className="flex flex-wrap gap-4 mb-2">
              {/* Existing Images */}
              {photo.images?.map((url, idx) => (
                <div key={`ext-${idx}`} className="relative group">
                  <img src={url} alt={`Preview of existing image ${idx}`} className="w-24 h-24 object-cover rounded-sm" aria-label={`Existing image ${idx}`} />
                  <button type="button" onClick={() => removeExistingPhoto(idx)} aria-label={`Remove existing image ${idx}`} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
              ))}
              {/* New Images */}
              {photoPreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="relative group">
                  <img src={url} alt={`Preview of new image ${idx}`} className="w-24 h-24 object-cover rounded-sm border-2 border-orange-500" aria-label={`New image ${idx}`} />
                  <button type="button" onClick={() => removeNewPhoto(idx)} aria-label={`Remove new image ${idx}`} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
              ))}
            </div>

            <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-sm flex items-center justify-center gap-2 transition-colors text-sm w-full">
              <UploadCloud size={18} /> Add Images
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setPhotoFiles((prev: File[]) => [...prev, ...files]);
                  const previews = files.map(f => URL.createObjectURL(f));
                  setPhotoPreviews((prev: string[]) => [...prev, ...previews]);
                }
              }} />
            </label>
          </div>

          <input placeholder="Alt Text" value={photo.alt || ''} onChange={e => setEditingPhoto({...photo, alt: e.target.value})} aria-label="Alt Text" className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
          <input placeholder="Photographer" value={photo.photographer || ''} onChange={e => setEditingPhoto({...photo, photographer: e.target.value})} aria-label="Photographer" className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Location" value={photo.location || ''} onChange={e => setEditingPhoto({...photo, location: e.target.value})} aria-label="Location" className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Date (e.g., March 2025)" value={photo.date || ''} onChange={e => setEditingPhoto({...photo, date: e.target.value})} aria-label="Date" className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
          <input placeholder="Camera" value={photo.camera || ''} onChange={e => setEditingPhoto({...photo, camera: e.target.value})} aria-label="Camera" className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
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