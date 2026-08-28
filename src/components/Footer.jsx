import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUp } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function Footer({ logoUrl = '', t, setActivePage, onOpenBooking }) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const defaultLogo = `${baseUrl}assets/chitrakatha_logo.png`.replace(/\/+/g, '/');
  const activeLogoSrc = logoUrl || defaultLogo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const defaultMsg = encodeURIComponent(`Hello Chitrakatha by Hemant,\nI would like to inquire about booking a shoot.`);
    window.open(`https://wa.me/91${BUSINESS_INFO.phone}?text=${defaultMsg}`, '_blank');
  };

  return (
    <footer className="bg-[#181818] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={activeLogoSrc}
                alt="Chitrakatha by Hemant Logo"
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <span className="block font-serif text-xl font-bold tracking-wider leading-none text-white">
                  CHITRAKATHA
                </span>
                <span className="block text-[10px] font-sans tracking-[0.25em] uppercase font-medium text-amber-400 mt-0.5">
                  BY HEMANT MANDAWADE
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={openWhatsApp}
                className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="WhatsApp Us"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                title="Call Us"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-amber-300">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => { setActivePage('home'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('portfolio'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.portfolio}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('services'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('pricing'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.pricing}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('faq'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.faq}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('contact'); scrollToTop(); }} className="hover:text-white transition-colors">
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-amber-300">{t.footer.services}</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Wedding Photography</li>
              <li>Pre Wedding Shoots</li>
              <li>Fashion Editorial</li>
              <li>Drone Aerial Cinema</li>
              <li>Cinematic Video Films</li>
              <li>Photo & Video Retouching</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-amber-300">{t.footer.contactUs}</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B0000] shrink-0" />
                <span>{BUSINESS_INFO.office} • {BUSINESS_INFO.serviceArea}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B0000] shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white font-mono">{BUSINESS_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B0000] shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white truncate">{BUSINESS_INFO.email}</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Chitrakatha by Hemant. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-stone-300 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setShowTerms(true)} className="hover:text-stone-300 transition-colors">Terms & Conditions</button>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-stone-800 hover:bg-[#8B0000] text-white transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-[#1C1C1C]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative border border-[#E6E1DA]">
            <button onClick={() => setShowPrivacy(false)} className="absolute top-6 right-6 text-stone-400 hover:text-black font-bold">✕</button>
            <h3 className="font-serif text-2xl font-bold text-[#8B0000]">Privacy Policy</h3>
            <p className="text-xs text-[#66625C] leading-relaxed">
              At <strong>Chitrakatha by Hemant</strong>, we prioritize the privacy and confidentiality of our clients. 
              Personal information submitted via our booking forms (Name, Mobile, Email, Event Locations) is strictly used for event coordination and booking agreements.
            </p>
            <h4 className="font-bold text-sm text-[#1C1C1C]">1. Image & Video Copyright</h4>
            <p className="text-xs text-[#66625C] leading-relaxed">
              All photographs and video films captured by Hemant Mandawade & Team remain the intellectual copyright of Chitrakatha by Hemant. Selected media may be featured in our portfolio or official social channels unless explicit non-disclosure agreements are requested prior to booking.
            </p>
            <h4 className="font-bold text-sm text-[#1C1C1C]">2. Client Data Security</h4>
            <p className="text-xs text-[#66625C] leading-relaxed">
              We do not sell, rent, or share personal contact information with third-party advertisers. Online cloud galleries are password protected for your privacy.
            </p>
            <button onClick={() => setShowPrivacy(false)} className="w-full py-3 rounded-full bg-[#8B0000] text-white text-xs font-bold uppercase mt-4">
              Close Privacy Policy
            </button>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-[#1C1C1C]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative border border-[#E6E1DA]">
            <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 text-stone-400 hover:text-black font-bold">✕</button>
            <h3 className="font-serif text-2xl font-bold text-[#8B0000]">Terms & Conditions</h3>
            <h4 className="font-bold text-sm text-[#1C1C1C]">1. Booking & Advance Payment</h4>
            <p className="text-xs text-[#66625C] leading-relaxed">
              Dates are confirmed upon receipt of a 30% advance deposit. 50% is due on the event date, and the remaining 20% balance is payable upon delivery of final edited albums & films.
            </p>
            <h4 className="font-bold text-sm text-[#1C1C1C]">2. Cancellation & Rescheduling</h4>
            <p className="text-xs text-[#66625C] leading-relaxed">
              Advance deposits are non-refundable but transferable to mutually agreed future dates within 6 months, subject to availability.
            </p>
            <h4 className="font-bold text-sm text-[#1C1C1C]">3. Drone & Aerial Regulations</h4>
            <p className="text-xs text-[#66625C] leading-relaxed">
              Drone operations depend on DGCA permissions, weather conditions, and venue airspace rules.
            </p>
            <button onClick={() => setShowTerms(false)} className="w-full py-3 rounded-full bg-[#8B0000] text-white text-xs font-bold uppercase mt-4">
              Close Terms & Conditions
            </button>
          </div>
        </div>
      )}

    </footer>
  );
}
