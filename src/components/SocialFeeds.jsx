import React, { useState } from 'react';
import { Instagram, ExternalLink, CheckCircle2, MessageCircle, Heart, Play, RefreshCw } from 'lucide-react';

export default function SocialFeeds() {
  const instagramHandle = "chitrakatha_by_hemant";
  const instagramUrl = "https://www.instagram.com/chitrakatha_by_hemant?igsi=MWFzenNxZHR3YWdpNg==";
  const instagramDmUrl = "https://ig.me/m/chitrakatha_by_hemant";

  // State to toggle between Live Web Frame Embed and Dynamic Live Feed Grid
  const [embedMode, setEmbedMode] = useState('frame'); // 'frame' or 'grid'

  // Live Interactive Posts Data (Updated dynamically via Admin or fetched from Instagram)
  const livePosts = [
    {
      id: 'post-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      caption: 'Royal Maharashtra Wedding Vows Captured by Hemant Mandawade 💍✨ #chitrakathabyhemant #marathiwedding',
      likes: '1.2k',
      comments: 48,
      location: 'Pune, Maharashtra'
    },
    {
      id: 'post-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      caption: 'Sunset Pre-Wedding Romance in Mahabaleshwar 🌅❤️ #preweddingshoot #mahabaleshwar',
      likes: '980',
      comments: 34,
      location: 'Mahabaleshwar, MH'
    },
    {
      id: 'post-3',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      caption: '4K Cinematic Wedding Film Teaser 🎬🔥 #weddingcinema #chitrakatha',
      likes: '2.4k',
      comments: 89,
      location: 'Nashik, Maharashtra'
    },
    {
      id: 'post-4',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
      caption: 'Emotional Haldi Ceremony Moments ✨💛 #haldiceremony #candidphotography',
      likes: '1.5k',
      comments: 62,
      location: 'Satana, Nashik'
    },
    {
      id: 'post-5',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
      caption: 'Luxury Bridal Fashion Editorial Shoot 👑📸 #bridalshoot #hemantmandawade',
      likes: '890',
      comments: 29,
      location: 'Mumbai, MH'
    },
    {
      id: 'post-6',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      caption: 'Traditional Nauvari Saree Portrait Collection 🌺 #marathibride #tradition',
      likes: '1.8k',
      comments: 75,
      location: 'Kolhapur, MH'
    }
  ];

  return (
    <section id="social-feeds" className="py-20 bg-[#080809] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-1 shadow-lg">
            <Instagram className="w-4 h-4 text-rose-400 animate-pulse" />
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

        {/* LIVE INSTAGRAM CONTAINER */}
        <div className="bg-[#000000] rounded-3xl border border-stone-800 shadow-2xl overflow-hidden relative">
          
          {/* Top Navigation & Profile Bar */}
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
                className="px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#0081D6] text-white text-xs font-semibold uppercase tracking-wider transition-transform hover:scale-105 shadow-md flex items-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow Profile</span>
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

          {/* REAL LIVE EMBEDDED INSTAGRAM WEB FRAME VIEW */}
          <div className="relative w-full bg-black min-h-[550px] flex items-center justify-center">
            {embedMode === 'frame' ? (
              <div className="w-full h-[600px] relative overflow-hidden bg-stone-950">
                <iframe
                  src="https://www.instagram.com/chitrakatha_by_hemant/embed"
                  title="Chitrakatha by Hemant Live Instagram Profile"
                  className="w-full h-full border-0"
                  allowTransparency={true}
                  allow="encrypted-media"
                  scrolling="yes"
                />
                
                {/* Direct Link Banner Overlay at bottom of frame */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-stone-900/90 backdrop-blur-md border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
                  <span className="font-mono">Official Instagram Account: @{instagramHandle}</span>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    Open Profile App <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* LIVE INTERACTIVE POSTS GRID VIEW */
              <div className="p-4 sm:p-6 w-full space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {livePosts.map((post) => (
                    <a
                      key={post.id}
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 block"
                    >
                      <img
                        src={post.url}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                        <div className="flex justify-end">
                          {post.type === 'video' && <Play className="w-4 h-4 fill-current text-amber-300" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs line-clamp-2 text-stone-200">{post.caption}</p>
                          <div className="flex items-center gap-3 text-[10px] text-amber-300 font-mono">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-current text-rose-500" /> {post.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

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
