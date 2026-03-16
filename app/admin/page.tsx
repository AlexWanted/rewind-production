'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { VideoData } from '@/components/VideoModal';
import { PhotoData } from '@/components/PhotoModal';
import { LogOut, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  
  const [editingVideo, setEditingVideo] = useState<Partial<VideoData> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoData> | null>(null);

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
      const videosSnapshot = await getDocs(query(collection(db, 'videos'), orderBy('createdAt', 'desc')));
      const photosSnapshot = await getDocs(query(collection(db, 'photos'), orderBy('createdAt', 'desc')));
      
      setVideos(videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      setPhotos(photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Check console.");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const saveVideo = async () => {
    if (!editingVideo) return;
    try {
      const data = {
        title: editingVideo.title || '',
        artist: editingVideo.artist || '',
        category: editingVideo.category || '',
        image: editingVideo.image || '',
        videoUrl: editingVideo.videoUrl || '',
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
        await addDoc(collection(db, 'videos'), { ...data, createdAt: Timestamp.now() });
      }
      setEditingVideo(null);
      fetchData();
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Error saving video. Ensure all fields are filled correctly.");
    }
  };

  const savePhoto = async () => {
    if (!editingPhoto) return;
    try {
      const data = {
        src: editingPhoto.src || '',
        alt: editingPhoto.alt || '',
        span: editingPhoto.span || 'col-span-1 row-span-1',
        photographer: editingPhoto.photographer || '',
        location: editingPhoto.location || '',
        date: editingPhoto.date || '',
        camera: editingPhoto.camera || '',
      };

      if (editingPhoto.id) {
        await updateDoc(doc(db, 'photos', String(editingPhoto.id)), data);
      } else {
        await addDoc(collection(db, 'photos'), { ...data, createdAt: Timestamp.now() });
      }
      setEditingPhoto(null);
      fetchData();
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Error saving photo. Ensure all fields are filled correctly.");
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display uppercase mb-6">Admin Access</h1>
          <button 
            onClick={handleLogin}
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
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display uppercase">Content Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.email}</span>
            <button onClick={handleLogout} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4">
          <button 
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'videos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}
          >
            Videos
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-2 uppercase tracking-widest text-sm font-semibold transition-colors ${activeTab === 'photos' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}
          >
            Photos
          </button>
        </div>

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Video Projects</h2>
              <button 
                onClick={() => setEditingVideo({})}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold"
              >
                <Plus size={16} /> Add Video
              </button>
            </div>

            <div className="grid gap-4">
              {videos.map(video => (
                <div key={video.id} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm">
                  <div className="flex items-center gap-4">
                    <img src={video.image} alt={video.title} className="w-24 h-16 object-cover rounded-sm" />
                    <div>
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                      <p className="text-sm text-gray-400">{video.artist} • {video.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingVideo(video)} className="p-2 hover:bg-zinc-800 rounded-sm text-blue-400"><Edit2 size={18} /></button>
                    <button onClick={() => deleteItem('videos', String(video.id))} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Photography</h2>
              <button 
                onClick={() => setEditingPhoto({})}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold"
              >
                <Plus size={16} /> Add Photo
              </button>
            </div>

            <div className="grid gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm">
                  <div className="flex items-center gap-4">
                    <img src={photo.src} alt={photo.alt} className="w-16 h-16 object-cover rounded-sm" />
                    <div>
                      <h3 className="font-semibold text-lg">{photo.alt}</h3>
                      <p className="text-sm text-gray-400">{photo.location} • {photo.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPhoto(photo)} className="p-2 hover:bg-zinc-800 rounded-sm text-blue-400"><Edit2 size={18} /></button>
                    <button onClick={() => deleteItem('photos', String(photo.id))} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Editor Modal */}
        {editingVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display uppercase">{editingVideo.id ? 'Edit Video' : 'New Video'}</h2>
                <button onClick={() => setEditingVideo(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Title" value={editingVideo.title || ''} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Artist" value={editingVideo.artist || ''} onChange={e => setEditingVideo({...editingVideo, artist: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Category" value={editingVideo.category || ''} onChange={e => setEditingVideo({...editingVideo, category: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Image URL" value={editingVideo.image || ''} onChange={e => setEditingVideo({...editingVideo, image: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Video URL" value={editingVideo.videoUrl || ''} onChange={e => setEditingVideo({...editingVideo, videoUrl: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Year" type="number" value={editingVideo.year || ''} onChange={e => setEditingVideo({...editingVideo, year: Number(e.target.value)})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Director" value={editingVideo.director || ''} onChange={e => setEditingVideo({...editingVideo, director: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Cinematographer" value={editingVideo.cinematographer || ''} onChange={e => setEditingVideo({...editingVideo, cinematographer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Editor" value={editingVideo.editor || ''} onChange={e => setEditingVideo({...editingVideo, editor: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Producer" value={editingVideo.producer || ''} onChange={e => setEditingVideo({...editingVideo, producer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <textarea placeholder="Description" value={editingVideo.description || ''} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2 h-32" />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setEditingVideo(null)} className="px-6 py-3 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={saveVideo} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm flex items-center gap-2"><Save size={18} /> Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Editor Modal */}
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 p-8 rounded-sm w-full max-w-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display uppercase">{editingPhoto.id ? 'Edit Photo' : 'New Photo'}</h2>
                <button onClick={() => setEditingPhoto(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Image Source URL" value={editingPhoto.src || ''} onChange={e => setEditingPhoto({...editingPhoto, src: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Alt Text / Title" value={editingPhoto.alt || ''} onChange={e => setEditingPhoto({...editingPhoto, alt: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Grid Span (e.g., col-span-1 row-span-2)" value={editingPhoto.span || ''} onChange={e => setEditingPhoto({...editingPhoto, span: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm col-span-2" />
                <input placeholder="Photographer" value={editingPhoto.photographer || ''} onChange={e => setEditingPhoto({...editingPhoto, photographer: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Location" value={editingPhoto.location || ''} onChange={e => setEditingPhoto({...editingPhoto, location: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Date (e.g., Oct 2025)" value={editingPhoto.date || ''} onChange={e => setEditingPhoto({...editingPhoto, date: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
                <input placeholder="Camera" value={editingPhoto.camera || ''} onChange={e => setEditingPhoto({...editingPhoto, camera: e.target.value})} className="bg-zinc-950 border border-zinc-800 p-3 rounded-sm" />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setEditingPhoto(null)} className="px-6 py-3 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={savePhoto} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-sm flex items-center gap-2"><Save size={18} /> Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
