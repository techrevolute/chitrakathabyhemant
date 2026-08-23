import React from 'react';
import { Award, Camera, MapPin, Smile, Image, Film } from 'lucide-react';

export default function ExperienceSection({ stats, t }) {
  const getIcon = (id) => {
    switch (id) {
      case 'years': return <Award className="w-6 h-6 text-[#8B0000]" />;
      case 'projects': return <Camera className="w-6 h-6 text-[#8B0000]" />;
      case 'cities': return <MapPin className="w-6 h-6 text-[#8B0000]" />;
      case 'clients': return <Smile className="w-6 h-6 text-[#8B0000]" />;
      case 'photos': return <Image className="w-6 h-6 text-[#8B0000]" />;
      case 'videos': return <Film className="w-6 h-6 text-[#8B0000]" />;
      default: return <Award className="w-6 h-6 text-[#8B0000]" />;
    }
  };

  return (
    <section className="relative py-16 bg-[#F4EFE6] border-y border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">PROVEN EXCELLENCE</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C] mt-2">
            12+ Years of Cinematic Trust Across Maharashtra
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 text-center border border-[#E6E1DA] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-[#FAF7F2] mb-4">
                {getIcon(item.id)}
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight">
                {item.value}{item.suffix}
              </div>
              <div className="text-xs sm:text-sm font-sans font-medium text-[#66625C] mt-1">
                {t.stats[item.id] || item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
