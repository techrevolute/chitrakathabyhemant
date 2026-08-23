import React from 'react';
import { Target, Eye, MapPin, Sparkles } from 'lucide-react';
import { appendCacheBuster } from '../lib/supabase';

export default function AboutSection({ aboutData, siteImages = [], stats, t }) {
  // Find dynamic about image from siteImages or aboutData
  const dynamicAboutImage = siteImages.find(img => img.section === 'about' && img.is_active !== false)?.image_url
    || aboutData?.profileImage
    || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000';

  const displayImage = appendCacheBuster(dynamicAboutImage);
  const ownerName = aboutData?.ownerName || 'Hemant Mandawade';
  const experienceYears = aboutData?.experience || '12+ Years';
  const storyText = aboutData?.story || t.about.story;
  const missionText = aboutData?.mission || t.about.missionText;
  const visionText = aboutData?.vision || t.about.visionText;

  return (
    <section id="about" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">MEET THE ARTIST</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.about.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            {t.about.subtitle}
          </p>
        </div>

        {/* Founder Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Owner Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200 aspect-[3/4]">
              <img
                src={displayImage}
                alt={`${ownerName} - Lead Photographer`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block mb-1">FOUNDER & LEAD PHOTOGRAPHER</span>
                <h3 className="font-serif text-2xl font-bold">{ownerName}</h3>
                <p className="text-xs text-stone-300 mt-1">{experienceYears} Master Photography Experience</p>
              </div>
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#8B0000] text-white p-6 rounded-2xl shadow-xl hidden sm:block">
              <div className="font-serif text-4xl font-bold">{experienceYears.replace(/\D/g, '') || '12'}+</div>
              <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Years Of Trust</div>
            </div>
          </div>

          {/* Story & Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B0000]">
              <Sparkles className="w-4 h-4" />
              <span>THE CHITRAKATHA PHILOSOPHY</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C] leading-snug">
              "We don't just take photographs. We weave emotional legacies."
            </h3>

            <p className="text-sm sm:text-base text-[#66625C] font-light leading-relaxed">
              {storyText}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E6E1DA] shadow-sm">
                <div className="flex items-center gap-2 text-[#8B0000] font-bold text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>{t.about.missionTitle}</span>
                </div>
                <p className="text-xs text-[#66625C] leading-relaxed font-light">
                  {missionText}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E6E1DA] shadow-sm">
                <div className="flex items-center gap-2 text-[#8B0000] font-bold text-sm mb-2">
                  <Eye className="w-4 h-4" />
                  <span>{t.about.visionTitle}</span>
                </div>
                <p className="text-xs text-[#66625C] leading-relaxed font-light">
                  {visionText}
                </p>
              </div>
            </div>

            {/* Coverage Tag */}
            <div className="bg-[#F4EFE6] rounded-2xl p-4 border border-[#E6E1DA] flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8B0000] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">{t.about.coverageTitle}</h4>
                <p className="text-xs text-[#66625C] font-light mt-0.5">{t.about.coverageText}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
