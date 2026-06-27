-- Supabase Schema for Rewind Production
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- Videos Table
-- ================================================================
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    video_url TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year > 1900 AND year < 2100),
    director VARCHAR(100) NOT NULL,
    cinematographer VARCHAR(100) NOT NULL,
    editor VARCHAR(100) NOT NULL,
    producer VARCHAR(100) NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) <= 1000),
    "order" INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for videos
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_order ON videos("order");
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- ================================================================
-- Photos Table
-- ================================================================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    images TEXT[] NOT NULL DEFAULT '{}',
    alt VARCHAR(100) NOT NULL,
    photographer VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL,
    camera VARCHAR(100) NOT NULL,
    "order" INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for photos
CREATE INDEX idx_photos_order ON photos("order");
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);

-- ================================================================
-- Users Table (for admin roles - Firebase Auth handles authentication)
-- ================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

-- ================================================================
-- Row Level Security (RLS) Policies
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Videos: Public read access
CREATE POLICY "Videos are publicly readable" ON videos
    FOR SELECT USING (true);

-- Videos: Admin can insert/update/delete (using service role or custom JWT claim)
-- Note: In Next.js, we'll use service role key for admin operations
-- Client-side admin operations will go through API routes with service role

-- Photos: Public read access
CREATE POLICY "Photos are publicly readable" ON photos
    FOR SELECT USING (true);

-- Users: Users can read their own record
CREATE POLICY "Users can read own record" ON users
    FOR SELECT USING (auth.uid()::text = firebase_uid);

-- Users: Service role can manage (for admin panel)
-- This is handled server-side with service role key

-- ================================================================
-- Updated At Trigger
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- Realtime Publication (optional - for live updates)
-- ================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE videos;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;