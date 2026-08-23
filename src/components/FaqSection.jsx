import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const displayFaqs = Array.isArray(faqs) && faqs.length > 0
    ? faqs.filter(f => !f.hidden)
    : [
        {
          question: 'How do I book Chitrakatha by Hemant?',
          answer: 'You can book by clicking the "Book Now" button on any page, submitting our online booking form, or contacting Hemant Mandawade on WhatsApp at 7249532553.'
        },
        {
          question: 'How much advance payment is required?',
          answer: 'We require a 30% advance deposit to lock your dates. 50% is due on the event date, and the remaining 20% upon delivery.'
        },
        {
          question: 'What is the delivery time?',
          answer: 'Sneak peek photos are delivered within 48 hours. Final retouched galleries and cinematic video films take 7 to 15 days.'
        },
        {
          question: 'Is drone photography available for all events?',
          answer: 'Yes! 4K drone aerial photography is included in our Premium & Luxury packages, or available as an add-on.'
        },
        {
          question: 'What is the editing time for photos and films?',
          answer: 'Our professional color grading and retouching process takes 7 to 10 days for full albums and films.'
        },
        {
          question: 'Are there travel charges for shoots outside Nashik/Satana?',
          answer: 'We cover all over Maharashtra! For shoots outside Nashik/Satana, actual travel and accommodation costs apply.'
        },
        {
          question: 'Do you assist in location scouting for outdoor shoots?',
          answer: 'Yes! Hemant Mandawade personally assists in selecting top picturesque locations across Maharashtra.'
        }
      ];

  return (
    <section id="faq" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            Everything You Need To Know
          </h2>
          <p className="text-sm text-[#66625C] font-light">
            Questions regarding booking advance, drone availability, editing time, travel, and delivery schedules.
          </p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-[#1C1C1C] hover:text-[#8B0000] transition-colors"
              >
                <span>{item.question || item.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#8B0000] shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-[#66625C] font-light leading-relaxed border-t border-[#F0ECE6] pt-4 animate-fade-in">
                  {item.answer || item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
