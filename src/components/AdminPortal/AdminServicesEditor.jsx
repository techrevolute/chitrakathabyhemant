import React, { useState } from 'react';
import { Plus, Trash2, Layers, Check, Eye, EyeOff } from 'lucide-react';
import { INITIAL_SERVICES } from '../../data/initialData';
import { apiSaveServiceItem, apiDeleteSiteImage } from '../../lib/supabase';

export default function AdminServicesEditor({ services = INITIAL_SERVICES, setServices }) {
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    image: '',
    priceStarting: 'Contact for Quote'
  });
  const [saved, setSaved] = useState(false);

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newService.title || !newService.image) return;
    const item = {
      id: `svc-${Date.now()}`,
      ...newService,
      icon: 'Camera',
      details: newService.description || 'Comprehensive custom service package details.'
    };
    if (setServices) {
      setServices([item, ...services]);
    }
    await apiSaveServiceItem(item);
    setNewService({ title: '', description: '', image: '', priceStarting: 'Contact for Quote' });
    triggerSaved();
  };

  const handleDelete = async (id) => {
    if (setServices) {
      setServices(services.filter(s => s.id !== id));
    }
    await apiDeleteSiteImage(id);
    triggerSaved();
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Services Offered Management</h2>
          <p className="text-xs text-stone-400">Add, edit, reorder, or hide photography and videography services</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Services Saved Live
          </span>
        )}
      </div>

      {/* Add New Service Form */}
      <form onSubmit={handleAdd} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Service Offering
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Service Title (e.g. Pre Wedding Photography)"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
          />
          <input
            type="url"
            required
            placeholder="Cover Image URL"
            value={newService.image}
            onChange={(e) => setNewService({ ...newService, image: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
          />
          <input
            type="text"
            placeholder="Starting Price Tag (e.g. Contact for Quote)"
            value={newService.priceStarting}
            onChange={(e) => setNewService({ ...newService, priceStarting: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white sm:col-span-2"
          />
          <textarea
            placeholder="Service Overview & Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white sm:col-span-2"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider shadow-lg"
        >
          Add Service
        </button>
      </form>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.id} className="p-4 bg-[#1C1C1C] rounded-2xl border border-stone-800 flex items-center gap-4 shadow-md">
            <img src={svc.image} alt={svc.title} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-lg font-bold text-white truncate">{svc.title}</h4>
              <p className="text-xs text-stone-400 truncate">{svc.description}</p>
              {svc.priceStarting && (
                <span className="text-[11px] font-mono text-amber-400 font-bold block mt-0.5">Starting: {svc.priceStarting}</span>
              )}
            </div>
            <button
              onClick={() => handleDelete(svc.id)}
              className="p-2 text-red-400 hover:bg-red-950 rounded-xl transition-colors"
              title="Delete Service"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
