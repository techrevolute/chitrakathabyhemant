import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function FaqPage({ faqs, t }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    'All',
    'Wedding',
    'Pre Wedding',
    'Booking',
    'Payments',
    'Delivery',
    'Travel',
    'Drone Photography',
    'Editing',
    'General'
  ];

  const visibleFaqs = faqs.filter(f => !f.hidden);

  const filteredFaqs = visibleFaqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Hello Chitrakatha by Hemant,\nI have a question regarding your photography services.`);
    window.open(`https://wa.me/91${BUSINESS_INFO.phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="pt-24 pb-24 bg-[#FAF7F2] min-h-screen">
      
      {/* Hero Header */}
      <div className="py-16 bg-white border-b border-[#E6E1DA] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">HELP & CLARIFICATIONS</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1C1C] mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#66625C] font-light max-w-xl mx-auto leading-relaxed">
            Find quick answers regarding our booking process, travel policies, drone permits, and editing deliverables.
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. advance payment, travel, drone)..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E6E1DA] text-xs font-medium focus:outline-none focus:border-[#8B0000] shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setOpenIndex(0); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'bg-white text-[#1C1C1C] hover:bg-[#F4EFE6] border border-[#E6E1DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E6E1DA]">
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#1C1C1C]">No matching questions found</h3>
            <p className="text-xs text-[#66625C] mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-[#1C1C1C] hover:text-[#8B0000] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#8B0000] text-[10px] uppercase font-sans font-bold border border-[#E6E1DA]">
                      {item.category}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#8B0000] transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>

                {openIndex === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-[#66625C] font-light leading-relaxed border-t border-[#F0ECE6] pt-4 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Assistance Box */}
        <div className="mt-16 p-8 bg-white rounded-3xl border border-[#E6E1DA] text-center space-y-4 shadow-md">
          <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">Still Have Questions?</h3>
          <p className="text-xs text-[#66625C] max-w-md mx-auto">
            Hemant Mandawade is available to discuss your specific event itinerary and answers any custom queries directly.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>Call 7249532553</span>
            </a>
            <button
              onClick={openWhatsApp}
              className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
