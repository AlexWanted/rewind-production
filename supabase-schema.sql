-- Supabase Schema for Rewind Production
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- VIDEOS TABLE
-- ================================================================
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 100),
    artist TEXT NOT NULL CHECK (char_length(artist) > 0 AND char_length(artist) <= 100),
    category TEXT NOT NULL CHECK (char_length(category) > 0 AND char_length(category) <= 50),
    image TEXT NOT NULL CHECK (image ~* '^https?://' AND char_length(image) < 500),
    video_url TEXT NOT NULL CHECK (video_url ~* '^https?://' AND char_length(video_url) < 500),
    year INTEGER NOT NULL CHECK (year > 1900 AND year < 2100),
    director TEXT NOT NULL CHECK (char_length(director) > 0 AND char_length(director) <= 100),
    cinematographer TEXT NOT NULL CHECK (char_length(cinematographer) > 0 AND char_length(cinematographer) <= 100),
    editor TEXT NOT NULL CHECK (char_length(editor) > 0 AND char_length(editor) <= 100),
    producer TEXT NOT NULL CHECK (char_length(producer) > 0 AND char_length(producer) <= 100),
    description TEXT NOT NULL CHECK (char_length(description) > 0 AND char_length(description) <= 1000),
    "order" INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for videos
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_order ON public.videos("order");
CREATE INDEX idx_videos_created_at ON public.videos(created_at DESC);

-- ================================================================
-- PHOTOS TABLE
-- ================================================================
CREATE TABLE public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    images TEXT[] NOT NULL DEFAULT '{}',
    alt TEXT NOT NULL CHECK (char_length(alt) > 0 AND char_length(alt) <= 100),
    photographer TEXT NOT NULL CHECK (char_length(photographer) > 0 AND char_length(photographer) <= 100),
    location TEXT NOT NULL CHECK (char_length(location) > 0 AND char_length(location) <= 100),
    date TEXT NOT NULL CHECK (char_length(date) > 0 AND char_length(date) <= 50),
    camera TEXT NOT NULL CHECK (char_length(camera) > 0 AND char_length(camera) <= 100),
    "order" INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for photos
CREATE INDEX idx_photos_order ON public.photos("order");
CREATE INDEX idx_photos_created_at ON public.photos(created_at DESC);

-- ================================================================
-- USERS TABLE (for admin roles)
-- ================================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role = 'admin'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for users
CREATE INDEX idx_users_role ON public.users(role);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- VIDEOS POLICIES
-- ================================================================
-- Public read access
CREATE POLICY "Videos are publicly readable" ON public.videos
    FOR SELECT USING (true);

-- Admin can insert
CREATE POLICY "Admins can insert videos" ON public.videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- Admin can update (but not created_at)
CREATE POLICY "Admins can update videos" ON public.videos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin can delete
CREATE POLICY "Admins can delete videos" ON public.videos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- ================================================================
-- PHOTOS POLICIES
-- ================================================================
-- Public read access
CREATE POLICY "Photos are publicly readable" ON public.photos
    FOR SELECT USING (true);

-- Admin can insert
CREATE POLICY "Admins can insert photos" ON public.photos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- Admin can update
CREATE POLICY "Admins can update photos" ON public.photos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- Admin can delete
CREATE POLICY "Admins can delete photos" ON public.photos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- ================================================================
-- USERS POLICIES
-- ================================================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Admin can manage users
CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.jwt() ->> 'email' = 'rewindproductionboss@gmail.com'
    );

-- ================================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_photos_updated_at
    BEFORE UPDATE ON public.photos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();