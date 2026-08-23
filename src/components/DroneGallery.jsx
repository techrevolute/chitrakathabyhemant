import React from 'react';
import { Video, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export default function DroneGallery({ portfolio, t, onOpenBooking }) {
  const droneItems = portfolio.filter(
    (item) => item.category.toLowerCase() === 'drone' || item.title.toLowerCase().includes('aerial') || item.title.toLowerCase().includes('drone')
  );

  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Grid */}
        <div className="bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#121212] rounded-3xl p-8 sm:p-12 text-white border border-stone-800 shadow-2xl relative overflow-hidden mb-12">
          
          {/* Background Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B0000]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6 border border-white/15">
                <Video className="w-3.5 h-3.5 text-amber-300" />
                <span>DGCA LICENSED AERIAL OPERATIONS</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                {t.droneSec.title}
              </h2>

              <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed mb-8">
                {t.droneSec.subtitle}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>4K HDR high-frame rate aerial video capture</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Palace, beach, fort & destination venue scale coverage</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Safe, licensed, and insured flight operations</span>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg hover:shadow-2xl"
              >
                Inquire Drone Shoot
              </button>
            </div>

            {/* Drone Feature Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200"
                alt="Drone Aerial Photography"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-serif font-bold">Raigad Fort Aerial View</span>
                <span className="px-2.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-[10px]">4K Ultra-HD</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
