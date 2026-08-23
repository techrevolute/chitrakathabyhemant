import React from 'react';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';

export default function CallToAction({ t, onOpenBooking }) {
  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hello Hemant! I would like to inquire about dates for a shoot with Chitrakatha.");
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  return (
    <section className="relative py-20 bg-gradient-to-r from-[#8B0000] via-[#9E1B32] to-[#700000] text-white overflow-hidden shadow-2xl">
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6 border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>LIMITED WEDDING SEASON DATES AVAILABLE</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight drop-shadow-md">
          {t.cta.title}
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-light leading-relaxed mb-10">
          {t.cta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#8B0000] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.cta.bookBtn}</span>
          </button>

          <button
            onClick={openWhatsApp}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 border border-emerald-400/30 transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.cta.whatsappBtn}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
