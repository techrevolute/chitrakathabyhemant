import React, { useState } from 'react';
import { Database, Download, RefreshCw, HardDrive, Check } from 'lucide-react';

export default function AdminBackupActivity() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadBackup = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6 text-white max-w-4xl">
      
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Backup & System Storage</h2>
          <p className="text-xs text-stone-400">Download database backups, media archives, and restore settings</p>
        </div>

        {downloaded && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> Backup Downloaded
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold">Database Backup</h3>
          <p className="text-xs text-stone-400 font-light">Export all client booking requests, pricing packages, FAQs, and translation dictionaries to a JSON file.</p>
          <button
            onClick={handleDownloadBackup}
            className="w-full py-3 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Backup</span>
          </button>
        </div>

        <div className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit">
            <HardDrive className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold">Storage Usage</h3>
          <p className="text-xs text-stone-400 font-light">0 MB of 5.0 GB total storage used across high-res portfolio images and 4K video clips.</p>
          <div className="w-full bg-stone-800 rounded-full h-2.5">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '0%' }} />
          </div>
          <span className="text-[10px] text-stone-400 block text-right">0% Used • 5.0 GB Free</span>
        </div>

      </div>

    </div>
  );
}
