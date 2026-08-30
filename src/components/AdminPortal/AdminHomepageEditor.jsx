import React, { useState, useRef } from 'react';
import { Save, Check, Plus, Upload, FolderOpen, AlertCircle, Trash2, ArrowUp, ArrowDown, RefreshCw, Star } from 'lucide-react';
import { apiUploadStorageFile, apiSaveSiteImage, apiSaveHeroVideo, apiDeleteSiteImage, appendCacheBuster } from '../../lib/supabase';
import { setVideoBlob, removeVideoBlob } from '../../lib/storage';

export default function AdminHomepageEditor({ heroData, setHeroData, siteImages = [], setSiteImages, portfolio = [], setPortfolio }) {
  const [formData, setFormData] = useState({ ...heroData });
  const [toastMessage, setToastMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const heroFileRef = useRef(null);
  const directVideoRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Direct Homepage Hero Video Upload from PC (Supabase Cloud Storage Upload + Database Persistence)
  const handleDirectHeroVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type ? file.type.startsWith('video/') : Boolean(file.name?.match(/\.(mp4|webm|mov|m4v)$/i));
    if (!isVideo) {
      showToast('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }

    // Check size limit (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      showToast('Video file is too large. Please select a video under 500MB.');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading video to cloud storage...');

    try {
      // 1. Upload Video File to Supabase Storage Bucket ('website-images')
      const uploadResult = await apiUploadStorageFile('website-images', file);

      if (!uploadResult || uploadResult.error || !uploadResult.publicUrl) {
        showToast(uploadResult?.error || 'Video upload failed.');
        setUploading(false);
        setUploadStatus('');
        return;
      }

      setUploadStatus('Saving to database...');

      const permanentVideoUrl = uploadResult.publicUrl;
      const storagePath = uploadResult.storagePath;

      // 2. Save Active Video to Database Table (site_images) & Deactivate Old Hero Videos
      const savedRecord = await apiSaveHeroVideo(
        permanentVideoUrl,
        formData.title || 'Homepage Hero Video',
        storagePath
      );

      if (!savedRecord || savedRecord.error || !savedRecord.image_url) {
        showToast(savedRecord?.error || 'Video uploaded but could not be published. Please try again.');
        setUploading(false);
        setUploadStatus('');
        return;
      }

      const finalUrl = savedRecord.image_url;

      // 3. Update Frontend React State
      setFormData(prev => ({ ...prev, url: finalUrl }));
      setHeroData(prev => ({ ...prev, url: finalUrl }));

      if (setSiteImages) {
        setSiteImages(prev => {
          const others = prev.filter(img => img.section !== 'hero');
          return [savedRecord, ...others];
        });
      }

      // 4. Show success ONLY after both Storage upload and Database save succeed
      showToast('Video published successfully.');
    } catch (err) {
      console.error('Error uploading hero video:', err);
      showToast('Video upload failed.');
    } finally {
      setUploading(false);
      setUploadStatus('');
      if (directVideoRef.current) directVideoRef.current.value = '';
    }
  };

  // Hero section images/videos list
  const heroSlides = siteImages.filter(img => img.section === 'hero' && img.is_active !== false);

  // Add new Hero Image/Video from file upload
  const handleAddHeroFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Uploading video to cloud storage...');

    try {
      const result = await apiUploadStorageFile('website-images', file);
      if (result && result.publicUrl) {
        setUploadStatus('Saving to database...');
        const busterUrl = appendCacheBuster(result.publicUrl);
        const newRecord = await apiSaveSiteImage({
          section: 'hero',
          image_url: busterUrl,
          storage_path: result.storagePath,
          title: `Hero Slide ${heroSlides.length + 1}`,
          category: 'Hero',
          display_order: heroSlides.length + 1,
          is_active: true
        });

        if (setSiteImages) {
          setSiteImages(prev => [...prev, newRecord]);
        }
        setFormData(prev => ({ ...prev, url: busterUrl }));
        setHeroData(prev => ({ ...prev, url: busterUrl }));
        showToast('Published successfully!');
      } else {
        showToast('Video upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Error adding hero file:', err);
      showToast('Video upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  // Delete Hero Slide
  const handleDeleteHeroSlide = async (id, storagePath) => {
    if (window.confirm('Are you sure you want to delete this Hero image/video?')) {
      await apiDeleteSiteImage(id, storagePath);
      if (setSiteImages) {
        setSiteImages(prev => prev.filter(img => img.id !== id));
      }
      showToast('Media deleted successfully');
    }
  };

  // Reorder Hero Slide
  const handleReorderHeroSlide = (id, direction) => {
    const idx = heroSlides.findIndex(img => img.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;

    const updated = [...heroSlides];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Update display_order
    const finalSlides = updated.map((item, i) => ({ ...item, display_order: i + 1 }));
    if (setSiteImages) {
      setSiteImages(prev => {
        const others = prev.filter(img => img.section !== 'hero');
        return [...others, ...finalSlides];
      });
    }
    showToast('Hero order updated successfully');
  };

  // Save/Publish Hero Banner
  const handleSaveHero = async (e) => {
    e.preventDefault();
    if (!formData.url) {
      showToast('Missing video URL. Please select a video file or enter a valid URL.');
      return;
    }

    setUploading(true);
    setUploadStatus('Saving to database...');

    try {
      if (formData.url.startsWith('http://') || formData.url.startsWith('https://')) {
        await removeVideoBlob('chitrakatha_hero_video_blob');
      }

      const savedRecord = await apiSaveHeroVideo(
        formData.url,
        formData.title || 'Homepage Hero Video',
        null
      );

      if (savedRecord && savedRecord.image_url) {
        const finalUrl = savedRecord.image_url;
        setHeroData({ ...formData, url: finalUrl });
        if (setSiteImages) {
          setSiteImages(prev => {
            const others = prev.filter(img => img.section !== 'hero');
            return [savedRecord, ...others];
          });
        }
        showToast('Published successfully!');
      } else {
        showToast('Video upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Error saving hero:', err);
      showToast('Video upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  // Featured Photos Management
  const featuredPhotos = Array.isArray(portfolio) ? portfolio.filter(p => p.featured) : [];
  const nonFeaturedPhotos = Array.isArray(portfolio) ? portfolio.filter(p => !p.featured) : [];

  const handleToggleFeatured = (id) => {
    setPortfolio(portfolio.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    showToast('Featured list updated');
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={heroFileRef}
        onChange={handleAddHeroFile}
        accept="image/*,video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={directVideoRef}
        onChange={handleDirectHeroVideoUpload}
        accept="video/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Homepage & Hero Section Manager</h2>
          <p className="text-xs text-stone-400">Manage hero slider images/videos, main headline, and featured gallery</p>
        </div>

        {uploadStatus && (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950 border border-amber-800 text-amber-300 text-xs font-bold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {uploadStatus}
          </span>
        )}

        {!uploadStatus && toastMessage && (
          <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold animate-fade-in ${
            toastMessage.includes('failed') ? 'bg-red-950 border border-red-800 text-red-300' : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
          }`}>
            {toastMessage.includes('failed') ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4" />}
            <span>{toastMessage}</span>
          </span>
        )}
      </div>

      {/* HERO SLIDER MEDIA MANAGER */}
      <div className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Hero Slider Images & Videos ({heroSlides.length})</h3>
            <p className="text-xs text-stone-400 mt-0.5">Add, reorder, or delete hero background images/videos for the home slider</p>
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => heroFileRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-bold uppercase flex items-center gap-2 shadow-md shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Add Hero Image/Video'}</span>
          </button>
        </div>

        {/* Hero Slides List Grid */}
        {heroSlides.length === 0 ? (
          <div className="p-6 text-center text-stone-400 bg-stone-900/50 rounded-2xl border border-stone-800 text-xs">
            Using default hero background video. Click "Add Hero Image/Video" above to upload custom hero slides!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((item, idx) => (
              <div key={item.id} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {item.image_url?.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
                    <video src={item.image_url} className="w-20 h-16 rounded-xl object-cover border border-stone-800 shrink-0" />
                  ) : (
                    <img src={item.image_url} alt={item.title} className="w-20 h-16 rounded-xl object-cover border border-stone-800 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.title || `Hero Slide ${idx + 1}`}</h5>
                    <span className="text-[10px] text-stone-400 block font-mono">Order: #{idx + 1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleReorderHeroSlide(item.id, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReorderHeroSlide(item.id, 'down')}
                    disabled={idx === heroSlides.length - 1}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteHeroSlide(item.id, item.storage_path)}
                    className="p-1.5 rounded-lg bg-red-950 text-red-300 hover:bg-red-900 border border-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Headline Form */}
      <form onSubmit={handleSaveHero} className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Hero Headline & Typography</h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Primary Video/Image URL (Default)</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Paste Video URL or click button to pick video file from computer"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => directVideoRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                title="Upload Homepage Video File From Computer"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Select PC Video</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Main Title</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-lg font-serif font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Subtitle</label>
            <textarea
              rows="2"
              required
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Hero Banner</span>
          </button>
        </div>
      </form>

    </div>
  );
}
