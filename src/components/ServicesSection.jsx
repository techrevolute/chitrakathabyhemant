import React, { useState } from 'react';
import { Camera, Heart, UserCheck, Video, Film, Layers, Sliders, ArrowRight, MessageCircle, Calendar, X, CheckCircle2 } from 'lucide-react';

export default function ServicesSection({ services, t, onOpenBooking }) {
  const [selectedService, setSelectedService] = useState(null);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5 text-[#8B0000]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#8B0000]" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-[#8B0000]" />;
      case 'Video': return <Video className="w-5 h-5 text-[#8B0000]" />;
      case 'Film': return <Film className="w-5 h-5 text-[#8B0000]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#8B0000]" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-[#8B0000]" />;
      default: return <Camera className="w-5 h-5 text-[#8B0000]" />;
    }
  };

  const openWhatsAppInquiry = (serviceTitle) => {
    const msg = encodeURIComponent(`Hello Hemant! I am interested in inquiring about your "${serviceTitle}" package with Chitrakatha.`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  return (
    <section id="services" className="py-24 bg-[#F4EFE6] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">LUXURY OFFERINGS</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E6E1DA] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden bg-stone-200">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-white/90 backdrop-blur-md shadow-md">
                  {getServiceIcon(service.icon)}
                </div>

                {/* Starting Price Tag */}
                {service.priceStarting && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#8B0000] text-white text-xs font-bold tracking-wider">
                    From {service.priceStarting}
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1C1C] mb-3 group-hover:text-[#8B0000] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66625C] font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#F0ECE6] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#8B0000] hover:text-[#A61C1C] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>{t.services.learnMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openWhatsAppInquiry(service.title)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E6E1DA] relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">PACKAGE DETAILS</span>
                <h3 className="font-serif text-3xl font-bold mt-1">{selectedService.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-[#66625C] leading-relaxed">
                {selectedService.details}
              </p>

              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1DA]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1C]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>High-resolution edited digital gallery</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1C]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sneak peek photos within 48 hours</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1C]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Drone aerial coverage included (where applicable)</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E6E1DA]">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-xs text-[#66625C] block">Starting Investment</span>
                  <span className="font-serif text-2xl font-bold text-[#8B0000]">{selectedService.priceStarting}</span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => { openWhatsAppInquiry(selectedService.title); setSelectedService(null); }}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => { onOpenBooking(); setSelectedService(null); }}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Shoot</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
