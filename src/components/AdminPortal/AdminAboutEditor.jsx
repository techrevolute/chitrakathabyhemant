import React, { useState, useRef, useEffect } from 'react';
import { Save, Check, User, Image as ImageIcon, Upload, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { apiUploadStorageFile, apiSaveSiteImage, apiDeleteSiteImage, appendCacheBuster, formatGoogleDriveUrl, handleImageError } from '../../lib/supabase';

export default function AdminAboutEditor({ aboutData, setAboutData, siteImages = [], setSiteImages }) {
  const [formData, setFormData] = useState({
    ownerName: aboutData?.ownerName || 'Hemant Mandawade',
    experience: aboutData?.experience || '12+ Years',
    story: aboutData?.story || 'With over 12 years of capturing couples and grand celebrations across Maharashtra, Chitrakatha by Hemant was founded on a simple philosophy: every glance, tear of joy, and warm embrace deserves to be preserved in timeless cinematic beauty.',
    mission: aboutData?.mission || 'To preserve raw human emotions and sacred rituals beautifully, creating visual legacies that families cherish for generations.',
    vision: aboutData?.vision || 'To set the benchmark for luxury photography in Maharashtra, blending traditional heritage with contemporary cinematic elegance.',
    profileImage: aboutData?.profileImage || 'assets/hemant_about.png'
  });

  // Sync state if aboutData prop changes from parent
  useEffect(() => {
    if (aboutData) {
      setFormData(prev => ({
        ...prev,
        ...aboutData,
        profileImage: aboutData.profileImage || prev.profileImage
      }));
    }
  }, [aboutData]);

  const [toastMessage, setToastMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle direct file upload from PC
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiUploadStorageFile('website-images', file);
      if (result && result.publicUrl) {
        const updatedUrl = appendCacheBuster(result.publicUrl);
        setFormData(prev => ({ ...prev, profileImage: updatedUrl }));
        
        // Instantly update parent state so live About section updates immediately!
        if (setAboutData) {
          setAboutData(prev => ({ ...prev, profileImage: updatedUrl }));
        }

        // Save to site_images table / state
        const savedImg = await apiSaveSiteImage({
          section: 'about',
          image_url: updatedUrl,
          storage_path: result.storagePath,
          title: 'Hemant Mandawade Profile Photo',
          category: 'About Me',
          display_order: 1,
          is_active: true
        });

        if (setSiteImages) {
          setSiteImages(prev => {
            const filtered = prev.filter(img => img.section !== 'about');
            return [savedImg, ...filtered];
          });
        }

        showToast('Image uploaded & updated successfully');
      }
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Error uploading image file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle replace photo URL
  const handleReplacePhotoUrl = () => {
    const newUrl = window.prompt('Enter new Profile Image URL (or Google Drive share link):', formData.profileImage);
    if (newUrl && newUrl.trim()) {
      const formatted = formatGoogleDriveUrl(newUrl.trim());
      const busterUrl = appendCacheBuster(formatted);
      setFormData(prev => ({ ...prev, profileImage: busterUrl }));
      
      if (setAboutData) {
        setAboutData(prev => ({ ...prev, profileImage: busterUrl }));
      }

      apiSaveSiteImage({
        section: 'about',
        image_url: busterUrl,
        title: 'Hemant Mandawade Profile Photo',
        category: 'About Me',
        display_order: 1,
        is_active: true
      });

      showToast('Image updated successfully');
    }
  };

  // Handle delete photo (resets to default placeholder)
  const handleDeletePhoto = async () => {
    if (window.confirm('Delete custom About profile photo and reset to default image?')) {
      const fallbackUrl = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000';
      setFormData(prev => ({ ...prev, profileImage: fallbackUrl }));
      
      if (setAboutData) {
        setAboutData(prev => ({ ...prev, profileImage: fallbackUrl }));
      }

      const aboutImg = siteImages.find(img => img.section === 'about');
      if (aboutImg && aboutImg.id) {
        await apiDeleteSiteImage(aboutImg.id, aboutImg.storage_path);
      }

      if (setSiteImages) {
        setSiteImages(prev => prev.filter(img => img.section !== 'about'));
      }

      showToast('Image deleted & reset to default');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData };
    
    // Save to App State
    if (setAboutData) {
      setAboutData(updatedData);
    }

    // Save image & text data to site_images in Supabase Cloud
    const savedImg = await apiSaveSiteImage({
      id: 'about-me-main',
      section: 'about',
      image_url: updatedData.profileImage,
      title: updatedData.ownerName || 'Hemant Mandawade Profile Photo',
      category: 'About Me',
      display_order: 1,
      is_active: true,
      data: updatedData
    });

    if (setSiteImages) {
      setSiteImages(prev => {
        const filtered = prev.filter(img => img.section !== 'about');
        return [savedImg, ...filtered];
      });
    }

    showToast('About Me profile & content saved successfully');
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">About Me & Founder Profile Manager</h2>
          <p className="text-xs text-stone-400">Manage Hemant Mandawade profile photo, founder biography, mission & vision</p>
        </div>

        {toastMessage && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> {toastMessage}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        
        {/* Profile Photo Management Box */}
        <div className="p-6 bg-stone-900 rounded-2xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">About Me Profile Photo</h3>
            <span className="text-[10px] text-stone-400 font-mono">Live Website Dynamic Image</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Current Image Preview */}
            <div className="relative group shrink-0">
              <img
                src={appendCacheBuster(formData.profileImage)}
                alt="About Profile Preview"
                onError={(e) => handleImageError(e)}
                className="w-32 h-40 rounded-2xl object-cover border-2 border-stone-700 shadow-md"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="text-[10px] font-bold text-white uppercase">Preview</span>
              </div>
            </div>

            {/* Actions & File Upload */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading File...' : 'Upload New Photo from PC'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplacePhotoUrl}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Replace Photo URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold flex items-center gap-1.5 border border-red-800/80"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Photo</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400">Current Image URL (Saved to Supabase / State)</label>
                <input
                  type="text"
                  required
                  value={formData.profileImage}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setFormData(prev => ({ ...prev, profileImage: newUrl }));
                    if (setAboutData) {
                      setAboutData(prev => ({ ...prev, profileImage: newUrl }));
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Owner / Founder Name</label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-serif font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Experience Badge</label>
            <input
              type="text"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Founder Biography & Story</label>
          <textarea
            rows="4"
            required
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-sans text-stone-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Our Mission</label>
            <textarea
              rows="3"
              required
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Our Vision</label>
            <textarea
              rows="3"
              required
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish About Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
}
