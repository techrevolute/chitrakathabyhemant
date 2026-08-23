import React, { useState, useEffect } from 'react';
import { Camera, Globe, MessageCircle, Menu, X, ShieldCheck, Calendar, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function Navbar({ lang, setLang, t, onOpenBooking, onOpenAdmin, activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'services', label: t.nav.services },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
    { id: 'contact', label: t.nav.contact }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    
    const section = document.getElementById(id);
    if (section && (id === 'home' || id === 'about' || id === 'portfolio' || id === 'services')) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const defaultMsg = encodeURIComponent(
      `Hello Chitrakatha by Hemant,\nI would like to know more about your photography services.\nPlease share the details.\nThank you.`
    );
    window.open(`https://wa.me/91${BUSINESS_INFO.phone}?text=${defaultMsg}`, '_blank');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-md py-3 border-b border-[#E6E1DA]' 
        : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className={`p-2.5 rounded-full transition-all duration-300 ${
            scrolled ? 'bg-[#8B0000] text-white shadow-sm' : 'bg-white/20 backdrop-blur-md text-white group-hover:bg-[#8B0000]'
          }`}>
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className={`block font-serif text-xl sm:text-2xl font-bold tracking-wider leading-none ${
              scrolled ? 'text-[#1C1C1C]' : 'text-white'
            }`}>
              CHITRAKATHA
            </span>
            <span className={`block text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase font-medium mt-0.5 ${
              scrolled ? 'text-[#8B0000]' : 'text-amber-200'
            }`}>
              BY HEMANT
            </span>
          </div>
        </button>

        {/* Desktop Navigation Center */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activePage === link.id
                  ? scrolled
                    ? 'bg-[#8B0000] text-white'
                    : 'bg-white text-[#1C1C1C] font-bold'
                  : scrolled
                    ? 'text-[#1C1C1C] hover:text-[#8B0000] hover:bg-[#F4EFE6]'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Phone Call, Language, Admin, WhatsApp & Booking CTA */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Phone Call Link */}
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
              scrolled ? 'border-[#E6E1DA] text-[#1C1C1C] hover:bg-[#F4EFE6]' : 'border-white/30 text-white hover:bg-white/10'
            }`}
            title="Call Hemant Mandawade"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{BUSINESS_INFO.phone}</span>
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                scrolled ? 'border-[#E6E1DA] text-[#1C1C1C] hover:bg-[#F4EFE6]' : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-[#E6E1DA] py-2 z-50 animate-fade-in text-xs font-medium text-[#1C1C1C]">
                <button
                  onClick={() => { setLang('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#FAF7F2] flex items-center justify-between ${lang === 'en' ? 'font-bold text-[#8B0000]' : ''}`}
                >
                  English <span>EN</span>
                </button>
                <button
                  onClick={() => { setLang('mr'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#FAF7F2] flex items-center justify-between ${lang === 'mr' ? 'font-bold text-[#8B0000]' : ''}`}
                >
                  मराठी <span>MR</span>
                </button>
                <button
                  onClick={() => { setLang('hi'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#FAF7F2] flex items-center justify-between ${lang === 'hi' ? 'font-bold text-[#8B0000]' : ''}`}
                >
                  हिंदी <span>HI</span>
                </button>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Button */}
          <button
            onClick={openWhatsApp}
            title="Chat on WhatsApp"
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Admin Dashboard CMS Button */}
          <button
            onClick={onOpenAdmin}
            title="Admin CMS Control"
            className={`p-2 rounded-full transition-all ${
              scrolled ? 'bg-[#EFECE6] text-[#1C1C1C] hover:bg-[#8B0000] hover:text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Main Booking Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Shoot</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={openWhatsApp}
            className="p-2 rounded-full bg-emerald-600 text-white shadow"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'text-[#1C1C1C] hover:bg-[#F4EFE6]' : 'text-white hover:bg-white/20'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E6E1DA] px-4 pt-4 pb-6 shadow-2xl animate-fade-in text-[#1C1C1C]">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activePage === link.id ? 'bg-[#8B0000] text-white font-semibold' : 'text-[#1C1C1C] hover:bg-[#F4EFE6]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#E6E1DA] flex flex-col gap-3 mt-2">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E6E1DA] bg-white text-xs font-mono font-bold"
              >
                <Phone className="w-4 h-4 text-[#8B0000]" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>

              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold text-[#66625C] uppercase tracking-wider">Language</span>
                <div className="flex gap-1">
                  {['en', 'mr', 'hi'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                        lang === l ? 'bg-[#8B0000] text-white' : 'bg-[#EFECE6] text-[#1C1C1C]'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E6E1DA] bg-white text-xs font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8B0000]" />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Shoot</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
