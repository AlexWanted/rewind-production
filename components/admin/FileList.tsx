'use client';

import { useState } from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';

interface FileData {
  name: string;
  path: string;
  size: number;
  createdAt: string;
}

interface FileListProps {
  files: FileData[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (path: string) => Promise<void>;
  onRefresh: () => void;
}

export function FileList({ files, onUpload, onDelete, onRefresh }: FileListProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        await onUpload(e.target.files[0]);
        onRefresh();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      } finally {
        setUploading(false);
        if (e.target) e.target.value = '';
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light capitalize">Files</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold cursor-pointer">
          <UploadCloud size={16} /> Upload File
          <input 
            type="file" 
            id="file-upload" 
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
            aria-label="Upload file"
          />
        </label>
      </div>
      <div className="grid gap-4">
        {files.map((file) => (
          <div key={file.path} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm">
            <div className="flex items-center gap-4">
              {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={file.path} alt={file.name} width={96} height={64} loading="lazy" className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              ) : file.name.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={file.path} width={96} height={64} aria-label={`Preview of ${file.name}`} className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              ) : (
                <div className="w-24 h-16 bg-zinc-800 rounded-sm flex items-center justify-center text-xs text-gray-500" role="img" aria-label="File icon">FILE</div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{file.name}</h3>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {new Date(file.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">{file.path}</p>
              </div>
            </div>
            <button type="button" onClick={() => onDelete(file.path)} aria-label={`Delete ${file.name}`} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-gray-500 text-center py-8">No files uploaded yet.</div>
        )}
      </div>
    </div>
  );
}