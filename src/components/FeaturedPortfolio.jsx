import React, { useState } from 'react';
import { Maximize2, Sparkles, MapPin, Play, FolderOpen, Images, ArrowRight } from 'lucide-react';
import CategoryGalleryModal from './CategoryGalleryModal';
import { appendCacheBuster, handleImageError } from '../lib/supabase';

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

  // Helper to get photos for a specific category
  const getCategoryPhotos = (catName) => {
    if (!catName || catName === 'All') return visiblePhotos;
    return visiblePhotos.filter(item =>
      item.category && item.category.toLowerCase().trim() === catName.toLowerCase().trim()
    );
  };

  // Helper to open Category Gallery Modal for a specific category
  const handleOpenCategoryGallery = (catName, startIdx = 0) => {
    setOpenCategoryModal(catName);
    setInitialImageIndex(startIdx);
  };

  // Filtered Photos for Landing Display Grid
  const filteredPhotos = activeFilter === 'All'
    ? visiblePhotos
    : getCategoryPhotos(activeFilter);

  const filteredVideos = activeFilter === 'All'
    ? visibleVideos
    : visibleVideos.filter(item =>
        item.category && item.category.toLowerCase().trim() === activeFilter.toLowerCase().trim()
      );

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
            const catPhotosCount = getCategoryPhotos(cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#8B0000] text-white shadow-md font-semibold scale-105'
                    : 'bg-white text-[#1C1C1C] hover:bg-[#F4EFE6] border border-[#E6E1DA] shadow-xs'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  activeFilter === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#8B0000]'
                }`}>
                  {catPhotosCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* CATEGORY SHOWCASE CARDS GRID (WHEN 'All' IS SELECTED) */}
        {/* ================================================================= */}
        {activeFilter === 'All' && visibleCategories.length > 0 && (
          <div className="mb-20 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">Explore Shoot Categories</h3>
                <p className="text-xs text-[#66625C]">Click any category card to open its dedicated photo gallery</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#8B0000] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E6E1DA]">
                {visibleCategories.length} Active Categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCategories.map((cat) => {
                const catPhotos = getCategoryPhotos(cat.name);
                const coverImg = cat.coverImage || catPhotos[0]?.image || catPhotos[0]?.image_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800';

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleOpenCategoryGallery(cat.name, 0)}
                    className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-[#E6E1DA] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3] flex flex-col justify-end p-6 text-white"
                  >
                    {/* Background Category Image */}
                    <img
                      src={appendCacheBuster(coverImg)}
                      alt={`${cat.name} Portfolio`}
                      onError={(e) => handleImageError(e)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-colors" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {catPhotos.length} {catPhotos.length === 1 ? 'Photo' : 'Photos'}
                      </span>

                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#8B0000] group-hover:scale-110 transition-all shadow-lg">
                        <FolderOpen className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Content Bottom Info */}
                    <div className="relative z-10 space-y-1 transform group-hover:-translate-y-1 transition-transform">
                      <h4 className="font-serif text-2xl font-bold leading-tight drop-shadow-md text-white">
                        {cat.name}
                      </h4>
                      
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider opacity-90 group-hover:opacity-100">
                        <span>Open Category Gallery</span>
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
                {activeFilter} Photos
              </h3>
              <p className="text-xs text-[#66625C]">
                Showing {filteredPhotos.length} photos {filteredVideos.length > 0 ? `& ${filteredVideos.length} videos` : ''}
              </p>
            </div>

            {filteredPhotos.length > 0 && (
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

        {/* Empty Fallback when a category has 0 photos */}
        {activeFilter !== 'All' && filteredPhotos.length === 0 && filteredVideos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E1DA] text-[#66625C] font-light">
            No media uploaded to <strong>"{activeFilter}"</strong> yet. Manage photos via the Admin Dashboard.
          </div>
        )}

        {/* PHOTOS MASONRY GRID (FILTERED BY SELECTED CATEGORY) */}
        {activeFilter !== 'All' && filteredPhotos.length > 0 && (
          <div className="masonry-grid mb-12 transition-all duration-500 animate-fade-in">
            {filteredPhotos.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenCategoryGallery(item.category || activeFilter, idx)}
                className="group relative rounded-2xl overflow-hidden bg-stone-200 border border-[#E6E1DA] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer mb-6"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={appendCacheBuster(item.image || item.image_url)}
                    alt={item.altText || item.title}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#8B0000] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Watermark Overlay (Admin Configured) */}
                  {watermark && watermark.enabled && (
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

        {/* VIDEOS GRID */}
        {filteredVideos.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-serif text-xl font-bold text-[#1C1C1C] flex items-center gap-2">
              <Play className="w-5 h-5 text-[#8B0000] fill-current" />
              {activeFilter === 'All' ? 'Cinematic Films' : `${activeFilter} Videos`} ({filteredVideos.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideoModal(vid)}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-[#E6E1DA] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-[#8B0000] text-[#8B0000] group-hover:text-white flex items-center justify-center transition-all shadow-xl">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-serif text-base font-bold text-[#1C1C1C] leading-snug">{vid.title}</h5>
                    <span className="text-xs text-[#66625C] block mt-1">{vid.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* DEDICATED CATEGORY GALLERY LIGHTBOX MODAL */}
      {openCategoryModal && (
        <CategoryGalleryModal
          categoryName={openCategoryModal}
          images={getCategoryPhotos(openCategoryModal)}
          initialIndex={initialImageIndex}
          watermark={watermark}
          onClose={() => setOpenCategoryModal(null)}
          onOpenBooking={onOpenBooking}
        />
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-black rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20">
            <div className="p-4 bg-stone-900 text-white flex justify-between items-center">
              <h4 className="font-serif text-lg font-bold">{activeVideoModal.title}</h4>
              <button onClick={() => setActiveVideoModal(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            <video controls autoPlay className="w-full max-h-[70vh]">
              <source src={activeVideoModal.videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </section>
  );
}
