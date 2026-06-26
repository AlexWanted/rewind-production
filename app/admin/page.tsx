'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, writeBatch } from 'firebase/firestore';
import { VideoData } from '@/components/VideoModal';
import { PhotoData } from '@/components/PhotoModal';
import { LogOut, Plus, Edit2, Trash2, X, Save, UploadCloud, GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'snippets' | 'lives' | 'photos' | 'files'>('videos');
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [snippets, setSnippets] = useState<VideoData[]>([]);
  const [lives, setLives] = useState<VideoData[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  
  const [editingVideo, setEditingVideo] = useState<Partial<VideoData> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoData> | null>(null);
  
  // Deferred upload states
  const [videoImageFile, setVideoImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const videosSnapshot = await getDocs(query(collection(db, 'videos')));
      const photosSnapshot = await getDocs(query(collection(db, 'photos')));
      const filesResponse = await fetch('/api/files');
      
      const allVideos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      allVideos.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
      });

      setVideos(allVideos.filter(v => v.category !== 'Snippet' && v.category !== 'Live'));
      setSnippets(allVideos.filter(v => v.category === 'Snippet'));
      setLives(allVideos.filter(v => v.category === 'Live'));

      const allPhotos = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      allPhotos.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
      });
      setPhotos(allPhotos);

      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData.files || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Check console.");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = () => signOut(auth);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
	  const errorData = await res.json();
	  throw new Error(errorData.error || 'Upload failed');
	}
    const data = await res.json();
    return data.url;
  };

  const saveVideo = async () => {
    if (!editingVideo) return;
    setIsSaving(true);
    try {
      let imageUrl = editingVideo.image || '';
      let videoUrl = editingVideo.videoUrl || '';

      if (videoImageFile) imageUrl = await uploadFile(videoImageFile, 'videos');
      if (videoFile) videoUrl = await uploadFile(videoFile, 'videos');

      const data = {
        title: editingVideo.title || '',
        artist: editingVideo.artist || '',
        category: activeTab === 'snippets' ? 'Snippet' : activeTab === 'lives' ? 'Live' : (editingVideo.category || ''),
        image: imageUrl,
        videoUrl: videoUrl,
        year: Number(editingVideo.year) || new Date().getFullYear(),
        director: editingVideo.director || '',
        cinematographer: editingVideo.cinematographer || '',
        editor: editingVideo.editor || '',
        producer: editingVideo.producer || '',
        description: editingVideo.description || '',
      };

      if (editingVideo.id) {
        await updateDoc(doc(db, 'videos', String(editingVideo.id)), data);
      } else {
        await addDoc(collection(db, 'videos'), { ...data, order: 999, createdAt: Timestamp.now() });
      }
      closeVideoEditor();
      fetchData();
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Error saving video. Ensure all fields are filled correctly.");
    } finally {
      setIsSaving(false);
    }
  };

  const savePhoto = async () => {
    if (!editingPhoto) return;
    setIsSaving(true);
    try {
      // Upload new photos
      const newUrls = await Promise.all(photoFiles.map(f => uploadFile(f, 'photos')));
      const allImages = [...(editingPhoto.images || []), ...newUrls];

      const data = {
        images: allImages,
        alt: editingPhoto.alt || '',
        photographer: editingPhoto.photographer || '',
        location: editingPhoto.location || '',
        date: editingPhoto.date || '',
        camera: editingPhoto.camera || '',
      };

      if (editingPhoto.id) {
        await updateDoc(doc(db, 'photos', String(editingPhoto.id)), data);
      } else {
        await addDoc(collection(db, 'photos'), { ...data, order: 999, createdAt: Timestamp.now() });
      }
      closePhotoEditor();
      fetchData();
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Error saving photo. Ensure all fields are filled correctly.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteFile = async (path: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete file.');
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const saveOrder = async (collectionName: string, items: any[]) => {
    setIsSavingOrder(true);
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const docRef = doc(db, collectionName, String(item.id));
        batch.update(docRef, { order: index });
      });
      await batch.commit();
      alert('Order saved successfully!');
      fetchData();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const openVideoEditor = (video: Partial<VideoData> = {}) => {
    setEditingVideo(video);
    setVideoImageFile(null);
    setVideoFile(null);
  };

  const closeVideoEditor = () => {
    setEditingVideo(null);
    setVideoImageFile(null);
    setVideoFile(null);
  };

  const openPhotoEditor = (photo: Partial<PhotoData> = {}) => {
    // Migrate old src to images array for editing
    if (photo.src && (!photo.images || photo.images.length === 0)) {
      photo.images = [photo.src];
    }
    setEditingPhoto(photo);
    setPhotoFiles([]);
    setPhotoPreviews([]);
  };

  const closePhotoEditor = () => {
    setEditingPhoto(null);
    setPhotoFiles([]);
    setPhotoPreviews([]);
  };

  const handlePhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotoFiles(prev => [...prev, ...files]);
      const previews = files.map(f => URL.createObjectURL(f));
      setPhotoPreviews(prev => [...prev, ...previews]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    if (editingPhoto && editingPhoto.images) {
      const newImages = [...editingPhoto.images];
      newImages.splice(index, 1);
      setEditingPhoto({ ...editingPhoto, images: newImages });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Загрузка...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase mb-6">Доступ Администратора</h1>
          <button onClick={handleLogin} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm transition-colors">
            Войти через Google
          </button>
        </div>
      </div>
    );
  }

  const renderList = (items: any[], setItems: any, collectionName: string, onEdit: (item: any) => void) => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light capitalize">
          {activeTab === 'videos' ? 'Видео' : activeTab === 'snippets' ? 'Сниппеты' : activeTab === 'lives' ? 'Лайвы' : 'Фотосессии'}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => saveOrder(collectionName, items)}
            disabled={isSavingOrder}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors rounded-sm text-sm font-semibold disabled:opacity-50"
          >
            <Save size={16} /> Сохранить порядок
          </button>
          <button 
            onClick={() => onEdit({})}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold"
          >
            <Plus size={16} /> Добавить
          </button>
        </div>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="grid gap-4">
        {items.map(item => (
          <Reorder.Item key={item.id} value={item} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-4">
              <GripVertical className="text-gray-600" />
              <img src={item.image || item.images?.[0] || item.src} alt={item.title || item.alt} className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              <div>
                <h3 className="font-semibold text-lg">{item.title || item.alt}</h3>
                <p className="text-sm text-gray-400">{item.artist || item.location} {item.category ? `• ${item.category}` : ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(item)} className="p-2 hover:bg-zinc-800 rounded-sm text-blue-400"><Edit2 size={18} /></button>
              <button onPointerDown={(e) => e.stopPropagation()} onClick={() => deleteItem(collectionName, String(item.id))} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );

  const renderFiles = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light capitalize">Загруженные Файлы</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold cursor-pointer">
          <UploadCloud size={16} /> Загрузить файл
          <input 
            type="file" 
            className="hidden" 
            onChange={async (e) => {
              if (e.target.files && e.target.files.length > 0) {
                try {
                  await uploadFile(e.target.files[0], 'misc');
                  fetchData();
                } catch (error) {
                  console.error("Error uploading file:", error);
                  alert("Failed to upload file.");
                }
              }
            }} 
          />
        </label>
      </div>
      <div className="grid gap-4">
        {files.map((file, idx) => (
          <div key={idx} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm">
            <div className="flex items-center gap-4">
              {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={file.path} alt={file.name} className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              ) : file.name.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={file.path} className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              ) : (
                <div className="w-24 h-16 bg-zinc-800 rounded-sm flex items-center justify-center text-xs text-gray-500">Файл</div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{file.name}</h3>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} МБ • {new Date(file.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">{file.path}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteFile(file.path)} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-gray-500 text-center py-8">Файлы еще не загружены.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display uppercase">Управление Контентом</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.email}</span>
            <button onClick={handleLogout} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
          <button onClick={() => setActiveTab('videos')} className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'videos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>Видео</button>
          <button onClick={() => setActiveTab('snippets')} className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'snippets' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>Сниппеты</button>
          <button onClick={() => setActiveTab('lives')} className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'lives' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>Лайвы</button>
          <button onClick={() => setActiveTab('photos')} className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'photos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>Фотосессии</button>
          <button onClick={() => setActiveTab('files')} className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'files' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>Файлы</button>
        </div>

        {activeTab === 'videos' && renderList(videos, setVideos, 'videos', openVideoEditor)}
        {activeTab === 'snippets' && renderList(snippets, setSnippets, 'videos', openVideoEditor)}
        {activeTab === 'lives' && renderList(lives, setLives, 'videos', openVideoEditor)}
        {activeTab === 'photos' && renderList(photos, setPhotos, 'photos', openPhotoEditor)}
        {activeTab === 'files' && renderFiles()}

        {/* Video Editor Modal */}
        {editingVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display uppercase">{editingVideo.id ? 'Редактировать Видео' : 'Новое Видео'}</h2>
                <button onClick={closeVideoEditor} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Название" value={editingVideo.title || ''} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Артист" value={editingVideo.artist || ''} onChange={e => setEditingVideo({...editingVideo, artist: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                {activeTab !== 'snippets' && activeTab !== 'lives' && (
                  <input placeholder="Категория" value={editingVideo.category || ''} onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                )}
                
                <div className="col-span-2 flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Изображение (Обложка)</label>
                  <div className="flex gap-4 items-center">
                    {(videoImageFile || editingVideo.image) && (
                      <img src={videoImageFile ? URL.createObjectURL(videoImageFile) : editingVideo.image} alt="Preview" className="w-24 h-16 object-cover rounded-sm" />
                    )}
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-sm flex items-center gap-2 transition-colors text-sm">
                      <UploadCloud size={18} /> Выбрать Изображение
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setVideoImageFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Видео Файл</label>
                  <div className="flex gap-4 items-center">
                    {(videoFile || editingVideo.videoUrl) && (
                      <span className="text-sm text-green-400 truncate max-w-[200px]">
                        {videoFile ? videoFile.name : 'Видео загружено'}
                      </span>
                    )}
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-sm flex items-center gap-2 transition-colors text-sm">
                      <UploadCloud size={18} /> Выбрать Видео
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && setVideoFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <input placeholder="Год" type="number" value={editingVideo.year || ''} onChange={e => setEditingVideo({...editingVideo, year: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Режиссер" value={editingVideo.director || ''} onChange={e => setEditingVideo({...editingVideo, director: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Оператор-постановщик" value={editingVideo.cinematographer || ''} onChange={e => setEditingVideo({...editingVideo, cinematographer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Монтажер" value={editingVideo.editor || ''} onChange={e => setEditingVideo({...editingVideo, editor: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Продюсер" value={editingVideo.producer || ''} onChange={e => setEditingVideo({...editingVideo, producer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <textarea placeholder="Описание" value={editingVideo.description || ''} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2 h-32" />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={closeVideoEditor} className="px-6 py-3 text-gray-400 hover:text-white">Отмена</button>
                <button onClick={saveVideo} disabled={isSaving} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm flex items-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Editor Modal */}
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display uppercase">{editingPhoto.id ? 'Редактировать Фотосессию' : 'Новая Фотосессия'}</h2>
                <button onClick={closePhotoEditor} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Фотографии</label>
                  
                  <div className="flex flex-wrap gap-4 mb-2">
                    {/* Existing Images */}
                    {editingPhoto.images?.map((url, idx) => (
                      <div key={`ext-${idx}`} className="relative group">
                        <img src={url} alt="Preview" className="w-24 h-24 object-cover rounded-sm" />
                        <button onClick={() => removeExistingPhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ))}
                    {/* New Images */}
                    {photoPreviews.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative group">
                        <img src={url} alt="Preview" className="w-24 h-24 object-cover rounded-sm border-2 border-orange-500" />
                        <button onClick={() => removeNewPhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ))}
                  </div>

                  <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-sm flex items-center justify-center gap-2 transition-colors text-sm w-full">
                    <UploadCloud size={18} /> Добавить Фотографии
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoFiles} />
                  </label>
                </div>

                <input placeholder="Название Фотосессии" value={editingPhoto.alt || ''} onChange={e => setEditingPhoto({...editingPhoto, alt: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Фотограф" value={editingPhoto.photographer || ''} onChange={e => setEditingPhoto({...editingPhoto, photographer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Локация" value={editingPhoto.location || ''} onChange={e => setEditingPhoto({...editingPhoto, location: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Дата (например, Окт 2025)" value={editingPhoto.date || ''} onChange={e => setEditingPhoto({...editingPhoto, date: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Камера" value={editingPhoto.camera || ''} onChange={e => setEditingPhoto({...editingPhoto, camera: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={closePhotoEditor} className="px-6 py-3 text-gray-400 hover:text-white">Отмена</button>
                <button onClick={savePhoto} disabled={isSaving} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm flex items-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
