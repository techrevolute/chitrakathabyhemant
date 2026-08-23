import React, { useState } from 'react';
import { Save, Check, User, Image as ImageIcon } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialData';

export default function AdminAboutEditor() {
  const [formData, setFormData] = useState({
    ownerName: BUSINESS_INFO.owner,
    experience: BUSINESS_INFO.experience,
    story: 'With over 12 years of capturing couples and grand celebrations across Maharashtra, Chitrakatha by Hemant was founded on a simple philosophy: every glance, tear of joy, and warm embrace deserves to be preserved in timeless cinematic beauty.',
    mission: 'To preserve raw human emotions and sacred rituals beautifully, creating visual legacies that families cherish for generations.',
    vision: 'To set the benchmark for luxury photography in Maharashtra, blending traditional heritage with contemporary cinematic elegance.',
    profileImage: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000'
  });

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
          <h2 className="font-serif text-3xl font-bold">About Page & Founder Bio Editor</h2>
          <p className="text-xs text-stone-400">Update Hemant Mandawade story, profile image, mission & vision</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> About Content Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#1C1C1C] rounded-3xl p-8 border border-stone-800 space-y-6 shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Owner / Founder Name</label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-serif font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Experience Badge</label>
            <input
              type="text"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Profile Image URL</label>
          <div className="flex items-center gap-4">
            <img src={formData.profileImage} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border border-stone-700" />
            <input
              type="url"
              required
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="flex-1 p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Founder Biography & Story</label>
          <textarea
            rows="4"
            required
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-sans text-stone-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Our Mission</label>
            <textarea
              rows="3"
              required
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Our Vision</label>
            <textarea
              rows="3"
              required
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save About Page</span>
          </button>
        </div>

      </form>

    </div>
  );
}
