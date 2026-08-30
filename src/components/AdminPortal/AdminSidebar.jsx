import React from 'react';
import {
  LayoutDashboard, Home, User, Briefcase, Image as ImageIcon, Video, Radio,
  Tag, Calendar, HelpCircle, HardDrive, Globe, Settings, Database, LogOut, FileText
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, onCloseMobile }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl}assets/chitrakatha_logo.png`.replace(/\/+/g, '/');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'homepage', label: 'Homepage Editor', icon: Home },
    { id: 'about', label: 'About Page', icon: User },
    { id: 'services', label: 'Services Manager', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Gallery', icon: ImageIcon },
    { id: 'drone', label: 'Drone Showcase', icon: Radio },
    { id: 'videos', label: 'Videos & Films', icon: Video },
    { id: 'bookings', label: 'Bookings & Leads', icon: Calendar, badge: 'New' },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'media', label: 'Media Vault', icon: HardDrive },
    { id: 'languages', label: 'Multi-Language', icon: Globe },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'backup', label: 'Backup & Activity', icon: Database }
  ];

  return (
    <aside className="w-64 h-full bg-[#1A1A1A] border-r border-stone-800 flex flex-col justify-between text-stone-300 font-sans select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logoSrc} alt="Chitrakatha Logo" className="h-8 w-auto object-contain" />
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#8B0000] uppercase font-bold block">CMS PORTAL</span>
            <h1 className="font-serif text-sm font-bold text-white tracking-wide">Chitrakatha Admin</h1>
          </div>
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden text-stone-400 hover:text-white p-1">✕</button>
        )}
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#8B0000] text-white font-bold shadow-md'
                  : 'hover:bg-stone-800/80 text-stone-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[9px] uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-stone-800 bg-[#141414] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white font-serif font-bold flex items-center justify-center text-xs shadow-inner">
            H
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">Hemant Mandawade</h4>
            <span className="text-[10px] text-stone-400 block truncate">Clicksbyhemant5564@gmail.com</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
