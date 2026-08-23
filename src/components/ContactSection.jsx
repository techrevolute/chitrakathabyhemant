import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Award, Shield } from 'lucide-react';

export default function ContactSection({ onOpenBooking }) {
  const openWhatsApp = () => {
    window.open("https://wa.me/919876543210?text=Hello%20Hemant!%20I%20want%20to%20get%20in%20touch%20regarding%20a%20photography%20shoot.", "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-[#F4EFE6] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">GET IN TOUCH</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            Start Your Visual Story
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            Available for luxury wedding shoots, pre-wedding films, and fashion assignments across Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#E6E1DA] shadow-lg space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8B0000] font-bold">CHITRAKATHA STUDIO</span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1C1C] mt-1">Hemant Mandawade</h3>
                <p className="text-xs text-[#66625C] font-light">12+ Years Professional Experience</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#F0ECE6]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF5F5] text-[#8B0000]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Service Coverage</h4>
                    <p className="text-xs text-[#66625C] font-light mt-0.5">All Over Maharashtra (Pune, Mumbai, Nashik, Kolhapur, Chhatrapati Sambhajinagar, Alibaug)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF5F5] text-[#8B0000]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Direct Call / WhatsApp</h4>
                    <p className="text-xs text-[#66625C] font-light mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF5F5] text-[#8B0000]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Email Inquiry</h4>
                    <p className="text-xs text-[#66625C] font-light mt-0.5">contact@chitrakathabyhemant.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF5F5] text-[#8B0000]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Working Hours</h4>
                    <p className="text-xs text-[#66625C] font-light mt-0.5">Monday - Sunday: 9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={openWhatsApp}
                  className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </button>
                <button
                  onClick={onOpenBooking}
                  className="flex-1 py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>

            </div>
          </div>

          {/* Location Map & Visual Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#E6E1DA] shadow-lg flex flex-col justify-between h-full min-h-[420px]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B0000] mb-2">
                <Shield className="w-4 h-4" />
                <span>PREMIUM STUDIO GUARANTEE</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1C1C] mb-3">
                Serving Every Corner of Maharashtra
              </h3>
              <p className="text-xs sm:text-sm text-[#66625C] font-light leading-relaxed mb-6">
                From historical palaces in Pune & Satara to coastal beach resorts in Alibaug and mountain retreats in Lonavala & Mahabaleshwar, Hemant Mandawade brings 12+ years of cinematic mastery directly to your venue.
              </p>
            </div>

            {/* Map Visual Placeholder */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-[#E6E1DA] h-64 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                alt="Maharashtra Location Coverage"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                <MapPin className="w-10 h-10 text-[#8B0000] animate-bounce mb-2" />
                <h4 className="font-serif text-xl font-bold">Maharashtra Travel Coverage</h4>
                <p className="text-xs text-stone-200 mt-1">Pune • Mumbai • Nashik • Kolhapur • Chhatrapati Sambhajinagar • Konkan</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
