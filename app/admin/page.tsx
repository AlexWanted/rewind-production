'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdminState } from '@/components/admin/useAdminState';
import { useAdminMutations } from '@/components/admin/useAdminMutations';
import { useEditorState } from '@/components/admin/useEditorState';
import { useAdminData } from '@/components/admin/useAdminData';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { VideoList } from '@/components/admin/VideoList';
import { PhotoList } from '@/components/admin/PhotoList';
import { FileList } from '@/components/admin/FileList';
import { VideoEditorModal } from '@/components/admin/VideoEditorModal';
import { PhotoEditorModal } from '@/components/admin/PhotoEditorModal';

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/';
};

export default function AdminPage() {
  const {
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
  } = useAdminState();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user);
    };
    fetchUser();
  }, []);

  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    setAdminData({
      videos,
      setVideos,
      snippets,
      setSnippets,
      lives,
      setLives,
      photos,
      setPhotos,
      files,
      setFiles,
      loading,
      setLoading,
    });
  }, [videos, snippets, lives, photos, files, loading, setVideos, setSnippets, setLives, setPhotos, setFiles, setLoading]);

  const {
    saveVideo,
    savePhoto,
    deleteItem,
    deleteFile,
    saveOrder,
    uploadFile,
  } = useAdminMutations({
    isSaving,
    setIsSaving,
    isSavingOrder,
    setIsSavingOrder,
  });

const { getCurrentItems } = useEditorState({
    activeTab,
    videos,
    snippets,
    lives,
    photos,
    setVideos,
    setSnippets,
    setLives,
    setPhotos,
  });

  const handleSaveOrder = async () => {
    const collectionName = activeTab === 'photos' ? 'photos' : 'videos';
    saveOrder(collectionName, getCurrentItems());
  };

  const handleUploadFile = async (file: File) => {
    await uploadFile(file, 'misc');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase mb-6">Admin Access</h1>
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader user={user} onLogout={handleLogout} />

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'videos' && (
          <VideoList
            items={videos}
            onEdit={(video) => {
              setEditingVideo(video);
              setVideoImageFile(null);
              setVideoFile(null);
            }}
            onDelete={(id) => deleteItem('videos', id)}
            onReorder={setVideos}
            activeTab="videos"
            onSaveOrder={handleSaveOrder}
            isSavingOrder={isSavingOrder}
          />
        )}
        {activeTab === 'snippets' && (
          <VideoList
            items={snippets}
            onEdit={(video) => {
              setEditingVideo(video);
              setVideoImageFile(null);
              setVideoFile(null);
            }}
            onDelete={(id) => deleteItem('videos', id)}
            onReorder={setSnippets}
            activeTab="snippets"
            onSaveOrder={handleSaveOrder}
            isSavingOrder={isSavingOrder}
          />
        )}
        {activeTab === 'lives' && (
          <VideoList
            items={lives}
            onEdit={(video) => {
              setEditingVideo(video);
              setVideoImageFile(null);
              setVideoFile(null);
            }}
            onDelete={(id) => deleteItem('videos', id)}
            onReorder={setLives}
            activeTab="lives"
            onSaveOrder={handleSaveOrder}
            isSavingOrder={isSavingOrder}
          />
        )}
        {activeTab === 'photos' && (
          <PhotoList
            items={photos}
            onEdit={(photo) => {
              if ((photo as any).src && (!photo.images || photo.images.length === 0)) {
                photo.images = [(photo as any).src];
              }
              setEditingPhoto(photo);
              setPhotoFiles([]);
              setPhotoPreviews([]);
            }}
            onDelete={(id) => deleteItem('photos', id)}
            onReorder={setPhotos}
            onSaveOrder={handleSaveOrder}
            isSavingOrder={isSavingOrder}
          />
        )}
        {activeTab === 'files' && (
          <FileList
            files={files}
            onUpload={handleUploadFile}
            onDelete={deleteFile}
            onRefresh={() => {
              adminData && adminData({
                videos,
                setVideos,
                snippets,
                setSnippets,
                lives,
                setLives,
                photos,
                setPhotos,
                files,
                setFiles,
                loading,
                setLoading,
              });
            }}
          />
        )}

        <VideoEditorModal
          video={editingVideo}
          activeTab={activeTab as any}
          onClose={() => {
            setEditingVideo(null);
            setVideoImageFile(null);
            setVideoFile(null);
          }}
          onSave={saveVideo}
          isSaving={isSaving}
          videoImageFile={videoImageFile}
          videoFile={videoFile}
          setVideoImageFile={setVideoImageFile}
          setVideoFile={setVideoFile}
          setEditingVideo={setEditingVideo}
        />

        <PhotoEditorModal
          photo={editingPhoto}
          onClose={() => {
            setEditingPhoto(null);
            setPhotoFiles([]);
            setPhotoPreviews([]);
          }}
          onSave={savePhoto}
          isSaving={isSaving}
          photoFiles={photoFiles}
          photoPreviews={photoPreviews}
          setPhotoFiles={setPhotoFiles}
          setPhotoPreviews={setPhotoPreviews}
          setEditingPhoto={setEditingPhoto}
          removeNewPhoto={(index: number) => {
            setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
            setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
          }}
          removeExistingPhoto={(index: number) => {
            if (editingPhoto && editingPhoto.images) {
              const newImages = [...editingPhoto.images];
              newImages.splice(index, 1);
              setEditingPhoto({ ...editingPhoto, images: newImages });
            }
          }}
        />
      </div>
    </div>
  );
}