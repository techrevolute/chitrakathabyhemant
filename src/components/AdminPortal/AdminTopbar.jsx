import React from 'react';
import { Search, Bell, ExternalLink, Menu, ShieldCheck, User } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialData';

export default function AdminTopbar({ onToggleMobileSidebar, onPreviewWebsite, searchQuery, setSearchQuery }) {
  return (
    <header className="h-16 bg-[#181818] border-b border-stone-800 text-white px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
      
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dashboard Search (Bookings, Portfolio, FAQs)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium text-white focus:outline-none focus:border-[#8B0000]"
          />
        </div>
      </div>

      {/* Right Topbar Controls */}
      <div className="flex items-center gap-3">
        
        {/* Preview Live Site */}
        <button
          onClick={onPreviewWebsite}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold uppercase tracking-wider transition-all border border-white/15"
          title="View Live Public Website"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#8B0000] ring-2 ring-[#181818]" />
        </button>

        {/* User Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-stone-800">
          <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-serif font-bold text-xs">
            HM
          </div>
          <div className="text-left text-xs">
            <span className="block font-bold text-white leading-tight">{BUSINESS_INFO.owner}</span>
            <span className="block text-[10px] text-emerald-400">Online</span>
          </div>
        </div>

      </div>

    </header>
  );
}
