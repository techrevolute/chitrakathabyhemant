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
  BUSINESS_INFO,
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
import { apiFetchSiteImages, subscribeToRealtimeChanges } from './lib/supabase';
import { usePersistentState, removePersistentItem, getVideoBlob } from './lib/storage';

export default function App() {
  // Bulletproof Persistent States (Syncs to memory, LocalStorage & IndexedDB)
  const [lang, setLang] = usePersistentState('chitrakatha_lang', 'en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [activePage, setActivePage] = useState('home');

  const [aboutData, setAboutData] = usePersistentState('chitrakatha_about_data', INITIAL_ABOUT_DATA);
  const [logoUrl, setLogoUrl] = usePersistentState('chitrakatha_logo_url', INITIAL_LOGO_URL);
  const [siteImages, setSiteImages] = usePersistentState('chitrakatha_site_images', INITIAL_SITE_IMAGES);
  const [categories, setCategories] = usePersistentState('chitrakatha_categories', INITIAL_CATEGORIES);
  const [portfolio, setPortfolio] = usePersistentState('chitrakatha_portfolio', INITIAL_PORTFOLIO);
  const [videos, setVideos] = usePersistentState('chitrakatha_videos', INITIAL_VIDEOS);
  const [services, setServices] = usePersistentState('chitrakatha_services', INITIAL_SERVICES);
  const [businessInfo, setBusinessInfo] = usePersistentState('chitrakatha_business_info', BUSINESS_INFO);
  const [brochures, setBrochures] = usePersistentState('chitrakatha_brochures', INITIAL_BROCHURES);
  const [stats, setStats] = usePersistentState('chitrakatha_stats', INITIAL_STATS);
  const [watermark, setWatermark] = usePersistentState('chitrakatha_watermark', INITIAL_WATERMARK);
  const [heroData, setHeroData] = usePersistentState('chitrakatha_hero', INITIAL_HERO_VIDEO);
  const [packages, setPackages] = usePersistentState('chitrakatha_packages', INITIAL_PACKAGES);
  const [faqs, setFaqs] = usePersistentState('chitrakatha_faqs', INITIAL_FAQS);
  const [bookings, setBookings] = usePersistentState('chitrakatha_bookings', INITIAL_BOOKINGS);
  const [driveFolders, setDriveFolders] = usePersistentState('chitrakatha_drive_folders', []);

  // Sanitize heroData if a giant base64 video string or polluted query parameter was previously saved
  useEffect(() => {
    if (heroData && heroData.url) {
      if (heroData.url.startsWith('data:video')) {
        console.warn('Sanitizing giant base64 video string from heroData');
        setHeroData(prev => ({
          ...prev,
          url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4'
        }));
      } else if (heroData.url.includes('.mp4?v=')) {
        const cleanMp4 = heroData.url.split('?v=')[0];
        setHeroData(prev => ({
          ...prev,
          url: cleanMp4
        }));
      }
    }
  }, [heroData?.url]);

  // Load local computer video file Blob from IndexedDB on page load/refresh
  useEffect(() => {
    async function restoreLocalVideoBlob() {
      try {
        const storedBlob = await getVideoBlob('chitrakatha_hero_video_blob');
        if (storedBlob && (storedBlob instanceof Blob || storedBlob instanceof File)) {
          const freshBlobUrl = URL.createObjectURL(storedBlob);
          setHeroData(prev => ({
            ...prev,
            url: freshBlobUrl
          }));
        }
      } catch (err) {
        console.warn('Error loading video blob from IndexedDB:', err);
      }
    }
    restoreLocalVideoBlob();
  }, []);

  // Restore local Engagement/Film video Blobs from IndexedDB on page load/refresh
  useEffect(() => {
    async function restoreVideoGalleryBlobs() {
      if (!Array.isArray(videos) || videos.length === 0) return;
      let updated = false;
      const newVideos = await Promise.all(videos.map(async (vid) => {
        if (vid.id && vid.id.startsWith('vid-file-')) {
          try {
            const blob = await getVideoBlob(`video_file_${vid.id}`);
            if (blob && (blob instanceof Blob || blob instanceof File)) {
              updated = true;
              return { ...vid, videoUrl: URL.createObjectURL(blob) };
            }
          } catch (e) {
            console.warn('Error restoring video gallery blob:', e);
          }
        }
        return vid;
      }));

      if (updated) {
        setVideos(newVideos);
      }
    }
    restoreVideoGalleryBlobs();
  }, []);

  // Sync with remote Supabase database and subscribe to Realtime live changes
  useEffect(() => {
    async function loadRemoteImages() {
      try {
        const remoteImgs = await apiFetchSiteImages();
        if (remoteImgs && remoteImgs.length > 0) {
          setSiteImages(remoteImgs);

          // Find active hero record (sorted by updated_at / latest)
          const activeHero = remoteImgs
            .filter(img => img.section === 'hero' && img.is_active !== false)
            .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0];

          // Only overwrite heroData if activeHero is a valid permanent HTTP/HTTPS URL (not expired blob: string)
          if (activeHero && activeHero.image_url && !activeHero.image_url.startsWith('blob:')) {
            setHeroData(prev => ({
              ...prev,
              url: activeHero.image_url,
              title: activeHero.title || prev?.title
            }));
          }

          // Remote Portfolio Photos Sync
          const remotePortfolio = remoteImgs
            .filter(img => img.section === 'portfolio' && img.is_active !== false)
            .map(img => ({
              id: img.id,
              title: img.title || 'Portfolio Shoot',
              category: img.category || 'Wedding',
              image: img.image_url,
              location: img.location || 'Maharashtra',
              displayOrder: img.display_order || 1
            }));
          if (remotePortfolio.length > 0) {
            setPortfolio(prev => {
              const localOnly = prev.filter(p => p.id && String(p.id).startsWith('img-local-'));
              return [...remotePortfolio, ...localOnly];
            });
          }

          // Remote Cinematic Videos Sync
          const remoteVideos = remoteImgs
            .filter(img => img.section === 'video' && img.is_active !== false)
            .map(img => ({
              id: img.id,
              title: img.title || 'Cinematic Film',
              category: img.category || 'Wedding Film',
              videoUrl: img.image_url,
              thumbnail: img.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
              location: img.location || 'Maharashtra'
            }));
          if (remoteVideos.length > 0) {
            setVideos(prev => {
              const localOnly = prev.filter(v => v.id && String(v.id).startsWith('vid-file-'));
              return [...remoteVideos, ...localOnly];
            });
          }

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

    // Subscribe to Supabase Realtime changes so Admin edits appear live instantly on all devices!
    const unsubscribe = subscribeToRealtimeChanges(() => {
      loadRemoteImages();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Modal Control States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPortalActive, setAdminPortalActive] = useState(false);

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
        services={services} setServices={setServices}
        businessInfo={businessInfo} setBusinessInfo={setBusinessInfo}
        packages={packages} setPackages={setPackages}
        brochures={brochures} setBrochures={setBrochures}
        faqs={faqs} setFaqs={setFaqs}
        bookings={bookings} setBookings={setBookings}
        lang={lang} setLang={setLang}
        siteImages={siteImages} setSiteImages={setSiteImages}
        aboutData={aboutData} setAboutData={setAboutData}
        logoUrl={logoUrl} setLogoUrl={setLogoUrl}
        driveFolders={driveFolders} setDriveFolders={setDriveFolders}
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
        
        {activePage === 'faq' ? (
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

            {/* ABOUT ME SECTION AT TOP */}
            <AboutSection
              aboutData={aboutData}
              siteImages={siteImages}
              stats={stats}
              t={t}
            />

            <ExperienceSection
              stats={stats}
              t={t}
            />

            <WhyChooseUs
              t={t}
            />

            <ServicesSection
              services={services}
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
