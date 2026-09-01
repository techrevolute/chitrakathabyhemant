import React, { useState, useRef } from 'react';
import { Video, Plus, Trash2, Check, ShieldCheck, Upload, FolderOpen, RefreshCw } from 'lucide-react';
import { apiSaveSiteImage, apiDeleteSiteImage } from '../../lib/supabase';

export default function AdminDroneEditor({ portfolio = [], setPortfolio }) {
  const droneItems = portfolio.filter(p => p.category && p.category.toLowerCase().includes('drone'));

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const [newDrone, setNewDrone] = useState({
    title: '',
    image: '',
    location: 'Raigad Fort Coast, MH'
  });
  const [saved, setSaved] = useState(false);

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // --- NATIVE FILE UPLOAD FROM COMPUTER ---
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target.result;
        const item = {
          id: `drone-file-${Date.now()}-${index}`,
          title: newDrone.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          image: imageUrl,
          location: newDrone.location || 'Maharashtra',
          category: 'Drone Photography',
          aspect: 'wide',
          featured: true,
          hidden: false
        };
        setPortfolio(prev => [item, ...prev]);
        await apiSaveSiteImage({
          id: item.id,
          section: 'portfolio',
          image_url: item.image,
          title: item.title,
          category: 'Drone Photography',
          display_order: 1,
          is_active: true,
          data: item
        });
      };
      reader.readAsDataURL(file);
    });

    setNewDrone({ title: '', image: '', location: 'Raigad Fort Coast, MH' });
    triggerSaved();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!newDrone.title || !newDrone.image) return;
    const item = {
      id: `drone-${Date.now()}`,
      title: newDrone.title,
      image: newDrone.image,
      location: newDrone.location || 'Maharashtra',
      category: 'Drone Photography',
      aspect: 'wide',
      featured: true,
      hidden: false
    };
    setPortfolio([item, ...portfolio]);
    await apiSaveSiteImage({
      id: item.id,
      section: 'portfolio',
      image_url: item.image,
      title: item.title,
      category: 'Drone Photography',
      display_order: 1,
      is_active: true,
      data: item
    });
    setNewDrone({ title: '', image: '', location: 'Raigad Fort Coast, MH' });
    triggerSaved();
  };

  const handleReplaceImage = async (id) => {
    const current = portfolio.find(p => p.id === id);
    const newUrl = window.prompt("Enter replacement Drone Image URL:", current?.image);
    if (newUrl && newUrl.trim()) {
      const updated = portfolio.map(p => p.id === id ? { ...p, image: newUrl.trim() } : p);
      setPortfolio(updated);
      const updatedItem = updated.find(p => p.id === id);
      if (updatedItem) {
        await apiSaveSiteImage({
          id: updatedItem.id,
          section: 'portfolio',
          image_url: updatedItem.image,
          title: updatedItem.title,
          category: 'Drone Photography',
          display_order: 1,
          is_active: true,
          data: updatedItem
        });
      }
      triggerSaved();
    }
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Drone & Aerial Cinema Gallery</h2>
          <p className="text-xs text-stone-400">DGCA licensed aerial photography and 4K video showcase</p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Drone Gallery Updated
          </span>
        )}
      </div>

      {/* DIRECT FILE UPLOAD DROPZONE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer group ${
          dragActive ? 'border-[#8B0000] bg-[#8B0000]/10' : 'border-stone-700 bg-[#1C1C1C] hover:border-amber-500 hover:bg-stone-900/80'
        }`}
      >
        <Upload className="w-10 h-10 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <h4 className="font-serif text-xl font-bold">Upload Aerial Drone Photo Directly From Computer</h4>
        <p className="text-xs text-stone-400 mt-1">Click anywhere in this box or drag & drop high-res aerial drone photos directly</p>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Select File From Computer</span>
        </button>
      </div>

      {/* ADD VIA URL FORM */}
      <form onSubmit={handleAddUrl} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Or Add Aerial Drone Visual via Image URL
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Aerial Title (e.g. Alibaug Coast Aerial)"
            value={newDrone.title}
            onChange={(e) => setNewDrone({ ...newDrone, title: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
          />
          <input
            type="url"
            required
            placeholder="High-Res Image/Video Poster URL"
            value={newDrone.image}
            onChange={(e) => setNewDrone({ ...newDrone, image: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
          />
          <input
            type="text"
            placeholder="Location (e.g. Raigad Fort Coast, MH)"
            value={newDrone.location}
            onChange={(e) => setNewDrone({ ...newDrone, location: e.target.value })}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white sm:col-span-2"
          />
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
          Add Drone Visual
        </button>
      </form>

      {/* DRONE ITEMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {droneItems.map((item) => (
          <div key={item.id} className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 aspect-video group shadow-lg">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300">DGCA LICENSED AERIAL</span>
                <h5 className="font-serif text-lg font-bold text-white leading-tight">{item.title}</h5>
                <span className="text-xs text-stone-300 block mt-0.5">{item.location}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleReplaceImage(item.id)}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Replace URL
                </button>

                <button
                  type="button"
                  onClick={() => setPortfolio(portfolio.filter(p => p.id !== item.id))}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  title="Delete Drone Visual"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
