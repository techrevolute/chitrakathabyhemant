import React, { useState, useEffect, useCallback, useRef } from 'react';

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
        className="w-full h-[65vh] min-w-[300px] sm:min-w-[650px] border-0 rounded-2xl"
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
        className="w-full h-[65vh] min-w-[300px] sm:min-w-[650px] border-0 rounded-2xl"
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
        className="w-full h-[65vh] min-w-[300px] sm:min-w-[650px] border-0 rounded-2xl"
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
      className="max-w-full max-h-[72vh] object-contain rounded-2xl"
    >
      Your browser does not support video playback.
    </video>
  );
}

const isVideoMedia = (url) => {
  if (!url) return false;
  return url.startsWith('blob:') || url.startsWith('data:video') || Boolean(url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i)) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('drive.google.com');
};
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, MapPin, Calendar, Sparkles, CalendarCheck } from 'lucide-react';
import { appendCacheBuster, handleImageError } from '../lib/supabase';

export default function CategoryGalleryModal({
  categoryName = 'Gallery',
  images = [],
  initialIndex = 0,
  watermark = null,
  onClose,
  onOpenBooking
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const activePhoto = images[currentIndex] || images[0];
  const totalPhotos = images.length;
  const thumbnailsRef = useRef(null);

  // Preload Next & Previous Images for Instantaneous Switching
  useEffect(() => {
    if (totalPhotos <= 1) return;
    const nextIdx = (currentIndex + 1) % totalPhotos;
    const prevIdx = (currentIndex - 1 + totalPhotos) % totalPhotos;

    if (images[nextIdx]?.image || images[nextIdx]?.image_url) {
      const imgNext = new Image();
      imgNext.src = appendCacheBuster(images[nextIdx].image || images[nextIdx].image_url);
    }
    if (images[prevIdx]?.image || images[prevIdx]?.image_url) {
      const imgPrev = new Image();
      imgPrev.src = appendCacheBuster(images[prevIdx].image || images[prevIdx].image_url);
    }
  }, [currentIndex, images, totalPhotos]);

  // Handle Prev/Next Index
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  // Desktop Keyboard Arrow Navigation & ESC to Close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  // Scroll Active Thumbnail into View
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Mobile Touch Swipe Handlers (Min 40px swipe threshold)
  const minSwipeDistance = 40;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Watermark Positioning Helpers
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

  if (!activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl animate-fade-in text-white select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Top Fixed Control Header */}
      <div className="w-full px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-50">
        
        {/* Category & Counter Badges */}
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-[#8B0000] text-white text-xs font-bold uppercase tracking-wider shadow-md">
            {categoryName}
          </span>

          <span className="text-xs font-mono font-bold text-stone-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white transition-transform hover:scale-105 shadow-lg"
            title="Close Gallery (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Main Image View Area */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        
        {/* Previous Chevron Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-[#8B0000] text-white transition-all hover:scale-110 shadow-2xl backdrop-blur-md border border-white/10 cursor-pointer"
            title="Previous Image (← or A)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Next Chevron Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-[#8B0000] text-white transition-all hover:scale-110 shadow-2xl backdrop-blur-md border border-white/10 cursor-pointer"
            title="Next Image (→ or D)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Central Aspect-Ratio Main Image Container */}
        <div className="relative max-w-6xl max-h-[72vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
          {isVideoMedia(activePhoto.image || activePhoto.image_url) ? (
            renderUniversalVideoPlayer(activePhoto.image || activePhoto.image_url)
          ) : (
            <img
              key={activePhoto.id || currentIndex}
              src={appendCacheBuster(activePhoto.image || activePhoto.image_url)}
              alt={activePhoto.title || categoryName}
              onError={(e) => handleImageError(e)}
              className="max-w-full max-h-[72vh] object-contain transition-opacity duration-300"
              loading="eager"
            />
          )}

          {/* Watermark Overlay if Admin Enabled */}
          {watermark && watermark.enabled && (
            <div
              className={`absolute pointer-events-none watermark-overlay z-20 ${getWatermarkPosClass(watermark.position)}`}
              style={{ opacity: watermark.opacity || 0.65 }}
            >
              <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-md border border-white/20 text-white font-serif tracking-widest ${getWatermarkSizeClass(watermark.size)}`}>
                {watermark.logoUrl ? (
                  <img src={watermark.logoUrl} alt="Watermark Logo" onError={(e) => handleImageError(e)} className="h-5 w-auto object-contain" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{watermark.text || 'CHITRAKATHA BY HEMANT'}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Info Bar & Thumbnail Carousel Strip */}
      <div className="w-full bg-black/85 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 space-y-3 z-40">
        
        {/* Caption & Booking Link Bar */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-base sm:text-xl font-bold text-white leading-tight">
              {activePhoto.title || `${categoryName} Photograph`}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-stone-400 mt-0.5 font-sans">
              {activePhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
                  {activePhoto.location}
                </span>
              )}
              {activePhoto.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {activePhoto.date}
                </span>
              )}
              {activePhoto.description && (
                <span className="hidden md:inline text-stone-300 truncate max-w-md">
                  • {activePhoto.description}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenBooking) onOpenBooking();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Shoot for {categoryName}</span>
          </button>
        </div>

        {/* Thumbnail Carousel Strip */}
        {totalPhotos > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex items-center gap-2.5 overflow-x-auto max-w-6xl mx-auto py-1 scrollbar-none justify-start sm:justify-center"
          >
            {images.map((photo, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={photo.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-300 border-2 cursor-pointer ${
                    isActive
                      ? 'border-[#8B0000] scale-110 shadow-lg ring-2 ring-amber-400/50 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105 bg-stone-900'
                  }`}
                >
                  <img
                    src={appendCacheBuster(photo.image || photo.image_url)}
                    alt={photo.title || `Thumbnail ${idx + 1}`}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#8B0000]/20 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
