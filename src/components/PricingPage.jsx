import React, { useState } from 'react';
import { Check, Sparkles, Phone, ShieldCheck, Download, Star, Info, MessageSquare, Calendar, X } from 'lucide-react';

export default function PricingPage({ packages = [], brochures = [], t, onOpenBooking }) {
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);

  // Active brochure dynamically from state
  const activeBrochure = Array.isArray(brochures)
    ? brochures.find(b => b.active) || brochures[0]
    : null;

  const pdfDownloadUrl = activeBrochure?.fileUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

  return (
    <div className="py-20 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">PHOTOGRAPHY PACKAGES</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1C1C]">
            Tailored Photography & Film Packages
          </h1>
          <p className="text-base text-[#66625C] font-light">
            Choose the perfect package for your special moments. Every package is fully customizable based on your event scope across Maharashtra.
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl bg-white border ${
                pkg.popular ? 'border-[#8B0000] shadow-2xl ring-1 ring-[#8B0000]' : 'border-[#E6E1DA] shadow-sm'
              } p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current text-amber-300" />
                  <span>MOST POPULAR CHOICE</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="h-52 rounded-2xl overflow-hidden bg-stone-200 border border-[#E6E1DA]">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <span className="text-xs text-[#8B0000] font-bold uppercase tracking-wider">{pkg.category}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1C1C] mt-1">{pkg.name}</h3>
                  <p className="text-xs text-[#66625C] font-light mt-1">{pkg.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#66625C] uppercase font-bold block">Pricing Quote</span>
                    <span className="font-serif text-xl font-bold text-[#8B0000]">{pkg.price}</span>
                  </div>
                  {pkg.duration && (
                    <span className="text-xs font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-[#E6E1DA]">
                      ⏱ {pkg.duration}
                    </span>
                  )}
                </div>

                {/* Included Features List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] block">Package Features:</span>
                  <ul className="space-y-2">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#66625C]">
                        <Check className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons Row: Book Now, WhatsApp, View Details */}
              <div className="pt-4 border-t border-[#F0ECE6] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onOpenBooking}
                    className="py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-transform hover:scale-102"
                  >
                    Book Now
                  </button>

                  <a
                    href={`https://wa.me/917249532553?text=Hello%20Hemant,%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedPackageDetail(pkg)}
                  className="w-full py-2.5 rounded-full bg-white hover:bg-[#F4EFE6] text-[#1C1C1C] border border-[#E6E1DA] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Info className="w-4 h-4 text-[#8B0000]" />
                  <span>View Full Details</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* DYNAMIC DOWNLOAD BROCHURE SECTION (PDF from Admin Dashboard) */}
        <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2B2B2B] rounded-3xl p-8 sm:p-12 text-white border border-stone-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">OFFICIAL PDF GUIDE</span>
            <h3 className="font-serif text-3xl font-bold">Need Complete Package Details?</h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {activeBrochure?.description || 'Download our complete 2026 Wedding & Event Photography Package Brochure PDF for offline reading and event planning.'}
            </p>
            {activeBrochure?.name && (
              <span className="text-[11px] text-stone-400 font-mono block pt-1">
                Active Document: {activeBrochure.name}
              </span>
            )}
          </div>

          <a
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-8 py-4 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider shadow-2xl shrink-0 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Package Brochure (PDF)</span>
          </a>
        </div>

      </div>

      {/* Package Detail Modal */}
      {selectedPackageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-[#1C1C1C] space-y-6 shadow-2xl relative border border-[#E6E1DA]">
            <button
              onClick={() => setSelectedPackageDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#FAF7F2] text-[#1C1C1C] hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B0000]">{selectedPackageDetail.category}</span>
              <h3 className="font-serif text-3xl font-bold">{selectedPackageDetail.name}</h3>
              <p className="text-xs text-[#66625C] font-light mt-1">{selectedPackageDetail.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#66625C] uppercase font-bold block">Deliverables</span>
                <span className="text-xs font-bold text-[#1C1C1C]">{selectedPackageDetail.deliverables || '350+ Retouched Photos, 4K Feature Film'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66625C] uppercase font-bold block">Event Duration</span>
                <span className="text-xs font-bold text-[#1C1C1C]">{selectedPackageDetail.duration || 'Full Event'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] block">Full Specifications:</span>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {selectedPackageDetail.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#66625C]">
                    <Check className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E6E1DA]">
              <button
                onClick={() => { setSelectedPackageDetail(null); onOpenBooking(); }}
                className="flex-1 py-3.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider text-center"
              >
                Book Package Now
              </button>
              <a
                href={pdfDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-6 py-3.5 rounded-full bg-white border border-[#E6E1DA] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#8B0000]" />
                <span>PDF Brochure</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
