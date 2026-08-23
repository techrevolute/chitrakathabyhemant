import React, { useState } from 'react';
import { Search, Save, Check, FileCode } from 'lucide-react';

export default function AdminSeoEditor() {
  const [seo, setSeo] = useState({
    title: 'Chitrakatha by Hemant | Luxury Wedding Photography in Maharashtra',
    description: 'Chitrakatha by Hemant Mandawade - 12+ years of luxury wedding, pre-wedding, fashion & drone photography across Maharashtra.',
    keywords: 'wedding photographer in maharashtra, pre wedding shoot pune, satana nashik photographer, drone cinema',
    ogTitle: 'Chitrakatha by Hemant | Luxury Photography',
    ogImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    canonical: 'https://chitrakathabyhemant.com'
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
          <h2 className="font-serif text-3xl font-bold">SEO & Schema Markup Generator</h2>
          <p className="text-xs text-stone-400">Meta tags, Open Graph previews, XML sitemap generation, and JSON-LD schema</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Meta Tags & SEO Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Search Engine Meta Tags</h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Meta Title Tag</label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Meta Description</label>
            <textarea
              rows="3"
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Keywords (Comma Separated)</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Canonical URL</label>
              <input
                type="text"
                value={seo.canonical}
                onChange={(e) => setSeo({ ...seo, canonical: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300">Social Open Graph Image URL</label>
              <input
                type="url"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
          Save SEO Meta Settings
        </button>
      </form>

      {/* JSON-LD Preview */}
      <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <FileCode className="w-4 h-4" /> Generated Schema Markup (JSON-LD)
        </h4>
        <pre className="p-4 rounded-xl bg-stone-950 text-emerald-400 text-[11px] font-mono overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Chitrakatha by Hemant",
  "founder": "Hemant Mandawade",
  "telephone": "7249532553",
  "email": "clicksbyhemant5564@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Satana, Nashik",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  }
}`}
        </pre>
      </div>

    </div>
  );
}
