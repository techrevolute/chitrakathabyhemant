-- ============================================================================
-- CHITRAKATHA BY HEMANT - SUPABASE DATABASE SCHEMA MIGRATION
-- Owner: Hemant Mandawade (Satana, Nashik, Maharashtra)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. WEBSITE SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Chitrakatha by Hemant',
  owner_name TEXT NOT NULL DEFAULT 'Hemant Mandawade',
  experience TEXT NOT NULL DEFAULT '12+ Years',
  phone TEXT NOT NULL DEFAULT '7249532553',
  email TEXT NOT NULL DEFAULT 'clicksbyhemant5564@gmail.com',
  office_address TEXT NOT NULL DEFAULT 'Satana, Nashik',
  service_area TEXT NOT NULL DEFAULT 'All Over Maharashtra',
  facebook_url TEXT DEFAULT 'https://facebook.com/chitrakathabyhemant',
  instagram_url TEXT DEFAULT 'https://instagram.com/chitrakatha_by_hemant',
  whatsapp_number TEXT NOT NULL DEFAULT '7249532553',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT 'Chitrakatha by Hemant — Premium Wedding, Pre Wedding, Fashion & Cinematic Photography across Maharashtra.',
  copyright_text TEXT DEFAULT '© 2026 Chitrakatha by Hemant. All Rights Reserved.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Row if empty
INSERT INTO public.website_settings (id, business_name, owner_name, phone, email, office_address, service_area)
SELECT uuid_generate_v4(), 'Chitrakatha by Hemant', 'Hemant Mandawade', '7249532553', 'clicksbyhemant5564@gmail.com', 'Satana, Nashik', 'All Over Maharashtra'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);

-- ----------------------------------------------------------------------------
-- 2. HOMEPAGE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Every Moment Has A Story',
  hero_subtitle TEXT NOT NULL DEFAULT 'Professional Wedding, Pre Wedding, Fashion & Cinematic Photography Across Maharashtra.',
  hero_video_url TEXT DEFAULT 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4',
  hero_poster_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920',
  cta_primary_text TEXT DEFAULT 'View Portfolio',
  cta_secondary_text TEXT DEFAULT 'Book Now',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ABOUT TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_name TEXT NOT NULL DEFAULT 'Hemant Mandawade',
  experience_years TEXT NOT NULL DEFAULT '12+',
  story TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  profile_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CENTRALIZED SITE IMAGES TABLE (ALL DYNAMIC WEBSITE MEDIA)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL, -- 'hero', 'about', 'sample_shoots', 'reviews', 'logo', 'offerings', 'other'
  image_url TEXT NOT NULL,
  storage_path TEXT,
  title VARCHAR(255),
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PORTFOLIO CATEGORIES TABLE (DYNAMIC CATEGORIES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  cover_image_url TEXT,
  display_order INT DEFAULT 0,
  active_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Dynamic Categories
INSERT INTO public.portfolio_categories (name, slug, display_order) VALUES
('Wedding', 'wedding', 1),
('Pre-Wedding', 'pre-wedding', 2),
('Engagement', 'engagement', 3),
('Birthday', 'birthday', 4),
('Baby Shoot', 'baby-shoot', 5),
('Maternity', 'maternity', 6),
('Fashion', 'fashion', 7),
('Events', 'events', 8),
('Portrait', 'portrait', 9),
('Product', 'product', 10),
('Drone', 'drone', 11)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- SHOOT CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shoot_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  cover_image TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- SHOOT IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shoot_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.shoot_categories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  title TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. PORTFOLIO MEDIA TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.portfolio_categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL DEFAULT 'Wedding',
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  thumbnail_url TEXT,
  location TEXT DEFAULT 'Maharashtra',
  caption TEXT,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. PRICING PACKAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name TEXT NOT NULL DEFAULT 'Wedding Photography',
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  price TEXT NOT NULL DEFAULT 'Contact for Quote',
  discount TEXT DEFAULT '',
  popular_badge BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT NOT NULL,
  duration TEXT DEFAULT 'Full Event',
  deliverables TEXT,
  button_text TEXT DEFAULT 'Book Package',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. FAQ TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL DEFAULT 'General',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. BOOKING REQUESTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  event_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT DEFAULT 'Morning (09:00 AM)',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. SYSTEM ACTIVITY LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Website Settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Homepage" ON public.homepage FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public Read Site Images" ON public.site_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Portfolio Categories" ON public.portfolio_categories FOR SELECT USING (active_status = true);
CREATE POLICY "Public Read Portfolio Media" ON public.portfolio_media FOR SELECT USING (true);
CREATE POLICY "Public Read Pricing" ON public.pricing FOR SELECT USING (active = true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (hidden = false AND active = true);

-- PUBLIC INSERT FOR BOOKINGS
CREATE POLICY "Public Insert Booking Requests" ON public.booking_requests FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES
CREATE POLICY "Admin Full Settings" ON public.website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Homepage" ON public.homepage FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full About" ON public.about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Site Images" ON public.site_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Categories" ON public.portfolio_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Portfolio Media" ON public.portfolio_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Pricing" ON public.pricing FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full FAQs" ON public.faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Bookings" ON public.booking_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
('website-images', 'website-images', true),
('logos', 'logos', true),
('hero-video', 'hero-video', true),
('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;
