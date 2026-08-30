import React, { useState } from 'react';
import { Maximize2, Sparkles, MapPin, Play, FolderOpen, Images, ArrowRight } from 'lucide-react';
import CategoryGalleryModal from './CategoryGalleryModal';
import { appendCacheBuster, handleImageError } from '../lib/supabase';

function renderUniversalVideoPlayer(videoUrl) {
  if (!videoUrl) return null;
  const url = videoUrl.trim();

  // 1. YouTube Link
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    const ytId = ytMatch[1];
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 2. Google Drive Video Link
  let driveId = null;
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    driveId = dMatch[1];
  } else {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      driveId = idMatch[1];
    }
  }

  if (driveId && url.includes('drive.google.com')) {
    return (
      <iframe
        src={`https://drive.google.com/file/d/${driveId}/preview`}
        title="Google Drive Video Player"
        allow="autoplay"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 3. Vimeo Video Link
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
        title="Vimeo Video Player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 4. Native HTML5 Video
  return (
    <video
      key={url}
      src={url}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="w-full h-full object-contain"
    >
      Your browser does not support video playback.
    </video>
  );
}

export default function FeaturedPortfolio({ portfolio = [], videos = [], categories = [], watermark, t, onOpenBooking }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [openCategoryModal, setOpenCategoryModal] = useState(null); // Category Name string or Category object
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Dynamic Categories from State / Database (excluding hidden)
  const visibleCategories = Array.isArray(categories)
    ? categories.filter(c => !c.hidden).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : [];

  const categoryNames = ['All', ...visibleCategories.map(c => c.name)];

  // Filter out hidden media items
  const visiblePhotos = Array.isArray(portfolio) ? portfolio.filter(item => !item.hidden) : [];
  const visibleVideos = Array.isArray(videos) ? videos.filter(item => !item.hidden) : [];

  // Fuzzy Category Normalized Match Helper
  const norm = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Helper to get all photos & videos for a specific category
  const getCategoryMedia = (catName) => {
    if (!catName || catName === 'All') {
      return [
        ...visiblePhotos,
        ...visibleVideos.map(v => ({ ...v, image: v.videoUrl }))
      ];
    }
    
    const target = norm(catName);
    const catPhotos = visiblePhotos.filter(item => {
      const c = norm(item.category);
      return c.includes(target) || target.includes(c);
    });

    const catVideos = visibleVideos
      .filter(item => {
        const c = norm(item.category);
        return c.includes(target) || target.includes(c);
      })
      .map(v => ({ ...v, image: v.videoUrl }));

    const combined = [...catPhotos, ...catVideos];
    return combined.length > 0 ? combined : visiblePhotos;
  };

  // Helper to open Category Gallery Modal for a specific category
  const handleOpenCategoryGallery = (catName, startIdx = 0) => {
    setOpenCategoryModal(catName);
    setInitialImageIndex(startIdx);
  };

  // Filtered Photos & Videos for Landing Display Grid
  const filteredPhotos = activeFilter === 'All'
    ? visiblePhotos
    : visiblePhotos.filter(item => {
        const c = norm(item.category);
        const target = norm(activeFilter);
        return c.includes(target) || target.includes(c);
      });

  const filteredVideos = activeFilter === 'All'
    ? visibleVideos
    : visibleVideos.filter(item => {
        const c = norm(item.category);
        const target = norm(activeFilter);
        return c.includes(target) || target.includes(c);
      });

  // Watermark Positioning
  const getWatermarkPosClass = (pos) => {
    switch (pos) {
      case 'top-left': return 'top-4 left-4 text-left';
      case 'top-right': return 'top-4 right-4 text-right';
      case 'bottom-left': return 'bottom-4 left-4 text-left';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
      default: return 'bottom-4 right-4 text-right';
    }
  };

  const getWatermarkSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-[9px] px-2 py-0.5';
      case 'large': return 'text-sm sm:text-base px-4 py-2';
      default: return 'text-xs px-3 py-1';
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">PORTFOLIO & SHOOT GALLERIES</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.portfolio.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            Explore dedicated galleries for weddings, pre-weddings, engagements, baby shoots, drone cinema and luxury photoshoots.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 mb-14">
          {categoryNames.map((cat) => {
            const catPhotosCount = getCategoryMedia(cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs flex items-center gap-2 ${
                  activeFilter === cat
                    ? 'bg-[#8B0000] text-white shadow-lg scale-105'
                    : 'bg-white text-[#66625C] hover:bg-[#E6E1DA] hover:text-[#1C1C1C] border border-[#E6E1DA]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFilter === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  {catPhotosCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* CATEGORY GRID DISPLAY (WHEN "ALL" IS SELECTED) */}
        {activeFilter === 'All' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCategories.map((cat) => {
                const catMedia = getCategoryMedia(cat.name);
                const coverImage = cat.coverImage || catMedia[0]?.image || catMedia[0]?.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';

                return (
                  <div
                    key={cat.id || cat.name}
                    onClick={() => handleOpenCategoryGallery(cat.name, 0)}
                    className="group relative h-80 rounded-3xl overflow-hidden border border-[#E6E1DA] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 bg-stone-900"
                  >
                    {/* Background Cover Image */}
                    <img
                      src={appendCacheBuster(coverImage)}
                      alt={cat.name}
                      onError={(e) => handleImageError(e)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-90"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/30 transition-colors" />

                    {/* Content Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-300/30">
                        {catMedia.length} Items Available
                      </span>

                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#8B0000] group-hover:scale-110 transition-all shadow-lg">
                        <FolderOpen className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Content Bottom Info */}
                    <div className="relative z-10 space-y-1 transform group-hover:-translate-y-1 transition-transform">
                      <h4 className="font-serif text-2xl font-bold leading-tight text-white">{cat.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider opacity-90 group-hover:opacity-100">
                        <span>Open Gallery</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Header Bar for Active Filter Selection (When a specific category is selected) */}
        {activeFilter !== 'All' && (
          <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">
                {activeFilter} Gallery
              </h3>
              <p className="text-xs text-[#66625C]">
                Showing {filteredPhotos.length} photos {filteredVideos.length > 0 ? `& ${filteredVideos.length} videos` : ''}
              </p>
            </div>

            {getCategoryMedia(activeFilter).length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenCategoryGallery(activeFilter, 0)}
                className="px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <Images className="w-4 h-4" />
                <span>Launch {activeFilter} Fullscreen Gallery</span>
              </button>
            )}
          </div>
        )}

        {/* PHOTOS & VIDEOS MASONRY GRID (FILTERED BY SELECTED CATEGORY) */}
        {activeFilter !== 'All' && getCategoryMedia(activeFilter).length > 0 && (
          <div className="masonry-grid mb-12 transition-all duration-500 animate-fade-in">
            {getCategoryMedia(activeFilter).map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  if (item.videoUrl) {
                    setActiveVideoModal(item);
                  } else {
                    handleOpenCategoryGallery(item.category || activeFilter, idx);
                  }
                }}
                className="group relative rounded-2xl overflow-hidden bg-stone-200 border border-[#E6E1DA] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer mb-6"
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-stone-900">
                  <img
                    src={appendCacheBuster(item.thumbnail || item.image || item.image_url)}
                    alt={item.altText || item.title}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#8B0000] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {item.category || activeFilter}
                    </span>
                  </div>

                  {item.videoUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  )}

                  {/* Watermark Overlay (Admin Configured) */}
                  {watermark && watermark.enabled && !item.videoUrl && (
                    <div
                      className={`absolute pointer-events-none watermark-overlay z-10 ${getWatermarkPosClass(watermark.position)}`}
                      style={{ opacity: watermark.opacity || 0.65 }}
                    >
                      <div className={`flex items-center gap-1.5 bg-black/40 backdrop-blur-xs font-serif font-semibold text-white border border-white/20 rounded ${getWatermarkSizeClass(watermark.size)}`}>
                        {watermark.logoUrl ? (
                          <img src={watermark.logoUrl} alt="Watermark Logo" className="h-4 w-auto object-contain" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-amber-300" />
                        )}
                        <span>{watermark.text || 'CHITRAKATHA BY HEMANT'}</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                    <h3 className="font-serif text-xl font-bold leading-tight mb-1">{item.title}</h3>
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DEDICATED CATEGORY GALLERY LIGHTBOX MODAL */}
      {openCategoryModal && (
        <CategoryGalleryModal
          categoryName={openCategoryModal}
          images={getCategoryMedia(openCategoryModal)}
          initialIndex={initialImageIndex}
          watermark={watermark}
          onClose={() => setOpenCategoryModal(null)}
          onOpenBooking={onOpenBooking}
        />
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-black rounded-3xl overflow-hidden max-w-4xl w-full border border-white/20 shadow-2xl">
            <div className="p-4 bg-stone-900 text-white flex justify-between items-center border-b border-stone-800">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">{activeVideoModal.category}</span>
                <h4 className="font-serif text-lg font-bold">{activeVideoModal.title}</h4>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              {renderUniversalVideoPlayer(activeVideoModal.videoUrl)}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
