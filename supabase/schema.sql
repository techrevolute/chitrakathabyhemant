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
  hero_video_url TEXT DEFAULT 'https://www.w3schools.com/html/mov_bbb.mp4',
  hero_poster_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920',
  cta_primary_text TEXT DEFAULT 'View Portfolio',
  cta_secondary_text TEXT DEFAULT 'Book Now',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.homepage (id, hero_title, hero_subtitle)
SELECT uuid_generate_v4(), 'Every Moment Has A Story', 'Professional Wedding, Pre Wedding, Fashion & Cinematic Photography Across Maharashtra.'
WHERE NOT EXISTS (SELECT 1 FROM public.homepage);

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

INSERT INTO public.about (id, owner_name, story, mission, vision)
SELECT uuid_generate_v4(), 'Hemant Mandawade', 
'With over 12 years of capturing couples and grand celebrations across Maharashtra, Chitrakatha by Hemant was founded on a simple philosophy: every glance, tear of joy, and warm embrace deserves to be preserved in timeless cinematic beauty.',
'To preserve raw human emotions and sacred rituals beautifully, creating visual legacies that families cherish for generations.',
'To set the benchmark for luxury photography in Maharashtra, blending traditional heritage with contemporary cinematic elegance.'
WHERE NOT EXISTS (SELECT 1 FROM public.about);

-- ----------------------------------------------------------------------------
-- 4. SERVICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  image_url TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Camera',
  price_starting TEXT DEFAULT 'Contact for Quote',
  display_order INT DEFAULT 0,
  active_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PORTFOLIO CATEGORIES TABLE
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

-- Initial Categories
INSERT INTO public.portfolio_categories (name, slug) VALUES
('Wedding', 'wedding'),
('Pre Wedding', 'pre-wedding'),
('Fashion', 'fashion'),
('Drone', 'drone'),
('Cinematic', 'cinematic')
ON CONFLICT (name) DO NOTHING;

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
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Pending', 'Confirmed', 'Completed', 'Cancelled'
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

-- Enable RLS on all tables
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (For Website Visitors)
CREATE POLICY "Public Read Website Settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Homepage" ON public.homepage FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (active_status = true);
CREATE POLICY "Public Read Portfolio Categories" ON public.portfolio_categories FOR SELECT USING (active_status = true);
CREATE POLICY "Public Read Portfolio Media" ON public.portfolio_media FOR SELECT USING (true);
CREATE POLICY "Public Read Pricing" ON public.pricing FOR SELECT USING (active = true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (hidden = false AND active = true);

-- 2. PUBLIC INSERT FOR BOOKINGS (For Visitors to Submit Requests)
CREATE POLICY "Public Insert Booking Requests" ON public.booking_requests FOR INSERT WITH CHECK (true);

-- 3. ADMIN FULL ACCESS POLICIES (Authenticated Admins Only)
CREATE POLICY "Admin Full Settings" ON public.website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Homepage" ON public.homepage FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full About" ON public.about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Categories" ON public.portfolio_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Portfolio Media" ON public.portfolio_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Pricing" ON public.pricing FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full FAQs" ON public.faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Bookings" ON public.booking_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION (Run in Supabase Dashboard SQL)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
('logos', 'logos', true),
('hero-video', 'hero-video', true),
('services', 'services', true),
('portfolio', 'portfolio', true),
('drone-gallery', 'drone-gallery', true),
('videos', 'videos', true),
('pricing', 'pricing', true),
('website-assets', 'website-assets', true),
('watermarks', 'watermarks', true)
ON CONFLICT (id) DO NOTHING;
