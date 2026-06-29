import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}

// Client-side Supabase (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Server-side Supabase (with service role key) - for admin operations
export const createAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Type definitions matching the Firestore schema
export interface VideoData {
  id: string;
  title: string;
  artist: string;
  category: string;
  image: string;
  videoUrl: string;
  year: number;
  director: string;
  cinematographer: string;
  editor: string;
  producer: string;
  description: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotoData {
  id: string;
  images: string[];
  alt: string;
  photographer: string;
  location: string;
  date: string;
  camera: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || 'https://s3.cloud.ru/bucket-8c74b8';

function normalizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Already a full URL (S3, FTP, etc.) - pass through
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle /uploads/... or uploads/... paths
  const cleanPath = url.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
  if (cleanPath !== url || url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return `${S3_PUBLIC_URL}/${cleanPath}`;
  }
  
  // If it's a relative path without uploads prefix, assume it's under uploads
  if (url.startsWith('/')) {
    return `${S3_PUBLIC_URL}${url}`;
  }
  
  return url;
}

function normalizeImages(images: string[]): string[] {
  return images.map(normalizeImageUrl);
}

// Helper to convert Supabase data to app types
export function toVideoData(data: any): VideoData {
  return {
    id: data.id,
    title: data.title,
    artist: data.artist,
    category: data.category,
    image: normalizeImageUrl(data.image),
    videoUrl: normalizeImageUrl(data.video_url),
    year: data.year,
    director: data.director,
    cinematographer: data.cinematographer,
    editor: data.editor,
    producer: data.producer,
    description: data.description,
    order: data.order,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function toPhotoData(data: any): PhotoData {
  return {
    id: data.id,
    images: normalizeImages(data.images || []),
    alt: data.alt,
    photographer: data.photographer,
    location: data.location,
    date: data.date,
    camera: data.camera,
    order: data.order,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}