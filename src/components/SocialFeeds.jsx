import React from 'react';
import { Instagram, ExternalLink, CheckCircle2, MessageCircle } from 'lucide-react';

export default function SocialFeeds() {
  const instagramHandle = "chitrakatha_by_hemant";
  const instagramUrl = "https://instagram.com/chitrakatha_by_hemant";
  const instagramDmUrl = "https://ig.me/m/chitrakatha_by_hemant";

  // Prepend Vite BASE_URL so image paths work on both local dev server and GitHub Pages subpath (/chitrkatha-by-hemant/)
  const baseUrl = import.meta.env.BASE_URL || '/';
  const headerImgSrc = `${baseUrl}assets/insta_header_cropped.png`.replace(/\/+/g, '/');
  const feedImgSrc = `${baseUrl}assets/hemant_instagram_feed.png`.replace(/\/+/g, '/');

  return (
    <section id="social-feeds" className="py-20 bg-[#080809] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-1 shadow-lg">
            <Instagram className="w-4 h-4 text-rose-400" />
            <span>Official Live Instagram Feed</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Follow Us On Instagram
          </h2>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-mono text-sm inline-flex items-center gap-1.5 transition-colors pt-1"
          >
            <span>@{instagramHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* SINGLE AUTHENTIC INSTAGRAM ACCOUNT CONTAINER */}
        <div className="bg-[#000000] rounded-3xl border border-stone-800 shadow-2xl overflow-hidden relative group">
          
          {/* Top Bar Navigation */}
          <div className="p-4 bg-[#121212] border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs font-bold font-serif text-amber-400">
                  C
                </div>
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white flex items-center gap-1.5">
                  <span>{instagramHandle}</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
                </h4>
                <span className="text-xs text-stone-400 font-mono">10.2K Followers • 365 Posts</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#0081D6] text-white text-xs font-semibold uppercase tracking-wider transition-transform hover:scale-105 shadow-md"
              >
                Follow Profile
              </a>
              <a
                href={instagramDmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-stone-700"
              >
                <MessageCircle className="w-4 h-4 text-rose-400" />
                <span>Message</span>
              </a>
            </div>
          </div>

          {/* SINGLE INSTAGRAM PROFILE CONTENT VIEW */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative cursor-pointer group/feed"
          >
            {/* Profile Header Image */}
            <img
              src={headerImgSrc}
              alt="Hemant Mandawade Official Instagram Profile Header chitrakatha_by_hemant"
              className="w-full h-auto object-cover border-b border-stone-800"
            />

            {/* Profile Posts Feed Image */}
            <img
              src={feedImgSrc}
              alt="Chitrakatha by Hemant Official Instagram Photos and Reels"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover/feed:scale-[1.002]"
            />

            {/* Hover Overlay with Action Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/feed:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-2xl inline-flex items-center gap-2 transform group-hover/feed:scale-105 transition-transform">
                <Instagram className="w-4 h-4" />
                <span>Open @{instagramHandle} on Instagram</span>
              </span>
            </div>
          </a>

        </div>

        {/* Bottom Actions */}
        <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white text-xs font-semibold uppercase tracking-wider shadow-2xl inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Instagram className="w-4 h-4" />
            <span>Visit Official Live Instagram (@{instagramHandle})</span>
          </a>

          <a
            href={instagramDmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold uppercase tracking-wider border border-stone-700 inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-rose-400" />
            <span>Send Direct Instagram Message</span>
          </a>
        </div>

      </div>
    </section>
  );
}
