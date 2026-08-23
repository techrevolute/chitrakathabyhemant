import React, { useState } from 'react';
import {
  X, ShieldCheck, Sliders, Video, Plus, Trash2, RotateCcw, Check, Sparkles,
  Calendar as CalendarIcon, HelpCircle, DollarSign, Search, Filter, Download, Phone, MessageCircle, Eye, EyeOff
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export default function AdminDashboard({
  isOpen,
  onClose,
  stats,
  setStats,
  watermark,
  setWatermark,
  heroData,
  setHeroData,
  portfolio,
  setPortfolio,
  packages,
  setPackages,
  faqs,
  setFaqs,
  bookings,
  setBookings,
  onResetAll
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [calendarViewMode, setCalendarViewMode] = useState('monthly'); // 'monthly', 'weekly', 'daily'

  // FAQ Form State
  const [newFaq, setNewFaq] = useState({
    category: 'Booking',
    question: '',
    answer: ''
  });

  // Package Form State
  const [newPkg, setNewPkg] = useState({
    name: '',
    category: 'Wedding Photography',
    image: '',
    description: '',
    price: 'Contact for Quote',
    duration: 'Full Event',
    deliverables: '',
    popular: false
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // FAQ Handlers
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    const item = {
      id: `faq-${Date.now()}`,
      ...newFaq,
      hidden: false
    };
    setFaqs([item, ...faqs]);
    setNewFaq({ category: 'Booking', question: '', answer: '' });
    triggerSaveNotice();
  };

  const handleToggleHideFaq = (id) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, hidden: !f.hidden } : f));
    triggerSaveNotice();
  };

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
    triggerSaveNotice();
  };

  // Package Handlers
  const handleAddPackage = (e) => {
    e.preventDefault();
    if (!newPkg.name || !newPkg.image) return;
    const item = {
      id: `pkg-${Date.now()}`,
      ...newPkg,
      features: ['High-Res Photos', 'Custom Album', 'Full Coverage'],
      buttonText: 'Book Package'
    };
    setPackages([item, ...packages]);
    setNewPkg({
      name: '', category: 'Wedding Photography', image: '', description: '',
      price: 'Contact for Quote', duration: 'Full Event', deliverables: '', popular: false
    });
    triggerSaveNotice();
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(p => p.id !== id));
    triggerSaveNotice();
  };

  // Booking Handlers
  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    triggerSaveNotice();
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
    triggerSaveNotice();
  };

  const exportBookingsCSV = () => {
    const headers = ["ID", "Name", "Phone", "Email", "City", "Event Type", "Date", "Time", "Status"];
    const rows = bookings.map(b => [
      b.id, `"${b.name}"`, `"${b.phone}"`, `"${b.email}"`, `"${b.city}"`, `"${b.eventType}"`, b.date, `"${b.time}"`, b.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chitrakatha_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Booking Filtering
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'All' || b.status.toLowerCase() === bookingFilterStatus.toLowerCase();
    const matchesSearch = b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.city.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.phone.includes(bookingSearch);
    return matchesStatus && matchesSearch;
  });

  // Calendar Stats
  const newCount = bookings.filter(b => b.status === 'New').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-[#1C1C1C]">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6E1DA]">
        
        {/* Header */}
        <div className="p-5 bg-[#FAF7F2] border-b border-[#E6E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B0000] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Chitrakatha Admin Dashboard</h3>
              <p className="text-xs text-[#66625C]">Bookings System • Pricing • FAQs • Watermark & Media Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#EFECE6] hover:bg-[#E6E1DA] text-[#1C1C1C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Tab Bar */}
        <div className="bg-[#F4EFE6] px-4 border-b border-[#E6E1DA] flex items-center gap-1 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'border-[#8B0000] text-[#8B0000] bg-white' : 'border-transparent text-[#66625C]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'border-[#8B0000] text-[#8B0000] bg-white' : 'border-transparent text-[#66625C]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing' ? 'border-[#8B0000] text-[#8B0000] bg-white' : 'border-transparent text-[#66625C]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Pricing Packages</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'faqs' ? 'border-[#8B0000] text-[#8B0000] bg-white' : 'border-transparent text-[#66625C]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('watermark')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'watermark' ? 'border-[#8B0000] text-[#8B0000] bg-white' : 'border-transparent text-[#66625C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Watermark</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              
              {/* Actions & Filters Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1DA]">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, city..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#E6E1DA] text-xs font-medium focus:outline-none w-full sm:w-64"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-stone-500" />
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E6E1DA] text-xs font-bold bg-white"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={exportBookingsCSV}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Bookings Table / List */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-stone-400">No booking requests found.</div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-white rounded-2xl border border-[#E6E1DA] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-bold text-[#1C1C1C]">{b.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                            b.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-[#66625C]">
                          <span><strong>Event:</strong> {b.eventType}</span>
                          <span><strong>Date:</strong> {b.date} ({b.time})</span>
                          <span><strong>City:</strong> {b.city}</span>
                          <span><strong>Phone:</strong> {b.phone}</span>
                        </div>
                        {b.notes && <p className="text-xs italic text-stone-500">"{b.notes}"</p>}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-[#E6E1DA] text-xs font-bold bg-[#FAF7F2]"
                        >
                          <option value="New">New</option>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(`Hello ${b.name}, regarding your Chitrakatha booking request for ${b.eventType} on ${b.date}...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <a
                          href={`tel:${b.phone}`}
                          className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <span className="text-xs font-bold text-blue-800 uppercase block">New Inquiries</span>
                  <span className="font-serif text-3xl font-bold text-blue-900">{newCount}</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Confirmed Shoots</span>
                  <span className="font-serif text-3xl font-bold text-emerald-900">{confirmedCount}</span>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-xs font-bold text-purple-800 uppercase block">Completed</span>
                  <span className="font-serif text-3xl font-bold text-purple-900">{completedCount}</span>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                  <span className="text-xs font-bold text-red-800 uppercase block">Cancelled</span>
                  <span className="font-serif text-3xl font-bold text-red-900">{cancelledCount}</span>
                </div>
              </div>

              {/* View Switcher */}
              <div className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6E1DA]">
                <h4 className="font-serif text-lg font-bold">Appointment Calendar Overview</h4>
                <div className="flex gap-1">
                  {['monthly', 'weekly', 'daily'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setCalendarViewMode(mode)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                        calendarViewMode === mode ? 'bg-[#8B0000] text-white' : 'bg-white text-[#1C1C1C]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduled Days Listing */}
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="p-4 bg-white rounded-2xl border border-[#E6E1DA] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#8B0000] uppercase">{b.date} • {b.time}</div>
                      <h5 className="font-serif text-base font-bold text-[#1C1C1C]">{b.eventType} - {b.name} ({b.city})</h5>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FAF7F2] text-[#1C1C1C]'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: PRICING PACKAGES */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              {/* Add Package Form */}
              <form onSubmit={handleAddPackage} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6E1DA] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B0000] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Photography Package
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Package Name (e.g. Royal Heritage Wedding)"
                    value={newPkg.name}
                    onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <select
                    value={newPkg.category}
                    onChange={(e) => setNewPkg({ ...newPkg, category: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs font-medium"
                  >
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Pre Wedding Photography">Pre Wedding Photography</option>
                    <option value="Fashion Shoot">Fashion Shoot</option>
                    <option value="Drone Photography">Drone Photography</option>
                    <option value="Cinematic Video">Cinematic Video</option>
                    <option value="Photo Editing">Photo Editing</option>
                    <option value="Video Editing">Video Editing</option>
                  </select>
                  <input
                    type="url"
                    required
                    placeholder="Cover Image URL"
                    value={newPkg.image}
                    onChange={(e) => setNewPkg({ ...newPkg, image: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Price Tag (e.g. Contact for Quote / ₹75,000)"
                    value={newPkg.price}
                    onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2 Days / Full Event)"
                    value={newPkg.duration}
                    onChange={(e) => setNewPkg({ ...newPkg, duration: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs"
                  />
                  <textarea
                    placeholder="Short Description"
                    value={newPkg.description}
                    onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs sm:col-span-2"
                  />
                </div>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B0000] text-white text-xs font-semibold uppercase">
                  Add Package
                </button>
              </form>

              {/* Current Package Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-white rounded-2xl border border-[#E6E1DA] flex items-center gap-4">
                    <img src={pkg.image} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-[#1C1C1C] truncate">{pkg.name}</h5>
                      <span className="text-[10px] font-bold text-[#8B0000] uppercase block">{pkg.category}</span>
                      <span className="text-xs text-stone-500">{pkg.price}</span>
                    </div>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              
              {/* Add FAQ Form */}
              <form onSubmit={handleAddFaq} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6E1DA] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B0000] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New FAQ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs font-medium"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre Wedding">Pre Wedding</option>
                    <option value="Booking">Booking</option>
                    <option value="Payments">Payments</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Travel">Travel</option>
                    <option value="Drone Photography">Drone Photography</option>
                    <option value="Editing">Editing</option>
                    <option value="General">General</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="p-2.5 rounded-xl border text-xs sm:col-span-2"
                  />
                </div>

                <textarea
                  required
                  rows="2"
                  placeholder="Answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-xs"
                />

                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#8B0000] text-white text-xs font-semibold uppercase">
                  Add FAQ
                </button>
              </form>

              {/* FAQs List */}
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="p-4 bg-white rounded-2xl border border-[#E6E1DA] flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#FAF7F2] text-[#8B0000] rounded">
                        {f.category}
                      </span>
                      <h5 className="font-serif text-base font-bold text-[#1C1C1C] mt-1">{f.question}</h5>
                      <p className="text-xs text-[#66625C] font-light mt-1">{f.answer}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleHideFaq(f.id)}
                        className={`p-2 rounded-xl border ${f.hidden ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}
                        title={f.hidden ? 'Show FAQ' : 'Hide FAQ'}
                      >
                        {f.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteFaq(f.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: WATERMARK */}
          {activeTab === 'watermark' && (
            <div className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6E1DA]">
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#1C1C1C]">Enable Watermark Protection</h4>
                  <p className="text-xs text-[#66625C]">Overlay brand signature on photos</p>
                </div>
                <button
                  onClick={() => { setWatermark({ ...watermark, enabled: !watermark.enabled }); triggerSaveNotice(); }}
                  className={`h-6 w-11 rounded-full p-1 transition-colors ${watermark.enabled ? 'bg-[#8B0000]' : 'bg-stone-300'}`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${watermark.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Watermark Text</label>
                <input
                  type="text"
                  value={watermark.text}
                  onChange={(e) => { setWatermark({ ...watermark, text: e.target.value }); triggerSaveNotice(); }}
                  className="w-full p-3 rounded-xl border border-[#E6E1DA] text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {['bottom-right', 'bottom-left', 'center', 'top-right'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => { setWatermark({ ...watermark, position: pos }); triggerSaveNotice(); }}
                      className={`p-2.5 rounded-xl text-xs font-semibold capitalize ${
                        watermark.position === pos ? 'bg-[#8B0000] text-white' : 'bg-[#FAF7F2] border'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Opacity ({Math.round(watermark.opacity * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={watermark.opacity}
                  onChange={(e) => { setWatermark({ ...watermark, opacity: parseFloat(e.target.value) }); triggerSaveNotice(); }}
                  className="w-full accent-[#8B0000]"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E6E1DA] flex items-center justify-between">
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline Placeholders</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black"
          >
            Save & Exit Admin
          </button>
        </div>

      </div>
    </div>
  );
}
