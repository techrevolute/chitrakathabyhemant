import React from 'react';
import {
  Users, Calendar, CheckCircle, Clock, TrendingUp, Phone, Mail, ArrowUpRight,
  Sparkles, Camera, Film, HardDrive, MessageSquare, PhoneCall, AlertCircle
} from 'lucide-react';

export default function AdminDashboardHome({ bookings = [], portfolio = [], packages = [], faqs = [] }) {
  // Fresh Baseline Counters starting at 0
  const totalVisits = 0;
  const totalBookings = bookings.length;
  const newBookings = bookings.filter(b => b.status === 'New').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const totalPhotos = portfolio.length;

  // Latest 10 Recent Enquiries
  const recentEnquiries = bookings.slice(0, 10);

  const STATUS_CONFIG = {
    'New': { label: 'New', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    'Contacted': { label: 'Contacted', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    'Pending': { label: 'Pending', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
    'Confirmed': { label: 'Confirmed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    'Completed': { label: 'Completed', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    'Cancelled': { label: 'Cancelled', color: 'bg-red-500/20 text-red-300 border-red-500/40' }
  };

  return (
    <div className="space-y-8 text-white max-w-6xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Welcome back, Hemant</h2>
          <p className="text-xs text-stone-400">Overview of Chitrakatha website traffic, lead enquiries, storage & shoot calendar</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono font-bold">System Online & Live</span>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS - Baseline 0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#1C1C1C] p-6 rounded-3xl border border-stone-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Website Visits</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white">{totalVisits}</div>
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            0% growth this month
          </span>
        </div>

        <div className="bg-[#1C1C1C] p-6 rounded-3xl border border-stone-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Booking Requests</span>
            <div className="p-2 rounded-xl bg-[#8B0000]/20 text-red-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white">{totalBookings}</div>
          <span className="text-[11px] text-amber-400 font-bold">
            {newBookings} New Unread Enquiries
          </span>
        </div>

        <div className="bg-[#1C1C1C] p-6 rounded-3xl border border-stone-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Confirmed Shoots</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white">{confirmedBookings}</div>
          <span className="text-[11px] text-stone-400">Scheduled Across MH</span>
        </div>

        <div className="bg-[#1C1C1C] p-6 rounded-3xl border border-stone-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Storage Usage</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white">0 MB</div>
          <span className="text-[11px] text-stone-400">of 5.0 GB Cloud Capacity</span>
        </div>

      </div>

      {/* LATEST 10 RECENT ENQUIRIES TABLE */}
      <div className="bg-[#1C1C1C] rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-xl font-bold">Recent Lead Enquiries (Latest 10)</h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">{recentEnquiries.length} Enquiries Streamed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service Required</th>
                <th className="py-3 px-4">Shoot Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-400">No active lead enquiries. Incoming form & WhatsApp bookings will appear here.</td>
                </tr>
              ) : (
                recentEnquiries.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['New'];
                  const isNew = item.status === 'New';

                  return (
                    <tr key={item.id} className={`hover:bg-stone-900/50 transition-colors ${isNew ? 'bg-yellow-950/20' : ''}`}>
                      
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{item.id}</td>

                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isNew && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-bold">NEW</span>}
                        </div>
                        <span className="text-[11px] text-stone-400">📱 {item.phone} • 📍 {item.city}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-200">{item.eventType}</td>

                      <td className="py-3 px-4 font-mono text-stone-300">{item.date}</td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${cfg.color}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`tel:${item.phone}`}
                            className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                            title="Call Customer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${item.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-green-950 text-green-300 hover:bg-green-900"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
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

    </div>
  );
}
