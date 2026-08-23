import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, Mail, User, CheckCircle2, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function BookingModal({ isOpen, onClose, t, onAddBooking }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    eventType: 'Wedding Photography',
    date: '',
    time: 'Morning (09:00 AM)',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = '10-digit mobile number required';
    }

    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.date) errs.date = 'Preferred date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Save Booking
    const newBooking = {
      id: `bk-${Date.now()}`,
      ...formData,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddBooking) {
      onAddBooking(newBooking);
    }

    setSubmitted(true);
  };

  const sendWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Chitrakatha by Hemant,\n` +
      `I would like to request an appointment:\n` +
      `• Name: ${formData.name}\n` +
      `• Phone: ${formData.phone}\n` +
      `• City: ${formData.city}\n` +
      `• Service: ${formData.eventType}\n` +
      `• Date: ${formData.date}\n` +
      `• Time: ${formData.time}\n` +
      `• Details: ${formData.notes || 'None'}\n` +
      `Please confirm availability. Thank you.`
    );
    window.open(`https://wa.me/91${BUSINESS_INFO.phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-[#1C1C1C]">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-[#E6E1DA] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#1C1C1C] hover:bg-[#EFECE6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#1C1C1C]">Booking Request Sent!</h3>
            <p className="text-xs sm:text-sm text-[#66625C] max-w-md mx-auto leading-relaxed font-light">
              Thank you, <strong className="text-[#1C1C1C]">{formData.name}</strong>.<br />
              Your appointment request for <strong>{formData.eventType}</strong> on <strong>{formData.date}</strong> has been logged in our system. Hemant Mandawade will review and confirm availability shortly.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold"
              >
                Return Home
              </button>

              <button
                onClick={sendWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Confirmation</span>
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <span className="text-xs font-sans tracking-[0.2em] text-[#8B0000] uppercase font-bold">ONLINE APPOINTMENT REQUEST</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1C] mt-0.5">
                Book Photography Shoot
              </h3>
              <p className="text-xs text-[#66625C] font-light mt-1">
                Select your preferred date & time. Admin will confirm calendar slot upon review.
              </p>
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Event Type *</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E1DA] bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:border-[#8B0000]"
              >
                <option value="Wedding Photography">Wedding Photography</option>
                <option value="Pre Wedding Photography">Pre Wedding Photography</option>
                <option value="Fashion Shoot">Fashion Shoot</option>
                <option value="Drone Photography">Drone Photography</option>
                <option value="Cinematic Video">Cinematic Video</option>
                <option value="Photo Editing">Photo Editing</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-[#E6E1DA] focus:border-[#8B0000]'
                  }`}
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-[10px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Phone Number *</label>
                <input
                  type="tel"
                  maxLength="10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-[#E6E1DA] focus:border-[#8B0000]'
                  }`}
                  placeholder="7249532553"
                />
                {errors.phone && <span className="text-[10px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</span>}
              </div>
            </div>

            {/* Email & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DA] text-xs font-medium focus:outline-none focus:border-[#8B0000]"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">City / Location *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-[#E6E1DA] focus:border-[#8B0000]'
                  }`}
                  placeholder="e.g. Satana, Nashik, Pune"
                />
                {errors.city && <span className="text-[10px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.city}</span>}
              </div>
            </div>

            {/* Preferred Date & Preferred Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Preferred Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                    errors.date ? 'border-red-500 bg-red-50' : 'border-[#E6E1DA] focus:border-[#8B0000]'
                  }`}
                />
                {errors.date && <span className="text-[10px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.date}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Preferred Time Slot</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E1DA] bg-white text-xs font-medium focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="Morning (09:00 AM)">Morning (09:00 AM)</option>
                  <option value="Afternoon (01:00 PM)">Afternoon (01:00 PM)</option>
                  <option value="Sunset (04:30 PM)">Sunset (04:30 PM)</option>
                  <option value="Night / Reception">Night / Reception</option>
                  <option value="Full Day">Full Day Event</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">Notes & Special Instructions</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#E6E1DA] text-xs font-medium focus:outline-none focus:border-[#8B0000]"
                placeholder="Details about venue, functions, or specific requirements..."
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Submit Booking Request</span>
              </button>

              <button
                type="button"
                onClick={sendWhatsAppDirect}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
