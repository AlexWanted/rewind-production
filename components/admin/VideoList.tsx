'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, GripVertical, Plus } from 'lucide-react';
import { Reorder } from 'motion/react';
import { VideoData } from '@/lib/supabase';

interface VideoListProps {
  items: VideoData[];
  onEdit: (item: VideoData) => void;
  onDelete: (id: string) => void;
  onReorder: (items: VideoData[]) => void;
  activeTab: 'videos' | 'snippets' | 'lives';
  onSaveOrder: (items: VideoData[]) => void;
  isSavingOrder: boolean;
}

export function VideoList({ 
  items, 
  onEdit, 
  onDelete, 
  onReorder, 
  activeTab,
  onSaveOrder,
  isSavingOrder
}: VideoListProps) {
  const tabLabel = activeTab === 'videos' ? 'Videos' : activeTab === 'snippets' ? 'Snippets' : 'Lives';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light capitalize">{tabLabel}</h2>
        <div className="flex gap-2">
<button
            type="button"
            onClick={() => onSaveOrder(items)}
            disabled={isSavingOrder}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors rounded-sm text-sm font-semibold disabled:opacity-50"
          >
            Save Order
          </button>
<button
            type="button"
            onClick={() => onEdit({} as VideoData)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-sm text-sm font-semibold"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="grid gap-4">
        {items.map(item => (
          <Reorder.Item key={item.id} value={item} className="bg-zinc-900 p-4 flex justify-between items-center rounded-sm cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-4">
              <GripVertical className="text-gray-600" />
              <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded-sm bg-zinc-800" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.artist} {item.category ? `· ${item.category}` : ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onPointerDown={(e) => e.stopPropagation()} type="button" onClick={() => onEdit(item)} className="p-2 hover:bg-zinc-800 rounded-sm text-blue-400"><Edit2 size={18} /></button>
              <button onPointerDown={(e) => e.stopPropagation()} type="button" onClick={() => onDelete(String(item.id))} className="p-2 hover:bg-zinc-800 rounded-sm text-red-400"><Trash2 size={18} /></button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}