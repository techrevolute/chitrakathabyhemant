import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminDashboardHome from './AdminDashboardHome';
import AdminHomepageEditor from './AdminHomepageEditor';
import AdminAboutEditor from './AdminAboutEditor';
import AdminServicesEditor from './AdminServicesEditor';
import AdminPortfolioEditor from './AdminPortfolioEditor';
import AdminDroneEditor from './AdminDroneEditor';
import AdminVideoEditor from './AdminVideoEditor';
import AdminPricingEditor from './AdminPricingEditor';
import AdminBrochureEditor from './AdminBrochureEditor';
import AdminBookingsManager from './AdminBookingsManager';
import AdminFaqEditor from './AdminFaqEditor';
import AdminMediaLibrary from './AdminMediaLibrary';
import AdminLanguageEditor from './AdminLanguageEditor';
import AdminSettings from './AdminSettings';
import AdminBackupActivity from './AdminBackupActivity';

export default function AdminPortal({
  onCloseAdminPortal,
  stats, setStats,
  watermark, setWatermark,
  heroData, setHeroData,
  portfolio, setPortfolio,
  categories, setCategories,
  videos, setVideos,
  services, setServices,
  businessInfo, setBusinessInfo,
  packages, setPackages,
  brochures, setBrochures,
  faqs, setFaqs,
  bookings, setBookings,
  lang, setLang,
  siteImages, setSiteImages,
  aboutData, setAboutData,
  logoUrl, setLogoUrl,
  driveFolders, setDriveFolders,
  onResetAll
}) {
  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chitrakatha_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Navigation Active Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('chitrakatha_admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chitrakatha_admin_user');
  };

  if (!user) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onCancel={onCloseAdminPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-[#8B0000] selection:text-white">
      
      {/* Topbar */}
      <AdminTopbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onPreviewWebsite={onCloseAdminPortal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative z-10 w-64 h-full">
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Render Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && (
            <AdminDashboardHome
              bookings={bookings}
              portfolio={portfolio}
              packages={packages}
              faqs={faqs}
            />
          )}

          {activeTab === 'homepage' && (
            <AdminHomepageEditor
              heroData={heroData}
              setHeroData={setHeroData}
              siteImages={siteImages}
              setSiteImages={setSiteImages}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
            />
          )}

          {activeTab === 'about' && (
            <AdminAboutEditor
              aboutData={aboutData}
              setAboutData={setAboutData}
              siteImages={siteImages}
              setSiteImages={setSiteImages}
            />
          )}

          {activeTab === 'services' && (
            <AdminServicesEditor
              services={services}
              setServices={setServices}
            />
          )}

          {activeTab === 'portfolio' && (
            <AdminPortfolioEditor
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              categories={categories}
              setCategories={setCategories}
              watermark={watermark}
              setWatermark={setWatermark}
              driveFolders={driveFolders}
              setDriveFolders={setDriveFolders}
            />
          )}

          {activeTab === 'drone' && (
            <AdminDroneEditor
              portfolio={portfolio}
              setPortfolio={setPortfolio}
            />
          )}

          {activeTab === 'videos' && (
            <AdminVideoEditor
              videos={videos}
              setVideos={setVideos}
              categories={categories}
              setCategories={setCategories}
            />
          )}

          {activeTab === 'bookings' && (
            <AdminBookingsManager
              bookings={bookings}
              setBookings={setBookings}
            />
          )}

          {activeTab === 'faq' && (
            <AdminFaqEditor
              faqs={faqs}
              setFaqs={setFaqs}
            />
          )}

          {activeTab === 'media' && (
            <AdminMediaLibrary
              siteImages={siteImages}
              setSiteImages={setSiteImages}
              aboutData={aboutData}
              setAboutData={setAboutData}
              heroData={heroData}
              setHeroData={setHeroData}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
            />
          )}

          {activeTab === 'languages' && (
            <AdminLanguageEditor
              lang={lang}
              setLang={setLang}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              businessInfo={businessInfo}
              setBusinessInfo={setBusinessInfo}
            />
          )}

          {activeTab === 'backup' && (
            <AdminBackupActivity />
          )}
        </main>

      </div>

    </div>
  );
}
