import React, { useState, useRef } from 'react';
import { Plus, Trash2, Video, Check, Star, ArrowUp, ArrowDown, Eye, EyeOff, Film, Clock, Play, Upload, FolderOpen, RefreshCw } from 'lucide-react';

export default function AdminVideoEditor({ videos = [], setVideos }) {
  const videoFileInputRef = useRef(null);
  const thumbFileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: 'Wedding Film',
    duration: '03:30',
    thumbnail: '',
    videoUrl: '',
    location: 'Satana & Nashik',
    featured: true
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // --- NATIVE COMPUTER VIDEO FILE SELECTOR (Instant 0-Quota Blob URL) ---
  const handleVideoFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      // Instant Blob URL for 0-memory high-res video playback
      const videoBlobUrl = URL.createObjectURL(file);
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const item = {
        id: `vid-file-${Date.now()}-${index}`,
        title: newVideo.title || cleanFileName,
        description: newVideo.description || 'Cinematic feature video film captured by Hemant Mandawade.',
        category: newVideo.category || 'Wedding Film',
        duration: newVideo.duration || '04:15',
        thumbnail: newVideo.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        videoUrl: videoBlobUrl,
        location: newVideo.location || 'Satana & Nashik',
        views: '1.2k',
        featured: true,
        hidden: false,
        displayOrder: videos.length + index + 1
      };

      setVideos(prev => [item, ...prev]);
    });

    setNewVideo({
      title: '', description: '', category: 'Wedding Film', duration: '03:30',
      thumbnail: '', videoUrl: '', location: 'Satana & Nashik', featured: true
    });
    triggerNotice();
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

  // --- NATIVE COMPUTER THUMBNAIL FILE SELECTOR ---
  const handleThumbFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const thumbBlobUrl = URL.createObjectURL(file);
    setNewVideo(prev => ({ ...prev, thumbnail: thumbBlobUrl }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleVideoFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleAddVideoUrl = (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoUrl) return;

    const item = {
      id: `vid-${Date.now()}`,
      title: newVideo.title,
      description: newVideo.description || 'Cinematic video film captured by Chitrakatha by Hemant.',
      category: newVideo.category || 'Wedding Film',
      duration: newVideo.duration || '03:30',
      thumbnail: newVideo.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      videoUrl: newVideo.videoUrl,
      location: newVideo.location || 'Maharashtra',
      views: '1.5k',
      featured: newVideo.featured,
      hidden: false,
      displayOrder: videos.length + 1
    };

    setVideos([item, ...videos]);
    setNewVideo({
      title: '', description: '', category: 'Wedding Film', duration: '03:30',
      thumbnail: '', videoUrl: '', location: 'Satana & Nashik', featured: true
    });
    triggerNotice();
  };

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
    triggerNotice();
  };

  const handleToggleHide = (id) => {
    setVideos(videos.map(v => v.id === id ? { ...v, hidden: !v.hidden } : v));
    triggerNotice();
  };

  const handleToggleFeatured = (id) => {
    setVideos(videos.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
    triggerNotice();
  };

  const handleReorder = (id, direction) => {
    const idx = videos.findIndex(v => v.id === id);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= videos.length) return;

    const updated = [...videos];
    const temp = updated[idx];
    updated[idx] = updated[newIdx];
    updated[newIdx] = temp;
    setVideos(updated);
    triggerNotice();
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Hidden Native File Inputs */}
      <input
        type="file"
        ref={videoFileInputRef}
        onChange={handleVideoFileSelect}
        accept="video/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={thumbFileInputRef}
        onChange={handleThumbFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Dynamic Video & Film Management</h2>
          <p className="text-xs text-stone-400">Upload 4K wedding films directly from your computer, set thumbnails, duration & categories</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Video Added Successfully
          </span>
        )}
      </div>

      {/* DIRECT COMPUTER VIDEO FILE DROPZONE */}
      <div
        onClick={() => videoFileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer group ${
          dragActive ? 'border-[#8B0000] bg-[#8B0000]/10' : 'border-stone-700 bg-[#1C1C1C] hover:border-amber-500 hover:bg-stone-900/80'
        }`}
      >
        <Upload className="w-10 h-10 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <h4 className="font-serif text-xl font-bold">Upload Video Film Directly From Computer</h4>
        <p className="text-xs text-stone-400 mt-1">Click anywhere in this box or drag & drop MP4/WebM video files directly from your hard drive</p>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); videoFileInputRef.current?.click(); }}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Select Video File From Computer</span>
        </button>
      </div>

      {/* Add New Video via Form */}
      <form onSubmit={handleAddVideoUrl} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Or Add / Embed Video Film Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Video Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Aditya & Ananya - Destination Wedding Film"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Category *</label>
            <select
              value={newVideo.category}
              onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white"
            >
              <option value="Wedding Film">Wedding Film</option>
              <option value="Pre Wedding">Pre Wedding Trailer</option>
              <option value="Drone Cinema">Drone Cinema</option>
              <option value="Sangeet Highlights">Sangeet Highlights</option>
              <option value="Fashion Reel">Fashion Reel</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Video File / Embed URL (MP4) *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Paste MP4 URL or click button to pick file"
                value={newVideo.videoUrl}
                onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
              />
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1"
                title="Choose Video File from PC"
              >
                <FolderOpen className="w-3.5 h-3.5" /> Select PC
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Cover Thumbnail Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Thumbnail Image URL or pick from PC"
                value={newVideo.thumbnail}
                onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
              />
              <button
                type="button"
                onClick={() => thumbFileInputRef.current?.click()}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1"
                title="Choose Thumbnail from PC"
              >
                <FolderOpen className="w-3.5 h-3.5" /> Pick Image
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Duration (MM:SS)</label>
            <input
              type="text"
              placeholder="e.g. 04:25"
              value={newVideo.duration}
              onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Location / Venue</label>
            <input
              type="text"
              placeholder="e.g. Satana & Nashik"
              value={newVideo.location}
              onChange={(e) => setNewVideo({ ...newVideo, location: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Description</label>
            <textarea
              rows="2"
              placeholder="Story outline or highlights..."
              value={newVideo.description}
              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
          Publish Video Film
        </button>
      </form>

      {/* Videos List Grid */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold">Active Videos ({videos.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((vid, idx) => (
            <div key={vid.id} className="bg-[#1C1C1C] rounded-2xl border border-stone-800 p-4 space-y-3 flex flex-col justify-between shadow-lg">
              
              <div className="flex gap-4 items-start">
                {/* Video Thumbnail */}
                <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0">
                  <img src={vid.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-current opacity-80" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                    {vid.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-base font-bold text-white leading-tight truncate">{vid.title}</h4>
                    
                    {/* Reorder Buttons */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReorder(vid.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(vid.id, 'down')}
                        disabled={idx === videos.length - 1}
                        className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-amber-300 block">{vid.category} • {vid.location}</span>
                  <p className="text-xs text-stone-400 line-clamp-2">{vid.description}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(vid.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      vid.featured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${vid.featured ? 'fill-amber-300' : ''}`} />
                    <span>{vid.featured ? 'Featured' : 'Standard'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleHide(vid.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      vid.hidden ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {vid.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{vid.hidden ? 'Hidden' : 'Visible'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteVideo(vid.id)}
                  className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg"
                  title="Delete Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
