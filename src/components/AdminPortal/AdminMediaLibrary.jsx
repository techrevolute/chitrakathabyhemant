import React, { useState, useRef } from 'react';
import {
  Upload, Trash2, Eye, RefreshCw, Check, Plus, Image as ImageIcon, Video, FolderOpen,
  ArrowUp, ArrowDown, Star, Filter, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { apiUploadStorageFile, apiSaveSiteImage, apiDeleteSiteImage, appendCacheBuster } from '../../lib/supabase';

export default function AdminMediaLibrary({
  siteImages = [],
  setSiteImages,
  aboutData,
  setAboutData,
  heroData,
  setHeroData,
  portfolio = [],
  setPortfolio,
  logoUrl = '',
  setLogoUrl
}) {
  const [activeSection, setActiveSection] = useState('ALL'); // 'ALL', 'about', 'hero', 'sample_shoots', 'logo', 'reviews', 'other'
  const [toastMessage, setToastMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const sectionsList = [
    { key: 'ALL', label: 'All Website Media' },
    { key: 'about', label: 'About Me Photo' },
    { key: 'hero', label: 'Hero Slides' },
    { key: 'sample_shoots', label: 'Sample Shoots' },
    { key: 'logo', label: 'Website Logo' },
    { key: 'reviews', label: 'Client Reviews' },
    { key: 'other', label: 'Other Images' }
  ];

  // Upload new image to a specific section
  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetSec = activeSection === 'ALL' ? 'other' : activeSection;
    setUploading(true);
    try {
      const result = await apiUploadStorageFile('website-images', file);
      if (result && result.publicUrl) {
        const busterUrl = appendCacheBuster(result.publicUrl);
        const newRecord = await apiSaveSiteImage({
          section: targetSec,
          image_url: busterUrl,
          storage_path: result.storagePath,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          category: targetSec,
          display_order: siteImages.length + 1,
          is_active: true
        });

        if (setSiteImages) {
          setSiteImages(prev => [newRecord, ...prev]);
        }

        // Section specific side effects
        if (targetSec === 'about' && setAboutData) {
          setAboutData(prev => ({ ...prev, profileImage: busterUrl }));
        } else if (targetSec === 'logo' && setLogoUrl) {
          setLogoUrl(busterUrl);
        } else if (targetSec === 'hero' && setHeroData) {
          setHeroData(prev => ({ ...prev, url: busterUrl }));
        }

        showToast('Image uploaded successfully');
      }
    } catch (err) {
      console.error('Media upload error:', err);
      showToast('Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Replace existing image URL
  const handleReplaceImage = async (item) => {
    const newUrl = window.prompt(`Enter replacement Image URL for ${item.title || item.section}:`, item.image_url);
    if (newUrl && newUrl.trim()) {
      const busterUrl = appendCacheBuster(newUrl.trim());
      const updatedRecord = await apiSaveSiteImage({
        ...item,
        image_url: busterUrl,
        updated_at: new Date().toISOString()
      });

      if (setSiteImages) {
        setSiteImages(prev => prev.map(img => img.id === item.id ? updatedRecord : img));
      }

      if (item.section === 'about' && setAboutData) {
        setAboutData(prev => ({ ...prev, profileImage: busterUrl }));
      } else if (item.section === 'logo' && setLogoUrl) {
        setLogoUrl(busterUrl);
      }

      showToast('Image updated successfully');
    }
  };

  // Delete image
  const handleDeleteImage = async (item) => {
    if (window.confirm(`Delete image "${item.title || item.section}"?`)) {
      await apiDeleteSiteImage(item.id, item.storage_path);
      if (setSiteImages) {
        setSiteImages(prev => prev.filter(img => img.id !== item.id));
      }
      showToast('Image deleted successfully');
    }
  };

  // Filtered site images
  const filteredImages = activeSection === 'ALL'
    ? siteImages
    : siteImages.filter(img => img.section === activeSection);

  return (
    <div className="space-y-8 text-white max-w-6xl">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadFile}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Centralized Website Content & Media Manager</h2>
          <p className="text-xs text-stone-400">Manage, replace, upload & reorder all website images across all sections</p>
        </div>

        {toastMessage && (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </span>
        )}
      </div>

      {/* Section Filter Pills & Upload Button */}
      <div className="bg-[#1C1C1C] p-4 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Select Section to Manage:</span>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-transform hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : `Upload to ${activeSection === 'ALL' ? 'Website' : activeSection.toUpperCase()}`}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {sectionsList.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSection === sec.key ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-300 hover:text-white'
              }`}
            >
              {sec.label} ({sec.key === 'ALL' ? siteImages.length : siteImages.filter(img => img.section === sec.key).length})
            </button>
          ))}
        </div>
      </div>

      {/* SECTION QUICK MANAGERS */}

      {/* ABOUT ME SECTION MANAGER */}
      {(activeSection === 'ALL' || activeSection === 'about') && (
        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif text-xl font-bold text-amber-400">ABOUT ME - Profile Photo Manager</h3>
            <span className="text-xs text-stone-400 font-mono">Dynamic Profile Image</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={aboutData?.profileImage || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000'}
              alt="About Profile"
              className="w-32 h-40 rounded-2xl object-cover border-2 border-stone-700 shadow-md shrink-0"
            />

            <div className="space-y-3 flex-1 w-full">
              <h4 className="font-serif text-lg font-bold">{aboutData?.ownerName || 'Hemant Mandawade'}</h4>
              <p className="text-xs text-stone-300 font-mono truncate">{aboutData?.profileImage}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#8B0000] text-white text-xs font-bold flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload New Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = window.prompt('Enter new About photo URL:', aboutData?.profileImage);
                    if (newUrl) {
                      const busterUrl = appendCacheBuster(newUrl);
                      if (setAboutData) setAboutData(prev => ({ ...prev, profileImage: busterUrl }));
                      apiSaveSiteImage({ section: 'about', image_url: busterUrl, title: 'About Profile' });
                      showToast('Image updated successfully');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Replace Image URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEBSITE LOGO MANAGER */}
      {(activeSection === 'ALL' || activeSection === 'logo') && (
        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif text-xl font-bold text-amber-400">WEBSITE LOGO - Branding Manager</h3>
            <span className="text-xs text-stone-400 font-mono">Navbar & Footer Logo</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-20 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center p-2 shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Website Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="font-serif font-bold text-xs text-stone-400">Default Text Branding</span>
              )}
            </div>

            <div className="space-y-3 flex-1 w-full">
              <h4 className="font-serif text-lg font-bold">Chitrakatha Official Logo</h4>
              <p className="text-xs text-stone-300 font-mono truncate">{logoUrl || 'Using Default Text Branding'}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#8B0000] text-white text-xs font-bold flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Logo Image
                </button>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (setLogoUrl) setLogoUrl('');
                      showToast('Logo reset to default text branding');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-950 text-red-200 text-xs font-bold border border-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Reset to Text Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL SITE IMAGES GRID TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold">Managed Media Items ({filteredImages.length})</h3>
          <span className="text-xs font-mono text-stone-400">Display Order • Section • Preview</span>
        </div>

        {filteredImages.length === 0 ? (
          <div className="p-8 text-center bg-[#1C1C1C] rounded-3xl border border-stone-800 text-stone-400 text-xs">
            No images added to "{activeSection}" yet. Click "Upload to {activeSection.toUpperCase()}" to add dynamic images!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((item, idx) => (
              <div key={item.id} className="p-4 bg-[#1C1C1C] rounded-2xl border border-stone-800 flex flex-col justify-between space-y-3 shadow-lg">
                
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-[10px] font-mono font-bold text-amber-300 uppercase">
                    {item.section}
                  </span>
                  <h5 className="text-xs font-bold text-white truncate flex-1">{item.title || `Media Item ${idx + 1}`}</h5>
                </div>

                <div className="h-36 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 relative group">
                  {item.image_url?.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
                    <video src={item.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setPreviewMedia(item)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-bold text-white"
                  >
                    <Eye className="w-4 h-4 text-amber-400" /> Preview
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 font-mono truncate">{item.image_url}</p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => handleReplaceImage(item)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(item)}
                    className="text-xs text-red-400 hover:text-red-300 p-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1C1C1C] p-6 rounded-3xl max-w-2xl w-full border border-stone-800 space-y-4">
            <div className="flex justify-between items-center text-white">
              <h4 className="font-serif text-lg font-bold">{previewMedia.title || previewMedia.section}</h4>
              <button onClick={() => setPreviewMedia(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            {previewMedia.image_url?.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
              <video controls autoPlay className="w-full max-h-96 rounded-xl">
                <source src={previewMedia.image_url} type="video/mp4" />
              </video>
            ) : (
              <img src={previewMedia.image_url} alt={previewMedia.title} className="max-h-96 w-full object-contain rounded-xl" />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
