import React, { useState, useRef } from 'react';
import { Plus, Trash2, Video, Check, Star, ArrowUp, ArrowDown, Eye, EyeOff, Film, Clock, Play, Upload, FolderOpen, RefreshCw, Edit3, X, Save } from 'lucide-react';
import { formatGoogleDriveUrl, compressImageFile, apiSaveSiteImage, apiDeleteSiteImage } from '../../lib/supabase';
import { setVideoBlob, usePersistentState } from '../../lib/storage';

const DEFAULT_VIDEO_CATEGORIES = [
  'Wedding Film',
  'Engagement',
  'Pre-Wedding',
  'Maternity',
  'Fashion',
  'Drone Cinema',
  'Sangeet Highlights',
  'Haldi & Mehendi',
  'Corporate Reel'
];

function CategoryManagerModal({ isOpen, onClose, categories, setCategories }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1C1C1C] border border-stone-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-bold">Manage Categories</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-stone-400" /></button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-stone-900 rounded-lg border border-stone-800">
              <span className="text-xs text-white">{cat}</span>
              <button onClick={() => setCategories(categories.filter((_, i) => i !== idx))} className="text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminVideoEditor({ videos = [], setVideos, categories = [], setCategories }) {
  const videoFileInputRef = useRef(null);
  const thumbFileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const [categoryList, setCategoryList] = usePersistentState(
    'chitrakatha_video_categories_list',
    DEFAULT_VIDEO_CATEGORIES
  );
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const allAvailableCategories = Array.from(new Set([
    ...categoryList,
    ...(Array.isArray(categories) ? categories.map(c => c.name) : []),
    ...videos.map(v => v.category).filter(Boolean)
  ])).filter(Boolean);

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: allAvailableCategories[0] || 'Wedding Film',
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

  const handleVideoFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const id = `vid-file-${Date.now()}-${index}`;

      await setVideoBlob(`video_file_${id}`, file);
      const videoBlobUrl = URL.createObjectURL(file);

      const item = {
        id: id,
        title: newVideo.title || cleanFileName,
        description: newVideo.description || 'Cinematic feature video film captured by Hemant Mandawade.',
        category: newVideo.category || allAvailableCategories[0] || 'Wedding Film',
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
    }

    setNewVideo({
      title: '', description: '', category: allAvailableCategories[0] || 'Wedding Film', duration: '03:30',
      thumbnail: '', videoUrl: '', location: 'Satana & Nashik', featured: true
    });
    triggerNotice();
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

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

  const handleAddVideoUrl = async (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoUrl) return;

    const item = {
      id: `vid-${Date.now()}`,
      title: newVideo.title,
      description: newVideo.description || 'Cinematic video film captured by Chitrakatha by Hemant.',
      category: newVideo.category || allAvailableCategories[0] || 'Wedding Film',
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

    // Save video record directly to Supabase Cloud database
    await apiSaveSiteImage({
      section: 'video',
      image_url: item.videoUrl,
      title: item.title,
      category: item.category,
      display_order: item.displayOrder,
      is_active: true
    });

    setNewVideo({
      title: '', description: '', category: allAvailableCategories[0] || 'Wedding Film', duration: '03:30',
      thumbnail: '', videoUrl: '', location: 'Satana & Nashik', featured: true
    });
    triggerNotice();
  };

  const handleDeleteVideo = async (id) => {
    setVideos(videos.filter(v => v.id !== id));
    await apiDeleteSiteImage(id);
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

  const handleReplaceVideoThumbnail = (id) => {
    const current = videos.find(v => v.id === id);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const compressedUrl = await compressImageFile(file, 1600, 1600, 0.82);
          if (compressedUrl) {
            setVideos(videos.map(v => v.id === id ? { ...v, thumbnail: compressedUrl } : v));
            triggerNotice();
          }
        } catch (err) {
          const thumbBlobUrl = URL.createObjectURL(file);
          setVideos(videos.map(v => v.id === id ? { ...v, thumbnail: thumbBlobUrl } : v));
          triggerNotice();
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      <CategoryManagerModal isOpen={showCategoryManager} onClose={() => setShowCategoryManager(false)} categories={categoryList} setCategories={setCategoryList} />
      
      <input type="file" ref={videoFileInputRef} onChange={handleVideoFileSelect} accept="video/*" multiple className="hidden" />
      <input type="file" ref={thumbFileInputRef} onChange={handleThumbFileSelect} accept="image/*" className="hidden" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <Film className="w-6 h-6 text-amber-400" /> Cinematic Films & Video Manager
          </h2>
          <p className="text-xs text-stone-400">Upload videos directly from your computer or paste video URLs (YouTube, Google Drive, MP4).</p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-amber-400" />
          <span>Video configuration updated & saved successfully!</span>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => videoFileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
            : 'border-stone-700 bg-[#1C1C1C] hover:border-amber-400/60 hover:bg-stone-900'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold">Select or Drag Video Files from PC</h3>
            <p className="text-xs text-stone-400 mt-1">Supports MP4, WebM, MOV. Instant 0-Quota storage directly saved to your browser.</p>
          </div>
          <button type="button" className="mt-2 px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold uppercase tracking-wider transition-all">
            Browse Computer Files
          </button>
        </div>
      </div>

      <form onSubmit={handleAddVideoUrl} className="bg-[#1C1C1C] p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold flex items-center gap-2 border-b border-stone-800 pb-3">
          <Plus className="w-5 h-5 text-amber-400" /> Add New Video Entry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Video Title *</label>
            <input type="text" required placeholder="e.g. Aditya & Ananya - Wedding Film" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-300 uppercase">Category *</label>
              <button type="button" onClick={() => setShowCategoryManager(true)} className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                <Edit3 className="w-3 h-3" /> Edit Categories
              </button>
            </div>

            {!isCustomCategory ? (
              <select
                value={newVideo.category}
                onChange={(e) => {
                  if (e.target.value === '__ADD_NEW__') {
                    setIsCustomCategory(true);
                    setNewVideo(prev => ({ ...prev, category: '' }));
                  } else {
                    setNewVideo(prev => ({ ...prev, category: e.target.value }));
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                {allAvailableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__ADD_NEW__">➕ + Add New Custom Category...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type custom category name..."
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-amber-400 text-xs font-medium text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newVideo.category && newVideo.category.trim()) {
                      const trimmed = newVideo.category.trim();
                      if (!categoryList.includes(trimmed)) {
                        setCategoryList(prev => [...prev, trimmed]);
                      }
                    }
                    setIsCustomCategory(false);
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl shrink-0"
                >
                  Done
                </button>
              </div>
            )}
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
                <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 group/vthumb">
                  <img src={vid.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-current opacity-80" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReplaceVideoThumbnail(vid.id)}
                    className="absolute inset-0 bg-black/75 opacity-0 group-hover/vthumb:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                    title="Change Video Thumbnail"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400 mb-1" />
                    <span>Change Thumbnail</span>
                  </button>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white pointer-events-none">
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
                    onClick={() => handleReplaceVideoThumbnail(vid.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors bg-stone-900 text-cyan-400 border border-stone-700 hover:bg-stone-800 cursor-pointer"
                    title="Change Video Thumbnail"
                  >
                    <Edit3 className="w-3 h-3 text-cyan-400" />
                    <span>Change Thumbnail</span>
                  </button>

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
