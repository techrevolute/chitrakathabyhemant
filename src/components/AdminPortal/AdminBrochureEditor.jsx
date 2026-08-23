import React, { useState } from 'react';
import {
  FileText, Upload, Trash2, Eye, Download, Check, AlertCircle, RefreshCw, Star, Plus, ShieldCheck
} from 'lucide-react';

export default function AdminBrochureEditor({ brochures = [], setBrochures }) {
  const [selectedCategory, setSelectedCategory] = useState('Wedding Packages');
  const [savedNotice, setSavedNotice] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);

  const categories = [
    'Wedding Packages',
    'Pre-Wedding Packages',
    'Fashion Shoot Packages',
    'Drone Packages',
    'Corporate Packages'
  ];

  const [newPdf, setNewPdf] = useState({
    name: '',
    category: 'Wedding Packages',
    description: '',
    fileUrl: ''
  });

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddBrochure = (e) => {
    e.preventDefault();
    if (!newPdf.name || !newPdf.fileUrl) return;

    // Deactivate previous brochures in same category if active
    const updatedBrochures = brochures.map(b => 
      b.category === newPdf.category ? { ...b, active: false } : b
    );

    const item = {
      id: `pdf-${Date.now()}`,
      name: newPdf.name,
      category: newPdf.category,
      description: newPdf.description || 'Official package pricing & deliverables brochure by Chitrakatha by Hemant.',
      fileUrl: newPdf.fileUrl,
      uploadDate: new Date().toISOString().split('T')[0],
      active: true,
      createdBy: 'Hemant Mandawade'
    };

    setBrochures([item, ...updatedBrochures]);
    setNewPdf({ name: '', category: selectedCategory, description: '', fileUrl: '' });
    triggerNotice();
  };

  const handleSetActive = (id, category) => {
    setBrochures(brochures.map(b => {
      if (b.category === category) {
        return { ...b, active: b.id === id };
      }
      return b;
    }));
    triggerNotice();
  };

  const handleDelete = (id) => {
    if (window.confirm("Permanently delete this brochure PDF?")) {
      setBrochures(brochures.filter(b => b.id !== id));
      triggerNotice();
    }
  };

  const handleReplaceUrl = (id) => {
    const current = brochures.find(b => b.id === id);
    const newUrl = window.prompt("Enter replacement PDF URL:", current?.fileUrl);
    if (newUrl && newUrl.trim()) {
      setBrochures(brochures.map(b => b.id === id ? { ...b, fileUrl: newUrl.trim() } : b));
      triggerNotice();
    }
  };

  const filteredBrochures = brochures.filter(b => b.category === selectedCategory);

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Package Brochure CMS Manager</h2>
          <p className="text-xs text-stone-400">Upload PDF package brochures, replace URLs, select active published brochures per category</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Brochure Published Live
          </span>
        )}
      </div>

      {/* Category Pills Selector */}
      <div className="bg-[#1C1C1C] p-4 rounded-2xl border border-stone-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Brochure Category:</span>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Upload PDF Form */}
      <form onSubmit={handleAddBrochure} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload / Publish New PDF Brochure for [{selectedCategory}]
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Brochure Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Chitrakatha Complete 2026 Wedding Brochure (PDF)"
              value={newPdf.name}
              onChange={(e) => setNewPdf({ ...newPdf, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Category</label>
            <select
              value={newPdf.category}
              onChange={(e) => setNewPdf({ ...newPdf, category: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">PDF Document File URL *</label>
            <input
              type="url"
              required
              placeholder="https://.../wedding_package_brochure.pdf"
              value={newPdf.fileUrl}
              onChange={(e) => setNewPdf({ ...newPdf, fileUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Description / Deliverables Overview</label>
            <textarea
              rows="2"
              placeholder="Short summary of what this brochure covers..."
              value={newPdf.description}
              onChange={(e) => setNewPdf({ ...newPdf, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
          Upload & Publish Brochure
        </button>
      </form>

      {/* Brochure List for Selected Category */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold">Uploaded Brochures in [{selectedCategory}] ({filteredBrochures.length})</h3>

        {filteredBrochures.length === 0 ? (
          <div className="text-center py-12 bg-[#1C1C1C] rounded-2xl border border-stone-800 text-stone-400">
            No brochures uploaded for <strong>"{selectedCategory}"</strong> yet. Upload a PDF above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBrochures.map((pdf) => (
              <div key={pdf.id} className="bg-[#1C1C1C] rounded-2xl border border-stone-800 p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex gap-3 items-start">
                  <div className="p-3 rounded-2xl bg-[#8B0000]/20 text-red-400 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-base font-bold text-white leading-tight truncate">{pdf.name}</h4>
                      {pdf.active && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 shrink-0">
                          ACTIVE LIVE
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-stone-400 line-clamp-2">{pdf.description}</p>
                    <span className="text-[10px] text-stone-500 block font-mono">Uploaded: {pdf.uploadDate} • By {pdf.createdBy || 'Hemant'}</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* Set Active Button */}
                    <button
                      type="button"
                      onClick={() => handleSetActive(pdf.id, pdf.category)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        pdf.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-stone-900 text-stone-400 hover:text-white'
                      }`}
                    >
                      {pdf.active ? 'Active Published' : 'Set as Active'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReplaceUrl(pdf.id)}
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                    >
                      <RefreshCw className="w-3 h-3" /> Replace URL
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={pdf.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(pdf.id)}
                      className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg"
                      title="Delete PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
