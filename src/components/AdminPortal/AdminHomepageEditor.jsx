import React, { useState, useRef } from 'react';
import { Save, Eye, Video, Sparkles, Check, Star, ArrowUp, ArrowDown, Trash2, RefreshCw, Plus, Upload, FolderOpen, AlertCircle } from 'lucide-react';

export default function AdminHomepageEditor({ heroData, setHeroData, portfolio = [], setPortfolio }) {
  const [formData, setFormData] = useState({ ...heroData });
  const [saved, setSaved] = useState(false);
  const [urlWarning, setUrlWarning] = useState(false);

  const heroVideoFileRef = useRef(null);

  const PRESET_VIDEOS = [
    {
      label: 'Wedding Couple Sunset Walk',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4'
    },
    {
      label: 'Photographer & Bride Shoot',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-43889-large.mp4'
    },
    {
      label: 'Bride & Groom Romantic Hug',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-hugging-43891-large.mp4'
    }
  ];

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Live Sync video URL change to main website state
  const applyVideoUrl = (newUrl) => {
    const trimmed = newUrl ? newUrl.trim() : '';
    setFormData(prev => ({ ...prev, url: trimmed }));
    setHeroData(prev => ({ ...prev, url: trimmed }));
    triggerSaved();
  };

  // Select Hero Video File directly from computer with instant live sync
  const handleHeroVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const persistentDataUrl = event.target.result;
      setFormData(prev => ({ ...prev, url: persistentDataUrl }));
      setHeroData(prev => ({ ...prev, url: persistentDataUrl }));
      setUrlWarning(false);
      triggerSaved();
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHero = (e) => {
    e.preventDefault();

    let finalUrl = formData.url ? formData.url.trim() : '';

    // Check if user pasted a search result webpage link (e.g. Bing/Google search)
    const isSearchEngineWebpage = finalUrl.includes('bing.com') || finalUrl.includes('google.com') || finalUrl.includes('youtube.com/watch');

    if (isSearchEngineWebpage || !finalUrl) {
      setUrlWarning(true);
      finalUrl = 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4';
      setFormData(prev => ({ ...prev, url: finalUrl }));
    } else {
      setUrlWarning(false);
    }

    setHeroData({ ...formData, url: finalUrl });
    triggerSaved();
  };

  // Featured Photos Management
  const featuredPhotos = Array.isArray(portfolio)
    ? portfolio.filter(p => p.featured)
    : [];

  const nonFeaturedPhotos = Array.isArray(portfolio)
    ? portfolio.filter(p => !p.featured)
    : [];

  const handleToggleFeatured = (id) => {
    setPortfolio(portfolio.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    triggerSaved();
  };

  const handleReplacePhotoUrl = (id, newUrl) => {
    if (!newUrl) return;
    setPortfolio(portfolio.map(p => p.id === id ? { ...p, image: newUrl } : p));
    triggerSaved();
  };

  const handleReorderFeatured = (id, direction) => {
    const idx = portfolio.findIndex(p => p.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= portfolio.length) return;

    const updated = [...portfolio];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPortfolio(updated);
    triggerSaved();
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Hidden Native Video File Input */}
      <input
        type="file"
        ref={heroVideoFileRef}
        onChange={handleHeroVideoFileSelect}
        accept="video/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Homepage & Featured Gallery Editor</h2>
          <p className="text-xs text-stone-400">Edit hero background video, typography, and select/reorder Homepage Featured Photos</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Video Live & Published
          </span>
        )}
      </div>

      {/* Hero Section Form */}
      <form onSubmit={handleSaveHero} className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Cinematic Hero Banner</h3>

        {urlWarning && (
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Note: Search engine webpage links (Bing/Google search) cannot be played directly inside video tags.</p>
              <p className="text-stone-300 mt-0.5">We automatically converted your Hero background to a high-definition 4K photography video stream MP4!</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Background Video MP4 File / URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.url || ''}
                onChange={(e) => applyVideoUrl(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
                placeholder="Direct MP4 URL or select video file from PC"
              />
              <button
                type="button"
                onClick={() => heroVideoFileRef.current?.click()}
                className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 border border-stone-700"
              >
                <FolderOpen className="w-4 h-4" /> Select Video from PC
              </button>
            </div>
          </div>

          {/* Preset Photography Video Links */}
          <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Quick Presets (1-Click Direct 4K MP4 Streams):</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_VIDEOS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyVideoUrl(preset.url)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    formData.url === preset.url ? 'bg-[#8B0000] text-white font-bold' : 'bg-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  🎬 {preset.label}
                </button>
              ))}
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

      {/* HOMEPAGE FEATURED GALLERY MANAGER */}
      <div className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold">Homepage Featured Gallery Manager</h3>
              <p className="text-xs text-stone-400">Select photos to feature on the homepage, remove photos, reorder, or replace image URLs</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            {featuredPhotos.length} Featured Photos Selected
          </span>
        </div>

        {/* Selected Featured Photos List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Currently Featured Photos on Homepage</h4>
          
          {featuredPhotos.length === 0 ? (
            <div className="text-center py-8 text-stone-400 bg-stone-900/50 rounded-2xl border border-stone-800">
              No photos currently selected as Featured. Select from the available pool below.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredPhotos.map((item, idx) => (
                <div key={item.id} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-3 flex flex-col justify-between">
                  <div className="flex gap-4 items-start">
                    <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-stone-800 shrink-0" />
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="font-serif text-base font-bold text-white truncate">{item.title}</h5>
                        
                        {/* Display Reorder Controls */}
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleReorderFeatured(item.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderFeatured(item.id, 'down')}
                            disabled={idx === featuredPhotos.length - 1}
                            className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-amber-300 block">{item.category} • {item.location}</span>
                      
                      {/* Replace Image URL Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newUrl = window.prompt("Enter replacement image URL:", item.image);
                          if (newUrl) handleReplacePhotoUrl(item.id, newUrl);
                        }}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 pt-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Replace Image URL
                      </button>
                    </div>
                  </div>

                  {/* Remove from Featured Button */}
                  <div className="pt-2 border-t border-stone-800/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item.id)}
                      className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from Featured</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Pool of Non-Featured Photos */}
        {nonFeaturedPhotos.length > 0 && (
          <div className="space-y-4 border-t border-stone-800 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Available Photos to Add to Homepage</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nonFeaturedPhotos.map((item) => (
                <div key={item.id} className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                    <span className="text-[10px] text-stone-400 uppercase block">{item.category}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item.id)}
                      className="mt-1 text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Feature on Homepage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
