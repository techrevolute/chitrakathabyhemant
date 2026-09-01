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
  // Client UI Preferences
  const [lang, setLang] = usePersistentState('chitrakatha_lang', 'en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [activePage, setActivePage] = useState('home');

  // Single Source of Truth CMS States (Hydrated directly from production Supabase database)
  const [aboutData, setAboutData] = useState(INITIAL_ABOUT_DATA);
  const [logoUrl, setLogoUrl] = useState(INITIAL_LOGO_URL);
  const [siteImages, setSiteImages] = useState(INITIAL_SITE_IMAGES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [businessInfo, setBusinessInfo] = useState(BUSINESS_INFO);
  const [brochures, setBrochures] = useState(INITIAL_BROCHURES);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [watermark, setWatermark] = usePersistentState('chitrakatha_watermark', INITIAL_WATERMARK);
  const [heroData, setHeroData] = useState(INITIAL_HERO_VIDEO);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [bookings, setBookings] = usePersistentState('chitrakatha_bookings', INITIAL_BOOKINGS);
  const [driveFolders, setDriveFolders] = usePersistentState('chitrakatha_drive_folders', []);

  // Sync with remote central Supabase database and subscribe to Realtime live changes
  useEffect(() => {
    console.log('CROSS_DEVICE_FIX_BUILD_V2');

    async function loadRemoteImages() {
      try {
        console.log('[PRODUCTION HERO FETCH] Starting apiFetchSiteImages()...');
        const remoteImgs = await apiFetchSiteImages();
        console.log('[PRODUCTION HERO READ]', remoteImgs);

        if (remoteImgs && remoteImgs.length > 0) {
          setSiteImages(remoteImgs);

          // 1. Sync Active Hero Section (Explicitly locate hero-main)
          const heroRecord = remoteImgs.find(img => img.id === 'hero-main') ||
            remoteImgs
              .filter(img => img.section === 'hero' && img.is_active !== false)
              .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0];

          console.log('[PRODUCTION HERO RECORD]', heroRecord);

          if (heroRecord) {
            const heroPayload = heroRecord.data || {};
            const heroTitle = heroPayload.title || heroRecord.title;
            const heroSubtitle = heroPayload.subtitle !== undefined ? heroPayload.subtitle : heroRecord.subtitle;
            const heroUrl = heroPayload.url || heroRecord.image_url;
            const heroTagline = heroPayload.tagline;

            const nextHeroState = {
              title: heroTitle || 'Chitrakatha by Hemant',
              subtitle: heroSubtitle !== undefined ? heroSubtitle : '',
              tagline: heroTagline || 'LUXURY CINEMATIC PHOTOGRAPHY',
              url: (heroUrl && !heroUrl.startsWith('blob:')) ? heroUrl : 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4',
              ...heroPayload
            };

            console.log('[PRODUCTION HERO STATE SETTING]', nextHeroState);
            setHeroData(nextHeroState);
          } else {
            console.error('SUPABASE HERO RECORD NOT FOUND');
          }

          // 2. Sync About Me Section
          const aboutImg = remoteImgs.find(img => img.id === 'about-main') ||
            remoteImgs.find(img => img.section === 'about' && img.is_active !== false);
          if (aboutImg) {
            const aboutPayload = aboutImg.data || {};
            setAboutData(prev => ({
              ...prev,
              ...aboutPayload,
              ownerName: aboutImg.title || aboutPayload.ownerName || prev.ownerName,
              profileImage: aboutImg.image_url || aboutPayload.profileImage || prev.profileImage
            }));
          }

          // 3. Sync Global Business Settings
          const infoImg = remoteImgs.find(img => img.section === 'business_info' && img.is_active !== false);
          if (infoImg && infoImg.data) {
            setBusinessInfo(infoImg.data);
          }

          // 4. Sync Experience Stats
          const statsImg = remoteImgs.find(img => img.section === 'stats' && img.is_active !== false);
          if (statsImg && statsImg.data && Array.isArray(statsImg.data)) {
            setStats(statsImg.data);
          }

          // 5. Sync Services
          const remoteServices = remoteImgs
            .filter(img => img.section === 'services' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              title: img.title || 'Photography Service',
              description: 'Professional photography and film service.',
              image: img.image_url,
              priceStarting: 'Contact for Quote',
              icon: 'Camera'
            }));
          if (remoteServices.length > 0) {
            setServices(remoteServices);
          }

          // 6. Sync Categories
          const remoteCategories = remoteImgs
            .filter(img => img.section === 'category' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              name: img.title,
              slug: img.title.toLowerCase().replace(/\s+/g, '-'),
              coverImage: img.image_url,
              displayOrder: img.display_order || 1,
              hidden: false
            }));
          if (remoteCategories.length > 0) {
            setCategories(remoteCategories);
          }

          // 7. Sync Portfolio Photos
          const remotePortfolio = remoteImgs
            .filter(img => img.section === 'portfolio' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              categoryId: img.category ? `cat-${img.category.toLowerCase().replace(/\s+/g, '-')}` : 'cat-wedding',
              category: img.category || 'Wedding',
              title: img.title || 'Portfolio Shoot',
              description: 'Captured by Hemant Mandawade.',
              image: img.image_url,
              location: img.location || 'Maharashtra',
              featured: true,
              hidden: false,
              displayOrder: img.display_order || 1
            }));
          if (remotePortfolio.length > 0) {
            setPortfolio(remotePortfolio);
          }

          // 8. Sync Cinematic Videos
          const remoteVideos = remoteImgs
            .filter(img => img.section === 'video' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              title: img.title || 'Cinematic Film',
              category: img.category || 'Wedding Film',
              videoUrl: img.image_url,
              thumbnail: img.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
              location: img.location || 'Maharashtra',
              duration: '04:15',
              featured: true,
              hidden: false
            }));
          if (remoteVideos.length > 0) {
            setVideos(remoteVideos);
          }

          // 9. Sync Packages
          const remotePackages = remoteImgs
            .filter(img => img.section === 'package' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              name: img.title || 'Photography Package',
              category: img.category || 'Wedding Photography',
              image: img.image_url,
              description: 'Comprehensive photography & film package.',
              price: 'Get Quote',
              features: ['Lead Photographers', '4K Film']
            }));
          if (remotePackages.length > 0) {
            setPackages(remotePackages);
          }

          // 10. Sync FAQs
          const remoteFaqs = remoteImgs
            .filter(img => img.section === 'faq' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              question: img.title,
              category: img.category || 'General',
              answer: ''
            }));
          if (remoteFaqs.length > 0) {
            setFaqs(remoteFaqs);
          }

          // 11. Sync Brochures
          const remoteBrochures = remoteImgs
            .filter(img => img.section === 'brochure' && img.is_active !== false)
            .map(img => img.data || ({
              id: img.id,
              name: img.title || 'Brochure PDF',
              category: img.category || 'Wedding Packages',
              fileUrl: img.image_url,
              active: true
            }));
          if (remoteBrochures.length > 0) {
            setBrochures(remoteBrochures);
          }

          // 12. Sync Logo
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
