import React, { useState } from 'react';
import { Maximize2, Sparkles, MapPin, Play } from 'lucide-react';
import LightboxModal from './LightboxModal';

export default function FeaturedPortfolio({ portfolio = [], videos = [], categories = [], watermark, t, onOpenBooking }) {
  // Default selection is 'All'
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Dynamic Categories from State / Database (excluding hidden)
  const visibleCategories = Array.isArray(categories)
    ? categories.filter(c => !c.hidden).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : [];

  const categoryNames = ['All', ...visibleCategories.map(c => c.name)];

  // Filter out hidden media items
  const visiblePhotos = Array.isArray(portfolio) ? portfolio.filter(item => !item.hidden) : [];
  const visibleVideos = Array.isArray(videos) ? videos.filter(item => !item.hidden) : [];

  // Filter media based on selected category (If 'All', show everything!)
  const filteredPhotos = activeCategory === 'All'
    ? visiblePhotos
    : visiblePhotos.filter(item => 
        item.category && item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
      );

  // Auto Fallback: If no photos are explicitly marked featured, fallback to non-hidden photos so gallery is never empty!
  const featuredOnlyPhotos = filteredPhotos.filter(p => p.featured);
  const displayPhotos = featuredOnlyPhotos.length > 0 ? featuredOnlyPhotos : filteredPhotos;

  const filteredVideos = activeCategory === 'All'
    ? visibleVideos
    : visibleVideos.filter(item => 
        item.category && item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
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
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">PORTFOLIO GALLERY</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.portfolio.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Clean Category Navigation Pills (No Brackets) */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 mb-12">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#8B0000] text-white shadow-md font-semibold scale-105'
                  : 'bg-white text-[#1C1C1C] hover:bg-[#F4EFE6] border border-[#E6E1DA] shadow-xs'
              }`}
            >
              {cat === 'All' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Media Stats Bar */}
        <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4 mb-8">
          <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">
            {activeCategory === 'All' ? 'Featured Portfolio Highlights' : `${activeCategory} Gallery`}
          </h3>
          <span className="text-xs text-[#66625C] font-mono">
            {displayPhotos.length} Photos {filteredVideos.length > 0 ? `• ${filteredVideos.length} Videos` : ''}
          </span>
        </div>

        {/* Empty Fallback */}
        {displayPhotos.length === 0 && filteredVideos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E1DA] text-[#66625C] font-light">
            No media uploaded to <strong>"{activeCategory}"</strong> yet. Manage media via the Admin Dashboard.
          </div>
        )}

        {/* PHOTOS MASONRY GRID */}
        {displayPhotos.length > 0 && (
          <div className="masonry-grid mb-12 transition-all duration-500 animate-fade-in">
            {displayPhotos.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-stone-200 border border-[#E6E1DA] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer mb-6"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.altText || item.title}
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
              {activeCategory === 'All' ? 'Cinematic Films' : `${activeCategory} Videos`} ({filteredVideos.length})
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

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <LightboxModal
          item={activeLightboxItem}
          watermark={watermark}
          items={displayPhotos}
          onSelect={setActiveLightboxItem}
          onClose={() => setActiveLightboxItem(null)}
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
