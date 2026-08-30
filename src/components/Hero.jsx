import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles, ArrowRight, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { appendCacheBuster } from '../lib/supabase';

export default function Hero({ heroData, siteImages = [], t, onOpenBooking, setActivePage }) {
  const videoRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const isVideoMedia = (url) => {
    if (!url) return false;
    return url.startsWith('blob:') || url.startsWith('data:video') || Boolean(url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i));
  };

  // Extract hero slides from siteImages or heroData
  const heroItems = siteImages.filter(img => img.section === 'hero' && img.is_active !== false);
  const primaryRaw = heroData?.url || (heroItems.length > 0 ? heroItems[0].image_url : 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4');

  const slides = [
    {
      url: isVideoMedia(primaryRaw) ? primaryRaw : appendCacheBuster(primaryRaw),
      title: heroData?.title || t.hero.title,
      isVideo: isVideoMedia(primaryRaw)
    },
    ...heroItems
      .filter(item => item.image_url && item.image_url !== primaryRaw)
      .map(item => ({
        url: isVideoMedia(item.image_url) ? item.image_url : appendCacheBuster(item.image_url),
        title: item.title || heroData?.title || t.hero.title,
        isVideo: isVideoMedia(item.image_url)
      }))
  ];

  const currentSlide = slides[currentSlideIndex % slides.length] || slides[0];

  // Auto slide interval if multiple hero images/videos exist
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToPortfolio = () => {
    setActivePage('portfolio');
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentSlide.isVideo && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playsInline = true;
      try {
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Hero video autoplay prevented or failed:', err);
          });
        }
      } catch (e) {
        console.warn('Video load error:', e);
      }
    }
  }, [currentSlide.url, currentSlide.isVideo]);

  return (
    <section id="home" className="relative w-full h-screen min-h-[650px] flex items-center justify-center overflow-hidden bg-black">
      
      {/* Dynamic Background Media (Video or Image Slider) */}
      {currentSlide.isVideo ? (
        <video
          key={currentSlide.url}
          ref={videoRef}
          src={currentSlide.url}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          preload="auto"
          onError={(e) => {
            console.warn('Hero video error, setting reliable fallback video');
            if (e.target && e.target.src !== 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4') {
              e.target.src = 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-and-holding-hands-43892-large.mp4';
              e.target.load();
              e.target.play().catch(() => {});
            }
          }}
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000 pointer-events-none"
        />
      ) : (
        <div
          key={currentSlide.url}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${currentSlide.url})` }}
        />
      )}

      {/* Cinematic Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-black/40 to-black/70 z-10" />
      <div className="absolute inset-0 bg-radial-vignette opacity-50 z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
        
        {/* Luxury Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-semibold mb-6 animate-fade-in shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{t.hero.tagline}</span>
        </div>

        {/* Cinematic Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-2xl mb-6">
          {heroData?.title || t.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto font-sans text-base sm:text-lg md:text-xl text-stone-200 font-light leading-relaxed mb-10 drop-shadow-md">
          {heroData?.subtitle || t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={scrollToPortfolio}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C1C1C] font-semibold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            <span>{t.hero.viewPortfolio}</span>
            <ArrowRight className="w-4 h-4 text-[#8B0000]" />
          </button>

          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white font-semibold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 border border-red-500/30 transform hover:-translate-y-1"
          >
            <span>{t.hero.bookNow}</span>
          </button>
        </div>

        {/* Experience Trust Pill */}
        <div className="mt-12 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-stone-300">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>12+ Years Experience • All Over Maharashtra Coverage</span>
        </div>

      </div>

      {/* Hero Slider Dots & Navigation Controls (If multiple slides exist) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlideIndex % slides.length ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 cursor-pointer hover:text-white transition-colors" onClick={scrollToPortfolio}>
        <span className="text-[11px] font-sans tracking-[0.2em] uppercase font-medium">{t.hero.scroll}</span>
        <div className="p-1 rounded-full border border-white/30 animate-bounce">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

    </section>
  );
}
