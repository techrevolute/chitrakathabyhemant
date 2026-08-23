import React, { useState } from 'react';
import { HardDrive, Search, Filter, Trash2, Eye, Upload, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { INITIAL_PORTFOLIO } from '../../data/initialData';

export default function AdminMediaLibrary() {
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);

  const mediaFiles = [
    { id: 1, name: 'hero_background_video.mp4', type: 'Video', size: '18.4 MB', url: 'https://www.w3schools.com/html/mov_bbb.mp4', uploaded: '2026-08-01' },
    { id: 2, name: 'royal_pune_wedding_01.jpg', type: 'Image', size: '2.8 MB', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000', uploaded: '2026-08-02' },
    { id: 3, name: 'sunset_prewedding_mahabaleshwar.jpg', type: 'Image', size: '3.1 MB', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000', uploaded: '2026-08-03' },
    { id: 4, name: 'drone_aerial_raigad_fort.jpg', type: 'Image', size: '4.2 MB', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1000', uploaded: '2026-08-04' },
    { id: 5, name: 'booking_agreement_terms.pdf', type: 'Document', size: '450 KB', url: '#', uploaded: '2026-07-28' }
  ];

  const filtered = mediaFiles.filter(m => {
    const matchesType = filterType === 'All' || m.type === filterType;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 text-white max-w-5xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Centralized Media Library</h2>
          <p className="text-xs text-stone-400">All uploaded photos, videos, hero clips, and client documents (0 MB / 5.0 GB)</p>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1C1C1C] p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['All', 'Image', 'Video', 'Document'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === t ? 'bg-[#8B0000] text-white' : 'bg-stone-800 text-stone-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Media Files Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-4 bg-[#1C1C1C] rounded-2xl border border-stone-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-stone-900 text-amber-400">
                {item.type === 'Image' ? <ImageIcon className="w-5 h-5" /> : item.type === 'Video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                <span className="text-[10px] text-stone-400">{item.size} • {item.uploaded}</span>
              </div>
            </div>

            {item.type === 'Image' && (
              <div className="h-36 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <button
                onClick={() => setPreviewMedia(item)}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button className="text-red-400 hover:text-red-300 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1C1C1C] p-6 rounded-3xl max-w-2xl w-full border border-stone-800 space-y-4">
            <div className="flex justify-between items-center text-white">
              <h4 className="font-serif text-lg font-bold">{previewMedia.name}</h4>
              <button onClick={() => setPreviewMedia(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            {previewMedia.type === 'Image' ? (
              <img src={previewMedia.url} alt={previewMedia.name} className="max-h-96 w-full object-contain rounded-xl" />
            ) : previewMedia.type === 'Video' ? (
              <video controls className="w-full max-h-96 rounded-xl">
                <source src={previewMedia.url} type="video/mp4" />
              </video>
            ) : (
              <div className="p-8 text-center text-stone-400">Document preview placeholder</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
