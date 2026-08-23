import React, { useState } from 'react';
import { Globe, Save, Check } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';

export default function AdminLanguageEditor({ lang, setLang }) {
  const [activeLang, setActiveLang] = useState('mr');
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
          <h2 className="font-serif text-3xl font-bold">Multi-Language Content Manager</h2>
          <p className="text-xs text-stone-400">Edit English, Marathi (मराठी), and Hindi (हिंदी) dictionary content independently</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Translations Saved
          </span>
        )}
      </div>

      {/* Language Switcher Tabs */}
      <div className="flex gap-2">
        {[
          { code: 'en', label: 'English (EN)' },
          { code: 'mr', label: 'मराठी (MR)' },
          { code: 'hi', label: 'हिंदी (HI)' }
        ].map((l) => (
          <button
            key={l.code}
            onClick={() => setActiveLang(l.code)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeLang === l.code ? 'bg-[#8B0000] text-white shadow-lg' : 'bg-[#1C1C1C] border border-stone-800 text-stone-300'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Editing Translations for [{activeLang.toUpperCase()}]
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Main Title</label>
            <input
              type="text"
              defaultValue={TRANSLATIONS[activeLang]?.hero?.title || ''}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Hero Subtitle</label>
            <textarea
              rows="2"
              defaultValue={TRANSLATIONS[activeLang]?.hero?.subtitle || ''}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Call To Action Heading</label>
            <input
              type="text"
              defaultValue={TRANSLATIONS[activeLang]?.cta?.title || ''}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
          Save {activeLang.toUpperCase()} Translations
        </button>
      </form>

    </div>
  );
}
