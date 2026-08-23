import React, { useState } from 'react';
import {
  Tag, Plus, Trash2, Edit3, Check, Star, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, RefreshCw
} from 'lucide-react';

export default function AdminPricingEditor({ packages = [], setPackages }) {
  const categories = [
    'Wedding Photography',
    'Pre-Wedding',
    'Fashion Shoot',
    'Drone Photography',
    'Cinematic Video',
    'Photo Editing',
    'Video Editing'
  ];

  // New Package Form State
  const [newPkg, setNewPkg] = useState({
    name: '',
    category: 'Wedding Photography',
    image: '',
    description: '',
    featuresText: '',
    price: 'Get Quote / Contact for Best Price',
    duration: 'Full Event',
    deliverables: '350+ Retouched Photos, 4K Feature Film, 2 Albums',
    popular: false
  });

  // Edit Modal State
  const [editingPkg, setEditingPkg] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!newPkg.name || !newPkg.image) return;

    // Parse features newline text into array
    const featuresList = newPkg.featuresText
      ? newPkg.featuresText.split('\n').filter(f => f.trim())
      : [
          'Lead Candid Photographers (Hemant Mandawade & Team)',
          '4K Cinematic Wedding Feature Film',
          'DGCA Compliant 4K Drone Coverage',
          'Luxury Photobook Albums'
        ];

    const item = {
      id: `pkg-${Date.now()}`,
      name: newPkg.name,
      category: newPkg.category,
      image: newPkg.image,
      description: newPkg.description || 'Comprehensive photography & film package for special celebrations across Maharashtra.',
      features: featuresList,
      price: newPkg.price || 'Get Quote / Contact for Best Price',
      duration: newPkg.duration || 'Full Event',
      deliverables: newPkg.deliverables || '350+ Retouched Photos, 4K Feature Film',
      popular: newPkg.popular,
      buttonText: 'Book Package'
    };

    setPackages([item, ...packages]);
    setNewPkg({
      name: '', category: 'Wedding Photography', image: '', description: '',
      featuresText: '', price: 'Get Quote / Contact for Best Price',
      duration: 'Full Event', deliverables: '', popular: false
    });
    triggerNotice();
  };

  const handleUpdatePackage = (e) => {
    e.preventDefault();
    const updatedFeatures = typeof editingPkg.featuresText === 'string'
      ? editingPkg.featuresText.split('\n').filter(f => f.trim())
      : editingPkg.features;

    const updated = packages.map(p => p.id === editingPkg.id ? {
      ...editingPkg,
      features: updatedFeatures
    } : p);

    setPackages(updated);
    setEditingPkg(null);
    triggerNotice();
  };

  const handleDeletePackage = (id, name) => {
    if (window.confirm(`Permanently delete pricing package "${name}"?`)) {
      setPackages(packages.filter(p => p.id !== id));
      triggerNotice();
    }
  };

  const handleTogglePopular = (id) => {
    setPackages(packages.map(p => p.id === id ? { ...p, popular: !p.popular } : p));
    triggerNotice();
  };

  const handleReorderPackage = (id, direction) => {
    const idx = packages.findIndex(p => p.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= packages.length) return;

    const updated = [...packages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPackages(updated);
    triggerNotice();
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Pricing & Package Management</h2>
          <p className="text-xs text-stone-400">Edit prices, descriptions, included features, cover images & badges displayed to customers</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Pricing Changes Saved
          </span>
        )}
      </div>

      {/* Add New Package Form */}
      <form onSubmit={handleCreatePackage} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Photography Package
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Package Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Heritage Wedding Package"
              value={newPkg.name}
              onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Category *</label>
            <select
              value={newPkg.category}
              onChange={(e) => setNewPkg({ ...newPkg, category: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Cover Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={newPkg.image}
              onChange={(e) => setNewPkg({ ...newPkg, image: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Price Quote Tag</label>
            <input
              type="text"
              placeholder="e.g. Contact for Quote / ₹85,000"
              value={newPkg.price}
              onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Duration</label>
            <input
              type="text"
              placeholder="e.g. 2 Days (Full Event)"
              value={newPkg.duration}
              onChange={(e) => setNewPkg({ ...newPkg, duration: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Deliverables Summary</label>
            <input
              type="text"
              placeholder="e.g. 350+ Retouched Photos, 4K Feature Film, Trailer, 2 Albums"
              value={newPkg.deliverables}
              onChange={(e) => setNewPkg({ ...newPkg, deliverables: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Included Features (One feature per line)</label>
            <textarea
              rows="3"
              placeholder="2 Lead Candid Photographers&#10;4K Cinematic Feature Film&#10;DGCA 4K Drone Coverage&#10;2 Luxury Photobooks"
              value={newPkg.featuresText}
              onChange={(e) => setNewPkg({ ...newPkg, featuresText: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
            <input
              type="checkbox"
              checked={newPkg.popular}
              onChange={(e) => setNewPkg({ ...newPkg, popular: e.target.checked })}
              className="accent-[#8B0000] rounded"
            />
            <span>Highlight as "MOST POPULAR CHOICE" Badge</span>
          </label>

          <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
            Create & Publish Package
          </button>
        </div>
      </form>

      {/* Packages List Grid */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold">Active Customer Packages ({packages.length})</h3>

        {packages.length === 0 ? (
          <div className="text-center py-12 bg-[#1C1C1C] rounded-2xl border border-stone-800 text-stone-400">
            No active pricing packages. Create a new package above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg, idx) => (
              <div key={pkg.id} className="bg-[#1C1C1C] rounded-2xl border border-stone-800 p-5 space-y-4 flex flex-col justify-between shadow-xl">
                
                <div className="space-y-3">
                  <div className="flex gap-4 items-start">
                    <img src={pkg.image} alt={pkg.name} className="w-24 h-24 rounded-xl object-cover border border-stone-800 shrink-0" />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">{pkg.category}</span>
                          <h4 className="font-serif text-lg font-bold text-white leading-tight">{pkg.name}</h4>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleReorderPackage(pkg.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderPackage(pkg.id, 'down')}
                            disabled={idx === packages.length - 1}
                            className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-emerald-400 block">{pkg.price}</span>
                      <p className="text-xs text-stone-400 line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>

                  {/* Included Features Preview */}
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Features ({pkg.features?.length || 0}):</span>
                    <ul className="text-[11px] text-stone-300 space-y-0.5 max-h-20 overflow-y-auto">
                      {pkg.features?.map((f, i) => (
                        <li key={i} className="truncate">• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleTogglePopular(pkg.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      pkg.popular ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${pkg.popular ? 'fill-amber-300' : ''}`} />
                    <span>{pkg.popular ? 'Most Popular' : 'Standard'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingPkg({
                        ...pkg,
                        featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features
                      })}
                      className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                      title="Edit Package"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg"
                      title="Delete Package"
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

      {/* EDIT PACKAGE MODAL */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleUpdatePackage} className="bg-[#1C1C1C] rounded-3xl p-6 max-w-xl w-full border border-stone-800 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold">Edit Package: {editingPkg.name}</h3>
              <button type="button" onClick={() => setEditingPkg(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Package Name</label>
                <input
                  type="text"
                  required
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Category</label>
                <select
                  value={editingPkg.category}
                  onChange={(e) => setEditingPkg({ ...editingPkg, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-medium text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Price Quote Tag</label>
                <input
                  type="text"
                  value={editingPkg.price}
                  onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingPkg.image}
                  onChange={(e) => setEditingPkg({ ...editingPkg, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Included Features (One feature per line)</label>
                <textarea
                  rows="4"
                  value={editingPkg.featuresText}
                  onChange={(e) => setEditingPkg({ ...editingPkg, featuresText: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-mono text-white"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
              Save Package Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
