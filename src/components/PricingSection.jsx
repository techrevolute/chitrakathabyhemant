import React from 'react';
import { Check, Star, MessageCircle } from 'lucide-react';

export default function PricingSection({ packages = [], t, onOpenBooking }) {
  const displayPackages = Array.isArray(packages) && packages.length > 0
    ? packages
    : [
        {
          name: 'Basic Package',
          price: '₹35,000',
          description: 'Ideal for intimate weddings, engagement ceremonies, and single-day family celebrations.',
          features: [
            'Photos: 150+ High-Resolution Retouched Photos',
            'Videos: 3-5 Minute Cinematic Highlight Video',
            'Drone: 1 HD Drone Aerial Session',
            'Editing: Professional Color Correction & Warm Tone Retouching',
            'Delivery Time: Delivered in 15 Days via Cloud Drive'
          ],
          popular: false
        },
        {
          name: 'Premium Package',
          price: '₹75,000',
          description: 'Our most popular comprehensive multi-day wedding package capturing all rituals with drone and luxury photobook.',
          features: [
            'Photos: 350+ Ultra-HD Retouched Photos',
            'Videos: 15-20 Min 4K Cinematic Feature Film + 60s Reel',
            'Drone: 4K Aerial Drone Coverage (Haldi, Wedding, Reception)',
            'Editing: Signature Luxury Warm White & Soft Red Lighting Grade',
            'Delivery Time: 10 Days Full Delivery + 48hr Teaser Preview'
          ],
          popular: true
        },
        {
          name: 'Luxury Package',
          price: '₹1,35,000',
          description: 'The ultimate royal wedding experience with multi-day coverage, pre-wedding shoot, dual drone team, and 2 luxury albums.',
          features: [
            'Photos: 600+ Retouched Photos & All Raw Files',
            'Videos: 25-30 Min 4K Feature Film + Teaser + 3 Social Reels',
            'Drone: Dual Operator 4K Drone Aerial Cinema Team',
            'Editing: Master High-End Retouching, Skin Tone Perfecting & Audio Mastering',
            'Delivery Time: 7 Days Express Delivery + 24hr Teaser'
          ],
          popular: false
        }
      ];

  const openWhatsApp = (pkgName) => {
    const msg = encodeURIComponent(`Hello Hemant! I am interested in inquiring about the "${pkgName}" package.`);
    window.open(`https://wa.me/917249532553?text=${msg}`, '_blank');
  };

  return (
    <section id="pricing" className="py-24 bg-[#F4EFE6] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">INVESTMENT & PACKAGES</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            Packages & Pricing
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            Basic, Premium, and Luxury packages crafted with high quality equipment, drone photography, cinematic films, and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayPackages.map((pkg, i) => (
            <div
              key={pkg.id || i}
              className={`relative rounded-3xl p-8 bg-white border transition-all duration-300 flex flex-col justify-between ${
                pkg.popular
                  ? 'border-[#8B0000] shadow-2xl scale-105 z-10'
                  : 'border-[#E6E1DA] shadow-sm hover:shadow-xl'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current text-amber-300" />
                  MOST POPULAR PACKAGE
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1C1C] mb-2">{pkg.name}</h3>
                <p className="text-xs text-[#66625C] font-light mb-6">{pkg.description}</p>
                
                <div className="mb-6 pb-6 border-b border-[#E6E1DA]">
                  <span className="font-serif text-4xl font-bold text-[#8B0000]">{pkg.price}</span>
                  <span className="text-xs text-[#66625C] font-medium"> / Event</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#1C1C1C] font-medium">
                      <Check className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#F0ECE6]">
                <button
                  onClick={onOpenBooking}
                  className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    pkg.popular
                      ? 'bg-[#8B0000] hover:bg-[#A61C1C] text-white shadow-lg'
                      : 'bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#1C1C1C] border border-[#E6E1DA]'
                  }`}
                >
                  Book Now
                </button>
                <button
                  onClick={() => openWhatsApp(pkg.name)}
                  className="w-full py-2.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

