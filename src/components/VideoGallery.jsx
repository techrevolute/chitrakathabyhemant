import React, { useState } from 'react';
import { Play, Film, Clock, Eye, X } from 'lucide-react';

function renderUniversalVideoPlayer(videoUrl) {
  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
        No video URL provided.
      </div>
    );
  }

  const url = videoUrl.trim();

  // 1. YouTube Link (e.g. https://www.youtube.com/watch?v=XYZ or https://youtu.be/XYZ)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    const ytId = ytMatch[1];
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 2. Google Drive Video Link (e.g. https://drive.google.com/file/d/FILE_ID/view)
  let driveId = null;
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    driveId = dMatch[1];
  } else {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      driveId = idMatch[1];
    }
  }

  if (driveId && url.includes('drive.google.com')) {
    return (
      <iframe
        src={`https://drive.google.com/file/d/${driveId}/preview`}
        title="Google Drive Video Player"
        allow="autoplay"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 3. Vimeo Video Link (e.g. https://vimeo.com/12345678)
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
        title="Vimeo Video Player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }

  // 4. Native HTML5 Video (Direct MP4, WebM, Blob, or URL)
  return (
    <video
      key={url}
      src={url}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="w-full h-full object-contain"
    >
      Your browser does not support video playback.
    </video>
  );
}

export default function VideoGallery({ videos = [], t, onOpenBooking }) {
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter out hidden videos
  const visibleVideos = Array.isArray(videos)
    ? videos.filter((vid) => !vid.hidden)
    : [];

  return (
    <section id="videos" className="py-24 bg-[#F4EFE6] border-t border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">CINEMATIC FILMS</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1C1C] mt-2 mb-4">
            {t.videos.title}
          </h2>
          <p className="text-sm sm:text-base text-[#66625C] font-light">
            {t.videos.subtitle}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-[#E6E1DA] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              {/* Video Thumbnail */}
              <div className="relative h-60 overflow-hidden bg-stone-900">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Duration Badge */}
                {vid.duration && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{vid.duration}</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold uppercase tracking-widest">
                  {vid.category}
                </div>

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-[#8B0000] text-[#8B0000] group-hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-[#1C1C1C] group-hover:text-[#8B0000] transition-colors leading-snug mb-2">
                  {vid.title}
                </h3>
                <p className="text-xs text-[#66625C] font-light line-clamp-2 mb-3">
                  {vid.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[#66625C] font-light pt-2 border-t border-[#F0ECE6]">
                  <span>{vid.location}</span>
                  {vid.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {vid.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            
            {/* Header */}
            <div className="p-4 bg-stone-900 flex items-center justify-between text-white border-b border-stone-800">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">{activeVideo.category}</span>
                <h4 className="font-serif text-lg font-bold">{activeVideo.title}</h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {renderUniversalVideoPlayer(activeVideo.videoUrl)}
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-stone-900 flex items-center justify-between text-white">
              <span className="text-xs text-stone-400">Location: {activeVideo.location}</span>
              <button
                onClick={() => { setActiveVideo(null); onOpenBooking(); }}
                className="px-5 py-2 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-xs font-semibold uppercase tracking-wider"
              >
                Book Film Shoot
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
