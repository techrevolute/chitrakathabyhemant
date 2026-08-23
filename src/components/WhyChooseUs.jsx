import React from 'react';
import { Award, Camera, Palette, Video, Film, Clock, HeartHandshake, BookOpen } from 'lucide-react';

export default function WhyChooseUs({ t }) {
  const features = [
    {
      id: 'years',
      title: t.whyUs.years,
      desc: t.whyUs.yearsDesc,
      icon: Award
    },
    {
      id: 'equipment',
      title: t.whyUs.equipment,
      desc: t.whyUs.equipmentDesc,
      icon: Camera
    },
    {
      id: 'editing',
      title: t.whyUs.editing,
      desc: t.whyUs.editingDesc,
      icon: Palette
    },
    {
      id: 'drone',
      title: t.whyUs.drone,
      desc: t.whyUs.droneDesc,
      icon: Video
    },
    {
      id: 'videos',
      title: t.whyUs.videos,
      desc: t.whyUs.videosDesc,
      icon: Film
    },
    {
      id: 'delivery',
      title: t.whyUs.delivery,
      desc: t.whyUs.deliveryDesc,
      icon: Clock
    },
    {
      id: 'personalized',
      title: t.whyUs.personalized,
      desc: t.whyUs.personalizedDesc,
      icon: HeartHandshake
    },
    {
      id: 'quality',
      title: t.whyUs.quality,
      desc: t.whyUs.qualityDesc,
      icon: BookOpen
    }
  ];

  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">DISCOVER OUR DIFFERENCE</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-8 border border-[#E6E1DA] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF5F5] group-hover:bg-[#8B0000] text-[#8B0000] group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1C1C] mb-3 group-hover:text-[#8B0000] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66625C] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-[#E6E1DA] group-hover:bg-[#8B0000] transition-all mt-6 group-hover:w-full" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
