import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialData';

export default function AdminSettings() {
  const [formData, setFormData] = useState({ ...BUSINESS_INFO });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Website Global Settings</h2>
          <p className="text-xs text-stone-400">Manage business details, phone numbers, contact email, office location, and social links</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Global Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Business Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-serif font-bold text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Owner Name</label>
            <input
              type="text"
              required
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Contact Phone Number</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono font-bold text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Contact Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Office Address</label>
            <input
              type="text"
              required
              value={formData.office}
              onChange={(e) => setFormData({ ...formData, office: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Service Coverage Area</label>
            <input
              type="text"
              required
              value={formData.serviceArea}
              onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Instagram Profile Link</label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Facebook Page Link</label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Website Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
