import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Image as ImageIcon, Sparkles, Upload, Check, Sliders, Eye, EyeOff,
  Star, ArrowUp, ArrowDown, Edit3, FolderPlus, MoveRight, ShieldCheck, Layers, RefreshCw, FolderOpen,
  FolderSync, Link2, AlertTriangle, ExternalLink
} from 'lucide-react';
import {
  formatGoogleDriveUrl, appendCacheBuster, handleImageError, compressImageFile,
  extractGoogleDriveFolderId, fetchGoogleDriveFolderPhotos, apiSaveSiteImage, apiUploadStorageFile,
  apiSaveCategoryItem, apiSavePortfolioItem, apiDeleteSiteImage
} from '../../lib/supabase';

export default function AdminPortfolioEditor({
  portfolio, setPortfolio,
  categories, setCategories,
  watermark, setWatermark,
  driveFolders = [], setDriveFolders
}) {
  const [activeTab, setActiveTab] = useState('images'); // 'images', 'folder_sync', 'categories', 'watermark'
  
  // Category Form State
  const [newCat, setNewCat] = useState({ name: '', coverImage: '' });
  
  // Photo Form & Filter State
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [directUploadCategory, setDirectUploadCategory] = useState(categories[0]?.name || 'Wedding Photography');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyWatermarkOnUpload, setApplyWatermarkOnUpload] = useState(true);

  // Google Drive Folder Sync State
  const [folderUrlInput, setFolderUrlInput] = useState('');
  const [folderCategoryInput, setFolderCategoryInput] = useState(categories[0]?.name || 'Wedding');
  const [folderSyncing, setFolderSyncing] = useState(false);
  const [folderError, setFolderError] = useState('');

  // File Input Ref for Direct File Picker
  const fileInputRef = useRef(null);

  // New Photo Form
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    categoryName: categories[0]?.name || 'Wedding Photography',
    image: '',
    altText: '',
    location: 'Maharashtra',
    featured: true
  });

  // Edit Modal State
  const [editingPhoto, setEditingPhoto] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // --- GOOGLE DRIVE FOLDER SYNC HANDLER (UP TO 50 PHOTOS) ---
  const handleSyncGoogleDriveFolder = async (e) => {
    if (e) e.preventDefault();
    if (!folderUrlInput.trim()) return;

    setFolderSyncing(true);
    setFolderError('');

    try {
      const folderId = extractGoogleDriveFolderId(folderUrlInput);
      if (!folderId) {
        setFolderError('Unable to access this Google Drive folder. Please check folder sharing permissions.');
        setFolderSyncing(false);
        return;
      }

      const result = await fetchGoogleDriveFolderPhotos(folderUrlInput, folderCategoryInput);
      if (result && result.photos && result.photos.length > 0) {
        // Remove old photos from this specific folder if re-syncing
        const remainingPortfolio = portfolio.filter(p => p.googleDriveFolderId !== folderId);
        
        // Combine newly fetched folder photos (max 50) with remaining portfolio
        setPortfolio([...result.photos, ...remainingPortfolio]);

        // Save synced folder record
        const folderRecord = {
          id: `folder-${folderId}`,
          folderId: folderId,
          folderUrl: result.folderUrl,
          categoryName: folderCategoryInput,
          itemCount: result.photos.length,
          lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedFolders = [folderRecord, ...driveFolders.filter(f => f.folderId !== folderId)];
        if (setDriveFolders) setDriveFolders(updatedFolders);

        setFolderUrlInput('');
        triggerNotice();
      }
    } catch (err) {
      console.error('Folder sync error:', err);
      setFolderError(err.message || 'Unable to access this Google Drive folder. Please check folder sharing permissions.');
    } finally {
      setFolderSyncing(false);
    }
  };

  // --- RE-SYNC EXISTING FOLDER ---
  const handleReSyncFolder = async (folderRecord) => {
    setFolderSyncing(true);
    setFolderError('');
    try {
      const result = await fetchGoogleDriveFolderPhotos(folderRecord.folderUrl, folderRecord.categoryName);
      if (result && result.photos) {
        const remainingPortfolio = portfolio.filter(p => p.googleDriveFolderId !== folderRecord.folderId);
        setPortfolio([...result.photos, ...remainingPortfolio]);

        const updatedRecord = {
          ...folderRecord,
          itemCount: result.photos.length,
          lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedFolders = driveFolders.map(f => f.folderId === folderRecord.folderId ? updatedRecord : f);
        if (setDriveFolders) setDriveFolders(updatedFolders);

        triggerNotice();
      }
    } catch (err) {
      alert(err.message || 'Unable to access this Google Drive folder. Please check folder sharing permissions.');
    } finally {
      setFolderSyncing(false);
    }
  };

  // --- REMOVE SYNCED FOLDER ---
  const handleRemoveSyncedFolder = (folderId) => {
    if (window.confirm('Remove this synced Google Drive folder and its photos from portfolio?')) {
      const remainingPortfolio = portfolio.filter(p => p.googleDriveFolderId !== folderId);
      setPortfolio(remainingPortfolio);
      if (setDriveFolders) setDriveFolders(driveFolders.filter(f => f.folderId !== folderId));
      triggerNotice();
    }
  };

  // --- DIRECT NATIVE FILE UPLOAD HANDLER (SUPPORTS UP TO 50+ HIGH-RES IMAGES AT ONCE) ---
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const targetCat = directUploadCategory || (selectedCatFilter === 'All' ? (categories[0]?.name || 'Wedding Photography') : selectedCatFilter);
    const catObj = categories.find(c => c.name.toLowerCase().trim() === targetCat.toLowerCase().trim());

    const newItems = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      try {
        let finalImageUrl = '';
        try {
          const uploadRes = await apiUploadStorageFile('website-images', file);
          finalImageUrl = uploadRes?.publicUrl || '';
        } catch (uErr) {
          console.error('Portfolio upload error:', uErr);
          alert(`Upload failed for ${file.name}: ${uErr.message || 'Check storage'}`);
          continue;
        }

        if (finalImageUrl) {
          const item = {
            id: `img-file-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            categoryId: catObj?.id || 'cat-wedding',
            category: targetCat,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            description: `Photograph captured by Hemant Mandawade.`,
            image: finalImageUrl,
            altText: `${file.name} - ${targetCat} Photography`,
            location: 'Maharashtra',
            featured: true,
            hidden: false,
            watermarked: applyWatermarkOnUpload && watermark.enabled,
            displayOrder: portfolio.length + index + 1
          };
          newItems.push(item);
          await apiSavePortfolioItem(item);
        }
      } catch (err) {
        console.error('File process error:', err);
      }
    }

    if (newItems.length > 0) {
      setPortfolio([...newItems, ...portfolio]);
      triggerNotice();
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  // --- CATEGORY HANDLERS ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    const cat = {
      id: `cat-${Date.now()}`,
      name: newCat.name.trim(),
      slug: newCat.name.toLowerCase().replace(/\s+/g, '-'),
      coverImage: formatGoogleDriveUrl(newCat.coverImage) || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      displayOrder: categories.length + 1,
      hidden: false
    };
    setCategories([...categories, cat]);
    await apiSaveCategoryItem(cat);
    setNewCat({ name: '', coverImage: '' });
    triggerNotice();
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"? Photos in this category will remain.`)) {
      setCategories(categories.filter(c => c.id !== id));
      await apiDeleteSiteImage(id);
      triggerNotice();
    }
  };

  const handleToggleHideCategory = async (id) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    const updated = { ...target, hidden: !target.hidden };
    setCategories(categories.map(c => c.id === id ? updated : c));
    await apiSaveCategoryItem(updated);
    triggerNotice();
  };

  // --- PHOTO HANDLERS ---
  const handleAddSinglePhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.image) return;

    const catObj = categories.find(c => c.name === newPhoto.categoryName);
    const formattedImg = formatGoogleDriveUrl(newPhoto.image);

    const item = {
      id: `img-${Date.now()}`,
      categoryId: catObj?.id || 'cat-wedding',
      category: newPhoto.categoryName,
      title: newPhoto.title,
      description: newPhoto.description || '',
      image: formattedImg,
      altText: newPhoto.altText || newPhoto.title,
      location: newPhoto.location || 'Maharashtra',
      featured: newPhoto.featured,
      hidden: false,
      watermarked: applyWatermarkOnUpload && watermark.enabled,
      displayOrder: portfolio.length + 1
    };

    setPortfolio([item, ...portfolio]);
    await apiSavePortfolioItem(item);
    setNewPhoto({
      title: '', description: '', categoryName: selectedCatFilter === 'All' ? (categories[0]?.name || 'Wedding Photography') : selectedCatFilter,
      image: '', altText: '', location: 'Maharashtra', featured: true
    });
    triggerNotice();
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    const updated = {
      ...editingPhoto,
      image: formatGoogleDriveUrl(editingPhoto.image)
    };
    setPortfolio(portfolio.map(p => p.id === editingPhoto.id ? updated : p));
    await apiSavePortfolioItem(updated);
    setEditingPhoto(null);
    triggerNotice();
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Delete this photo from the portfolio?')) {
      setPortfolio(portfolio.filter(p => p.id !== id));
      await apiDeleteSiteImage(id);
      triggerNotice();
    }
  };

  const handleToggleHidePhoto = async (id) => {
    const target = portfolio.find(p => p.id === id);
    if (!target) return;
    const updated = { ...target, hidden: !target.hidden };
    setPortfolio(portfolio.map(p => p.id === id ? updated : p));
    await apiSavePortfolioItem(updated);
    triggerNotice();
  };

  const handleToggleFeatured = async (id) => {
    const target = portfolio.find(p => p.id === id);
    if (!target) return;
    const updated = { ...target, featured: !target.featured };
    setPortfolio(portfolio.map(p => p.id === id ? updated : p));
    await apiSavePortfolioItem(updated);
    triggerNotice();
  };

  const handleReplaceImage = (id) => {
    const current = portfolio.find(p => p.id === id);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const uploadRes = await apiUploadStorageFile('website-images', file);
          if (uploadRes?.publicUrl) {
            const updated = { ...current, image: uploadRes.publicUrl };
            setPortfolio(portfolio.map(p => p.id === id ? updated : p));
            await apiSavePortfolioItem(updated);
            triggerNotice();
          }
        } catch (err) {
          console.error('Error uploading replacement image:', err);
        }
      }
    };

    const choice = window.confirm("Change Photo:\n\nClick OK to select a new image file from your computer.\nClick Cancel to paste an Image URL or Google Drive link instead.");
    if (choice) {
      input.click();
    } else {
      const newUrl = window.prompt("Enter replacement Image URL or Google Drive share link:", current?.image);
      if (newUrl && newUrl.trim()) {
        const formatted = formatGoogleDriveUrl(newUrl.trim());
        const updated = { ...current, image: formatted };
        setPortfolio(portfolio.map(p => p.id === id ? updated : p));
        apiSavePortfolioItem(updated);
        triggerNotice();
      }
    }
  };

  const handleMoveCategory = (id, targetCategoryName) => {
    const catObj = categories.find(c => c.name === targetCategoryName);
    setPortfolio(portfolio.map(p => p.id === id ? { ...p, category: targetCategoryName, categoryId: catObj?.id || p.categoryId } : p));
    triggerNotice();
  };

  const handleReorderPhoto = (id, direction) => {
    const idx = portfolio.findIndex(p => p.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= portfolio.length) return;

    const updated = [...portfolio];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPortfolio(updated);
    triggerNotice();
  };

  // Filtered Media List
  const filteredPortfolio = portfolio.filter(p => {
    const matchesCat = selectedCatFilter === 'All' || p.category.toLowerCase().trim() === selectedCatFilter.toLowerCase().trim();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Hidden Native File Input for Direct Local Image Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Top Title & Saved Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Featured Portfolio CMS Manager</h2>
          <p className="text-xs text-stone-400">Upload photos directly from your computer, manage category highlights, replace images & reorder</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Gallery Changes Live
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-800 pb-3 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'images' ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Manage Category Media ({portfolio.length} Total)</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'categories' ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('watermark')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'watermark' ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Watermark Rules</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: MEDIA ITEMS MANAGER */}
      {/* =================================================================== */}
      {activeTab === 'images' && (
        <div className="space-y-8">
          
          {/* Category Quick Selector Pills */}
          <div className="bg-[#1C1C1C] p-4 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Select Category to Manage Media:</span>
              <span className="text-xs text-stone-400 font-mono">Showing {filteredPortfolio.length} Items</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCatFilter('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCatFilter === 'All' ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-300 hover:text-white'
                }`}
              >
                All Categories ({portfolio.length})
              </button>

              {categories.map((cat) => {
                const count = portfolio.filter(p => p.category && p.category.toLowerCase().trim() === cat.name.toLowerCase().trim()).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatFilter(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCatFilter === cat.name ? 'bg-[#8B0000] text-white shadow-md' : 'bg-stone-900 text-stone-300 hover:text-white'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================================== */}
          {/* GOOGLE DRIVE FOLDER SYNC MANAGER CARD (UP TO 50 PHOTOS AT ONCE) */}
          {/* =================================================================== */}
          <div className="bg-[#1C1C1C] p-6 rounded-3xl border border-amber-900/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#8B0000]/20 text-[#8B0000] border border-[#8B0000]/30 flex items-center justify-center">
                  <FolderSync className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Google Drive Folder Sync Gallery</h3>
                  <p className="text-xs text-stone-400">Paste ONE Google Drive folder URL to import up to 50 photos automatically</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
                Max 50 Photos per Folder
              </span>
            </div>

            {/* Folder Sync Form */}
            <form onSubmit={handleSyncGoogleDriveFolder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                    Google Drive Folder URL
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing"
                      value={folderUrlInput}
                      onChange={(e) => setFolderUrlInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white placeholder-stone-600 focus:border-[#8B0000] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                    Target Category
                  </label>
                  <select
                    value={folderCategoryInput}
                    onChange={(e) => setFolderCategoryInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {folderError && (
                <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-800 text-red-200 text-xs flex items-center gap-2.5 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-semibold">{folderError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-stone-400">
                  💡 Note: Ensure the folder is shared as <strong>"Anyone with the link can view"</strong>.
                </p>

                <button
                  type="submit"
                  disabled={folderSyncing}
                  className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${folderSyncing ? 'animate-spin' : ''}`} />
                  <span>{folderSyncing ? 'Syncing Google Folder...' : 'Sync / Import Google Drive Folder'}</span>
                </button>
              </div>
            </form>

            {/* Active Synced Folders List */}
            {driveFolders.length > 0 && (
              <div className="pt-4 border-t border-stone-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  Synced Google Drive Folders ({driveFolders.length})
                </h4>

                <div className="space-y-2">
                  {driveFolders.map((folder) => (
                    <div key={folder.id} className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#8B0000] text-white font-bold text-[10px] uppercase">
                            {folder.categoryName}
                          </span>
                          <span className="font-mono text-amber-300 font-bold">
                            {folder.itemCount} {folder.itemCount === 1 ? 'Photo' : 'Photos'} Synced
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Last Synced: {folder.lastSyncedAt || 'Just now'}
                          </span>
                        </div>
                        <a
                          href={folder.folderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline font-mono truncate flex items-center gap-1 max-w-md"
                        >
                          <span className="truncate">{folder.folderUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          disabled={folderSyncing}
                          onClick={() => handleReSyncFolder(folder)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Refresh Folder Photos from Google Drive"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${folderSyncing ? 'animate-spin' : ''}`} />
                          <span>Sync / Refresh Folder</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSyncedFolder(folder.folderId)}
                          className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg"
                          title="Remove Synced Folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DIRECT FILE UPLOAD CLICKABLE DROPZONE WITH CATEGORY SELECTION */}
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
            <h4 className="font-serif text-xl font-bold">Direct Photo Upload Manager</h4>
            <p className="text-xs text-stone-400 mt-1">Select your category below and choose multiple photos to upload at once</p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">Select Upload Category:</label>
                <select
                  value={directUploadCategory}
                  onChange={(e) => setDirectUploadCategory(e.target.value)}
                  className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-bold text-white focus:border-[#8B0000] focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Select Photos From Computer</span>
              </button>
            </div>
          </div>

          {/* Single Photo Upload via Image URL */}
          <form onSubmit={handleAddSinglePhoto} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Photo via Web URL
              </h3>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={applyWatermarkOnUpload}
                  onChange={(e) => setApplyWatermarkOnUpload(e.target.checked)}
                  className="accent-[#8B0000] rounded"
                />
                <span>Apply Watermark on Upload</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Royal Reception at Pune Palace"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Category *</label>
                <select
                  value={newPhoto.categoryName}
                  onChange={(e) => setNewPhoto({ ...newPhoto, categoryName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newPhoto.image}
                  onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={newPhoto.location}
                  onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Google SEO Alt Text</label>
                <input
                  type="text"
                  placeholder="Descriptive image text for Google"
                  value={newPhoto.altText}
                  onChange={(e) => setNewPhoto({ ...newPhoto, altText: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-300 uppercase">Short Description</label>
                <textarea
                  rows="2"
                  placeholder="Description of the shoot, venue, or rituals..."
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                />
              </div>
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
              Upload & Publish Photo
            </button>
          </form>

          {/* Media Grid Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">Category Media ({filteredPortfolio.length})</h3>
              <input
                type="text"
                placeholder="Search category media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white w-48"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPortfolio.map((item, idx) => (
                <div key={item.id} className="bg-[#1C1C1C] rounded-2xl border border-stone-800 p-4 space-y-3 flex flex-col justify-between shadow-lg">
                  
                  <div className="flex gap-4 items-start">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0">
                      <img
                        src={appendCacheBuster(item.image || item.image_url)}
                        alt={item.title || 'Portfolio Image'}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-cover"
                      />
                      {item.hidden && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-red-400">
                          HIDDEN
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-bold text-white truncate">{item.title}</h4>
                        
                        {/* Reorder Buttons */}
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleReorderPhoto(item.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderPhoto(item.id, 'down')}
                            disabled={idx === filteredPortfolio.length - 1}
                            className="p-1 rounded bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2">{item.description || 'No description'}</p>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        {/* Move Category */}
                        <select
                          value={item.category}
                          onChange={(e) => handleMoveCategory(item.id, e.target.value)}
                          className="bg-stone-900 border border-stone-700 text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>

                        {/* Replace Image Link */}
                        <button
                          type="button"
                          onClick={() => handleReplaceImage(item.id)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                        >
                          <RefreshCw className="w-3 h-3" /> Replace URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Featured Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          item.featured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-900 text-stone-400'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${item.featured ? 'fill-amber-300' : ''}`} />
                        <span>{item.featured ? 'Featured' : 'Standard'}</span>
                      </button>

                      {/* Hide/Unhide Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleHidePhoto(item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          item.hidden ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{item.hidden ? 'Hidden' : 'Visible'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingPhoto(item)}
                        className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleUpdatePhoto} className="bg-[#1C1C1C] rounded-3xl p-6 max-w-lg w-full border border-stone-800 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold">Edit Photo Details</h3>
              <button type="button" onClick={() => setEditingPhoto(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingPhoto.image}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Google SEO Alt Text</label>
                <input
                  type="text"
                  value={editingPhoto.altText || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, altText: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Description</label>
                <textarea
                  rows="3"
                  value={editingPhoto.description || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
              Save Photo Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: DYNAMIC CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateCategory} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> Create New Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Baby Shoot, Maternity, Haldi)"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
              />
              <input
                type="url"
                placeholder="Cover Image URL"
                value={newCat.coverImage}
                onChange={(e) => setNewCat({ ...newCat, coverImage: e.target.value })}
                className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs font-mono text-white"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
              Create Category
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold">Active Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#1C1C1C] rounded-2xl border border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">{cat.name}</h4>
                    <span className="text-[10px] text-stone-400 font-mono">/{cat.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleHideCategory(cat.id)}
                      className={`p-2 rounded-xl text-xs ${cat.hidden ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}
                    >
                      {cat.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 text-red-400 hover:bg-red-950 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WATERMARK RULES */}
      {activeTab === 'watermark' && (
        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4">
          <h3 className="font-serif text-xl font-bold">Admin Watermark Rules</h3>
          <input
            type="text"
            value={watermark.text}
            onChange={(e) => { setWatermark({ ...watermark, text: e.target.value }); triggerNotice(); }}
            className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-xs"
          />
        </div>
      )}

    </div>
  );
}
