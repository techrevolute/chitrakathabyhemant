import React, { useState } from 'react';
import {
  Calendar, Phone, Mail, MapPin, Search, Filter, Download, Eye, Edit2, Trash2,
  CheckCircle, Clock, AlertCircle, PhoneCall, MessageSquare, Check, TrendingUp, Sparkles, X, User
} from 'lucide-react';

export default function AdminBookingsManager({ bookings, setBookings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [notice, setNotice] = useState(false);

  const triggerNotice = () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 2500);
  };

  // Status Colors & Badges Mapping
  const STATUS_CONFIG = {
    'New': { label: 'New', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: '🟡' },
    'Contacted': { label: 'Contacted', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: '🔵' },
    'Pending': { label: 'Pending', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', icon: '🟠' },
    'Confirmed': { label: 'Confirmed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: '🟢' },
    'Completed': { label: 'Completed', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: '🟣' },
    'Cancelled': { label: 'Cancelled', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: '🔴' }
  };

  // Stat Counters Calculation
  const totalCount = bookings.length;
  const newCount = bookings.filter(b => b.status === 'New').length;
  const contactedCount = bookings.filter(b => b.status === 'Contacted').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = bookings.filter(b => b.date === todayStr || b.createdAt === todayStr).length;

  // Change Status
  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    triggerNotice();
  };

  // Delete Enquiry
  const handleDelete = (id) => {
    if (window.confirm("Permanently delete this enquiry record?")) {
      setBookings(bookings.filter(b => b.id !== id));
      triggerNotice();
    }
  };

  // Update Enquiry Edit Form
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setBookings(bookings.map(b => b.id === editEnquiry.id ? editEnquiry : b));
    setEditEnquiry(null);
    triggerNotice();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Enquiry ID', 'Customer Name', 'Phone', 'Email', 'City', 'Event Type', 'Preferred Date', 'Source', 'Status'];
    const rows = bookings.map(b => [
      b.id, `"${b.name}"`, b.phone, b.email || '', `"${b.city}"`, `"${b.eventType}"`, b.date, `"${b.source || 'Website'}"`, b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Chitrakatha_Enquiries_Export_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering & Search
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesEvent = eventTypeFilter === 'All' || b.eventType === eventTypeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      b.name.toLowerCase().includes(searchLower) ||
      b.phone.includes(searchLower) ||
      (b.email && b.email.toLowerCase().includes(searchLower)) ||
      (b.id && b.id.toLowerCase().includes(searchLower)) ||
      b.city.toLowerCase().includes(searchLower);
    return matchesStatus && matchesEvent && matchesSearch;
  });

  return (
    <div className="space-y-8 text-white max-w-6xl">
      
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Booking & Enquiry Management</h2>
          <p className="text-xs text-stone-400">Track incoming lead requests, assign status, contact customers directly & export data</p>
        </div>

        <div className="flex items-center gap-3">
          {notice && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold animate-fade-in">
              <Check className="w-4 h-4" /> Updated
            </span>
          )}
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 10 LIVE DASHBOARD STATISTIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Enquiries', count: totalCount, bg: 'bg-stone-900', border: 'border-stone-800', color: 'text-white' },
          { label: 'New Enquiries', count: newCount, bg: 'bg-yellow-950/40', border: 'border-yellow-500/30', color: 'text-yellow-300' },
          { label: 'Contacted', count: contactedCount, bg: 'bg-blue-950/40', border: 'border-blue-500/30', color: 'text-blue-300' },
          { label: 'Pending', count: pendingCount, bg: 'bg-orange-950/40', border: 'border-orange-500/30', color: 'text-orange-300' },
          { label: 'Confirmed Shoots', count: confirmedCount, bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', color: 'text-emerald-300' },
          { label: 'Completed', count: completedCount, bg: 'bg-purple-950/40', border: 'border-purple-500/30', color: 'text-purple-300' },
          { label: 'Cancelled', count: cancelledCount, bg: 'bg-red-950/40', border: 'border-red-500/30', color: 'text-red-300' },
          { label: "Today's Enquiries", count: todayCount, bg: 'bg-stone-900', border: 'border-stone-800', color: 'text-amber-400' },
          { label: "This Week", count: totalCount, bg: 'bg-stone-900', border: 'border-stone-800', color: 'text-white' },
          { label: "This Month", count: totalCount, bg: 'bg-stone-900', border: 'border-stone-800', color: 'text-white' }
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${card.bg} ${card.border} space-y-1`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">{card.label}</span>
            <span className={`text-2xl font-serif font-bold ${card.color}`}>{card.count}</span>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#1C1C1C] p-4 rounded-2xl border border-stone-800">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, ID, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-stone-400 uppercase">Status:</span>
          {['All', 'New', 'Contacted', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st ? 'bg-[#8B0000] text-white' : 'bg-stone-900 text-stone-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* ENQUIRIES TABLE */}
      <div className="bg-[#1C1C1C] rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Shoot / Event</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Source</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-400">No enquiries match your search or filter.</td>
                </tr>
              ) : (
                filteredBookings.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['New'];
                  const isNewUnread = item.status === 'New';

                  return (
                    <tr key={item.id} className={`hover:bg-stone-900/50 transition-colors ${isNewUnread ? 'bg-yellow-950/20' : ''}`}>
                      
                      {/* Enquiry ID */}
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        {item.id}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isNewUnread && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold">NEW</span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2">
                          <span>📱 {item.phone}</span>
                          <span>📍 {item.city}</span>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{item.eventType}</span>
                        <span className="text-[10px] text-stone-400 line-clamp-1">{item.notes || 'No special notes'}</span>
                      </td>

                      {/* Preferred Date & Time */}
                      <td className="py-4 px-4 space-y-0.5">
                        <span className="font-bold text-white block">{item.date}</span>
                        <span className="text-[10px] font-mono text-stone-400">{item.time || 'Morning'}</span>
                      </td>

                      {/* Source Tag */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-bold text-stone-300 border border-stone-700">
                          {item.source || 'Website Form'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${cfg.color}`}
                        >
                          <option value="New">🟡 New</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="Pending">🟠 Pending</option>
                          <option value="Confirmed">🟢 Confirmed</option>
                          <option value="Completed">🟣 Completed</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Call */}
                          <a
                            href={`tel:${item.phone}`}
                            className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors"
                            title="Call Customer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/91${item.phone}?text=Hello%20${encodeURIComponent(item.name)},%20thank%20you%20for%20enquiring%20with%20Chitrakatha%20by%20Hemant!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-green-950 hover:bg-green-900 text-green-300 transition-colors"
                            title="Open WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-950 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1C1C] rounded-3xl p-6 max-w-lg w-full border border-stone-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400">{selectedEnquiry.id}</span>
                <h3 className="font-serif text-xl font-bold">{selectedEnquiry.name}</h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Phone:</strong> <a href={`tel:${selectedEnquiry.phone}`} className="text-amber-400 font-mono">{selectedEnquiry.phone}</a></p>
              {selectedEnquiry.email && <p><strong>Email:</strong> {selectedEnquiry.email}</p>}
              <p><strong>City:</strong> {selectedEnquiry.city}</p>
              <p><strong>Event Type:</strong> {selectedEnquiry.eventType}</p>
              <p><strong>Preferred Date:</strong> {selectedEnquiry.date} ({selectedEnquiry.time})</p>
              <p><strong>Source:</strong> {selectedEnquiry.source || 'Website'}</p>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 mt-2">
                <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Customer Notes</span>
                <p className="text-stone-300 font-light">{selectedEnquiry.notes || 'No message provided'}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase text-center"
              >
                Call Customer
              </a>
              <a
                href={`https://wa.me/91${selectedEnquiry.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold uppercase text-center"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
