import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import WhyChooseUs from './components/WhyChooseUs';
import ServicesSection from './components/ServicesSection';
import FeaturedPortfolio from './components/FeaturedPortfolio';
import VideoGallery from './components/VideoGallery';
import DroneGallery from './components/DroneGallery';
import AboutSection from './components/AboutSection';
import PricingPage from './components/PricingPage';
import FaqPage from './components/FaqPage';
import ContactPage from './components/ContactPage';
import SocialFeeds from './components/SocialFeeds';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AdminPortal from './components/AdminPortal/AdminPortal';

import {
  INITIAL_STATS,
  INITIAL_SERVICES,
  INITIAL_CATEGORIES,
  INITIAL_PORTFOLIO,
  INITIAL_VIDEOS,
  INITIAL_BROCHURES,
  INITIAL_WATERMARK,
  INITIAL_HERO_VIDEO,
  INITIAL_PACKAGES,
  INITIAL_FAQS,
  INITIAL_BOOKINGS,
  INITIAL_ABOUT_DATA,
  INITIAL_SITE_IMAGES,
  INITIAL_LOGO_URL
} from './data/initialData';

import { TRANSLATIONS } from './data/translations';
import { apiFetchSiteImages } from './lib/supabase';

export default function App() {
  // Language State (en, mr, hi)
  const [lang, setLang] = useState(() => localStorage.getItem('chitrakatha_lang') || 'en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Active Navigation Page
  const [activePage, setActivePage] = useState('home');

  // Dynamic Content States with LocalStorage & Supabase Persistence
  const [aboutData, setAboutData] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_about_data');
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_DATA;
    } catch { return INITIAL_ABOUT_DATA; }
  });

  const [logoUrl, setLogoUrl] = useState(() => {
    try {
      return localStorage.getItem('chitrakatha_logo_url') || INITIAL_LOGO_URL;
    } catch { return INITIAL_LOGO_URL; }
  });

  const [siteImages, setSiteImages] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_site_images');
      return saved ? JSON.parse(saved) : INITIAL_SITE_IMAGES;
    } catch { return INITIAL_SITE_IMAGES; }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch { return INITIAL_CATEGORIES; }
  });

  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_portfolio');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch { return INITIAL_PORTFOLIO; }
  });

  const [videos, setVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch { return INITIAL_VIDEOS; }
  });

  const [brochures, setBrochures] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_brochures');
      return saved ? JSON.parse(saved) : INITIAL_BROCHURES;
    } catch { return INITIAL_BROCHURES; }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch { return INITIAL_STATS; }
  });

  const [watermark, setWatermark] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_watermark');
      return saved ? JSON.parse(saved) : INITIAL_WATERMARK;
    } catch { return INITIAL_WATERMARK; }
  });

  const [heroData, setHeroData] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_hero');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && (parsed.url.includes('bing.com') || parsed.url.includes('google.com'))) {
          parsed.url = 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4';
          localStorage.setItem('chitrakatha_hero', JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_HERO_VIDEO;
    } catch { return INITIAL_HERO_VIDEO; }
  });

  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_packages');
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
    } catch { return INITIAL_PACKAGES; }
  });

  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_faqs');
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch { return INITIAL_FAQS; }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('chitrakatha_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch { return INITIAL_BOOKINGS; }
  });

  // Fetch initial site images from Supabase if configured
  useEffect(() => {
    async function loadRemoteImages() {
      try {
        const remoteImgs = await apiFetchSiteImages();
        if (remoteImgs && remoteImgs.length > 0) {
          setSiteImages(remoteImgs);
          const aboutImg = remoteImgs.find(img => img.section === 'about' && img.is_active !== false);
          if (aboutImg && aboutImg.image_url) {
            setAboutData(prev => ({ ...prev, profileImage: aboutImg.image_url }));
          }
          const logoImg = remoteImgs.find(img => img.section === 'logo' && img.is_active !== false);
          if (logoImg && logoImg.image_url) {
            setLogoUrl(logoImg.image_url);
          }
        }
      } catch (err) {
        console.warn('Error loading remote site images:', err);
      }
    }
    loadRemoteImages();
  }, []);

  // Modal Control States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPortalActive, setAdminPortalActive] = useState(false);

  // Sync state to LocalStorage with Safe Persistence
  useEffect(() => { try { localStorage.setItem('chitrakatha_lang', lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_about_data', JSON.stringify(aboutData)); } catch {} }, [aboutData]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_logo_url', logoUrl); } catch {} }, [logoUrl]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_site_images', JSON.stringify(siteImages)); } catch {} }, [siteImages]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_categories', JSON.stringify(categories)); } catch {} }, [categories]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_portfolio', JSON.stringify(portfolio)); } catch {} }, [portfolio]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_videos', JSON.stringify(videos)); } catch {} }, [videos]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_brochures', JSON.stringify(brochures)); } catch {} }, [brochures]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_stats', JSON.stringify(stats)); } catch {} }, [stats]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_watermark', JSON.stringify(watermark)); } catch {} }, [watermark]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_hero', JSON.stringify(heroData)); } catch {} }, [heroData]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_packages', JSON.stringify(packages)); } catch {} }, [packages]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_faqs', JSON.stringify(faqs)); } catch {} }, [faqs]);
  useEffect(() => { try { localStorage.setItem('chitrakatha_bookings', JSON.stringify(bookings)); } catch {} }, [bookings]);

  // Handler to record new appointment booking
  const handleAddBooking = (newBooking) => {
    setBookings([newBooking, ...bookings]);
  };

  // Reset to Baseline
  const handleResetBaseline = () => {
    if (window.confirm("Reset all CMS updates back to initial default baseline?")) {
      setAboutData(INITIAL_ABOUT_DATA);
      setLogoUrl(INITIAL_LOGO_URL);
      setSiteImages(INITIAL_SITE_IMAGES);
      setCategories(INITIAL_CATEGORIES);
      setPortfolio(INITIAL_PORTFOLIO);
      setVideos(INITIAL_VIDEOS);
      setBrochures(INITIAL_BROCHURES);
      setStats(INITIAL_STATS);
      setWatermark(INITIAL_WATERMARK);
      setHeroData(INITIAL_HERO_VIDEO);
      setPackages(INITIAL_PACKAGES);
      setFaqs(INITIAL_FAQS);
      setBookings(INITIAL_BOOKINGS);
      localStorage.clear();
      alert("Baseline restored successfully!");
    }
  };

  // If Admin Portal Mode is Active, Render Full Screen Admin Portal
  if (adminPortalActive) {
    return (
      <AdminPortal
        onCloseAdminPortal={() => setAdminPortalActive(false)}
        stats={stats} setStats={setStats}
        watermark={watermark} setWatermark={setWatermark}
        heroData={heroData} setHeroData={setHeroData}
        portfolio={portfolio} setPortfolio={setPortfolio}
        categories={categories} setCategories={setCategories}
        videos={videos} setVideos={setVideos}
        packages={packages} setPackages={setPackages}
        brochures={brochures} setBrochures={setBrochures}
        faqs={faqs} setFaqs={setFaqs}
        bookings={bookings} setBookings={setBookings}
        lang={lang} setLang={setLang}
        siteImages={siteImages} setSiteImages={setSiteImages}
        aboutData={aboutData} setAboutData={setAboutData}
        logoUrl={logoUrl} setLogoUrl={setLogoUrl}
        onResetAll={handleResetBaseline}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#8B0000] selection:text-white">
      
      {/* Sticky Header Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        logoUrl={logoUrl}
        onOpenBooking={() => setBookingModalOpen(true)}
        onOpenAdmin={() => setAdminPortalActive(true)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content Router View */}
      <main className="flex-1">
        
        {/* Dedicated Pricing Page */}
        {activePage === 'pricing' ? (
          <PricingPage
            packages={packages}
            brochures={brochures}
            t={t}
            onOpenBooking={() => setBookingModalOpen(true)}
          />
        ) : activePage === 'faq' ? (
          /* Dedicated FAQ Page */
          <FaqPage
            faqs={faqs}
            t={t}
          />
        ) : activePage === 'contact' ? (
          /* Dedicated Contact Page */
          <ContactPage
            onOpenBooking={() => setBookingModalOpen(true)}
          />
        ) : (
          /* Default Main Portfolio Landing View */
          <>
            <Hero
              heroData={heroData}
              siteImages={siteImages}
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
              setActivePage={setActivePage}
            />

            <ExperienceSection
              stats={stats}
              t={t}
            />

            <WhyChooseUs
              t={t}
            />

            <ServicesSection
              services={INITIAL_SERVICES}
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
            />

            <FeaturedPortfolio
              portfolio={portfolio}
              videos={videos}
              categories={categories}
              watermark={watermark}
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
            />

            <VideoGallery
              videos={videos}
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
            />

            <DroneGallery
              portfolio={portfolio}
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
            />

            <AboutSection
              aboutData={aboutData}
              siteImages={siteImages}
              stats={stats}
              t={t}
            />

            <SocialFeeds />

            <CallToAction
              t={t}
              onOpenBooking={() => setBookingModalOpen(true)}
            />
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        t={t}
        logoUrl={logoUrl}
        setActivePage={setActivePage}
        onOpenBooking={() => setBookingModalOpen(true)}
      />

      {/* Persistent Floating Widgets */}
      <FloatingWidgets />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        t={t}
        onAddBooking={handleAddBooking}
      />

      {/* Admin Quick Drawer */}
      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        stats={stats}
        setStats={setStats}
        watermark={watermark}
        setWatermark={setWatermark}
        heroData={heroData}
        setHeroData={setHeroData}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        packages={packages}
        setPackages={setPackages}
        faqs={faqs}
        setFaqs={setFaqs}
        bookings={bookings}
        setBookings={setBookings}
        onResetAll={handleResetBaseline}
      />

    </div>
  );
}
