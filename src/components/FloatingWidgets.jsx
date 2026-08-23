import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function FloatingWidgets() {
  const openWhatsApp = () => {
    const defaultMsg = encodeURIComponent(
      `Hello Chitrakatha by Hemant,\nI would like to know more about your photography services.\nPlease share the details.\nThank you.`
    );
    window.open(`https://wa.me/91${BUSINESS_INFO.phone}?text=${defaultMsg}`, '_blank');
  };

  return (
    <>
      {/* Floating Mobile Call Button (Left Side) */}
      <a
        href={`tel:${BUSINESS_INFO.phone}`}
        className="md:hidden fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#1C1C1C] text-white shadow-2xl hover:bg-black transition-transform hover:scale-110 flex items-center justify-center border border-white/20"
        title="Call Hemant Mandawade"
      >
        <Phone className="w-5 h-5 text-amber-300" />
      </a>

      {/* Floating WhatsApp Button (Bottom-Right) */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-400/30"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
          Chat on WhatsApp
        </span>
      </button>
    </>
  );
}
