import React from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react';

export default function LightboxModal({ item, watermark, items, onSelect, onClose, onOpenBooking }) {
  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % items.length;
    onSelect(items[nextIndex]);
  };

  const getWatermarkPosClass = (pos) => {
    switch (pos) {
      case 'top-left': return 'top-6 left-6 text-left';
      case 'top-right': return 'top-6 right-6 text-right';
      case 'bottom-left': return 'bottom-6 left-6 text-left';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
      default: return 'bottom-6 right-6 text-right';
    }
  };

  const getWatermarkSizeClass = (size) => {
    switch (size) {
      case 'small': return 'text-[10px] px-2 py-0.5';
      case 'large': return 'text-base sm:text-lg px-5 py-2.5';
      default: return 'text-xs sm:text-sm px-3.5 py-1.5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 animate-fade-in text-white">
      
      {/* Top Header Actions */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
            {item.category}
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
        title="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
        title="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image View Container */}
      <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <img
          src={item.image}
          alt={item.title}
          className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
        />

        {/* Watermarked Overlay (Admin Managed) */}
        {watermark && watermark.enabled && (
          <div
            className={`absolute pointer-events-none watermark-overlay z-20 ${getWatermarkPosClass(watermark.position)}`}
            style={{ opacity: watermark.opacity || 0.65 }}
          >
            <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-md border border-white/20 text-white font-serif tracking-widest ${getWatermarkSizeClass(watermark.size)}`}>
              {watermark.logoUrl ? (
                <img src={watermark.logoUrl} alt="Watermark Logo" className="h-5 w-auto object-contain" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{watermark.text || 'CHITRAKATHA BY HEMANT'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-40 max-w-xl mx-auto bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-lg font-bold text-white">{item.title}</h4>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-stone-300 mt-1">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
                {item.location}
              </span>
            )}
            {item.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {item.date}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => { onClose(); onOpenBooking(); }}
          className="px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
        >
          Book Shoot Like This
        </button>
      </div>

    </div>
  );
}
