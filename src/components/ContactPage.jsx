import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Check, ShieldCheck, Calendar, Clock } from 'lucide-react';
import { apiCreateBooking } from '../lib/supabase';

export default function ContactPage({ onOpenBooking }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    eventType: 'Wedding Photography',
    date: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 10-digit mobile number validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');

    const newEnquiry = {
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      phone: cleanPhone,
      email: formData.email,
      city: formData.city || 'Maharashtra',
      eventType: formData.eventType,
      date: formData.date || new Date().toISOString().split('T')[0],
      time: 'Morning',
      notes: formData.notes,
      source: 'Website Contact Form',
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await apiCreateBooking(newEnquiry);
    setSubmitted(true);
  };

  return (
    <div className="py-20 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">CONTACT & BOOKINGS</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1C1C] mt-2 mb-4">
            Let's Capture Your Story
          </h1>
          <p className="text-base text-[#66625C] font-light">
            We cover weddings, pre-wedding shoots, fashion editorials, and drone films across Maharashtra. Reach out for dates & packages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Studio Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-[#E6E1DA] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">Studio Info</h3>
              
              <div className="space-y-4 text-sm text-[#1C1C1C]">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#8B0000]/10 text-[#8B0000]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#66625C] uppercase font-bold block">Phone & WhatsApp</span>
                    <a href="tel:7249532553" className="font-bold text-base hover:text-[#8B0000] font-mono">
                      +91 7249532553
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#8B0000]/10 text-[#8B0000]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#66625C] uppercase font-bold block">Email Inquiry</span>
                    <a href="mailto:clicksbyhemant5564@gmail.com" className="font-bold text-sm hover:text-[#8B0000]">
                      clicksbyhemant5564@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#8B0000]/10 text-[#8B0000]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#66625C] uppercase font-bold block">Office Address</span>
                    <p className="font-medium text-sm">Satana, Nashik, Maharashtra 423301</p>
                    <span className="text-xs text-amber-700 font-bold block mt-0.5">Service Coverage: All Over Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-[#E6E1DA] shadow-sm h-64 bg-stone-200">
              <iframe
                title="Chitrakatha Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d74.1950!3d20.5900!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdde6a4c28c8ef3%3A0x6b19a16f2c6e6df6!2sSatana%2C%20Maharashtra%20423301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E1DA] shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#1C1C1C]">Enquiry Received!</h3>
                  <p className="text-sm text-[#66625C] max-w-md mx-auto">
                    Thank you for reaching out to Chitrakatha by Hemant. We will contact you at <strong>{formData.phone}</strong> shortly to discuss your dates and details.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1C1C]">Send an Enquiry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Deshmukh"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm text-[#1C1C1C]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Mobile Number (10 Digits) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="7249532553"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm font-mono text-[#1C1C1C]"
                      />
                      {phoneError && <span className="text-xs text-red-600 block">{phoneError}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm text-[#1C1C1C]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">City / Shoot Location *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune, Mumbai, Nashik"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm text-[#1C1C1C]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Photography Service *</label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm font-medium text-[#1C1C1C]"
                      >
                        <option value="Wedding Photography">Wedding Photography</option>
                        <option value="Pre Wedding Photography">Pre Wedding Photography</option>
                        <option value="Fashion Shoot">Fashion Shoot</option>
                        <option value="Drone Photography">Drone Photography</option>
                        <option value="Cinematic Video">Cinematic Video</option>
                        <option value="Photo Editing">Photo Editing</option>
                        <option value="Video Editing">Video Editing</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Preferred Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm text-[#1C1C1C]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#66625C]">Message / Notes</label>
                      <textarea
                        rows="3"
                        placeholder="Tell us about your event scope, venue, dates, or specific requirements..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1DA] text-sm text-[#1C1C1C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Booking Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
