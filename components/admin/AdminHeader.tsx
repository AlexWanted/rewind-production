'use client';

import { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-12">
      <h1 className="text-4xl font-display uppercase">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-400">{user?.email}</span>
        <button type="button" onClick={onLogout} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}