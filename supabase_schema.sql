-- ============================================================
-- CHITRAKATHA BY HEMANT - SUPABASE DATABASE SCHEMA SETUP
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vlnransfhfgkevnjoolk/sql/new
-- ============================================================

-- 1. Create site_images table (Universal content & media storage table)
CREATE TABLE IF NOT EXISTS public.site_images (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL DEFAULT 'other',
    image_url TEXT,
    storage_path TEXT,
    title TEXT DEFAULT '',
    category TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policy (Everyone can view published content)
CREATE POLICY "Public Read Access" 
ON public.site_images 
FOR SELECT 
USING (true);

-- 4. Create Public Insert/Update/Delete Policy for Admin Content Management
CREATE POLICY "Public Insert Access" 
ON public.site_images 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Update Access" 
ON public.site_images 
FOR UPDATE 
USING (true);

CREATE POLICY "Public Delete Access" 
ON public.site_images 
FOR DELETE 
USING (true);

-- 5. Enable Supabase Realtime for site_images table
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_images;
