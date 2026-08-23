import React from 'react';
import { ShieldCheck, Sliders, Eye, Sparkles } from 'lucide-react';

export default function WatermarkSystem({ watermark, setWatermark, t }) {
  const positions = [
    { id: 'bottom-right', label: 'Bottom Right' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'center', label: 'Center' },
    { id: 'top-right', label: 'Top Right' }
  ];

  const getWatermarkPosClass = (pos) => {
    switch (pos) {
      case 'bottom-left': return 'bottom-6 left-6 text-left';
      case 'top-right': return 'top-6 right-6 text-right';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
      default: return 'bottom-6 right-6 text-right';
    }
  };

  return (
    <section className="py-20 bg-[#F4EFE6] border-y border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-sans tracking-[0.25em] text-[#8B0000] uppercase font-bold">CLIENT PRIVACY & PROTECTION</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C] mt-2 mb-2">
            {t.watermarkEngine.title}
          </h2>
          <p className="text-sm text-[#66625C] font-light">
            {t.watermarkEngine.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E1DA] shadow-lg">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6E1DA]">
              <div>
                <span className="text-xs font-bold text-[#1C1C1C] block">{t.watermarkEngine.toggle}</span>
                <span className="text-[11px] text-[#66625C]">Overlay copyright on portfolio preview</span>
              </div>
              <button
                onClick={() => setWatermark({ ...watermark, enabled: !watermark.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  watermark.enabled ? 'bg-[#8B0000]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    watermark.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Custom Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider block">
                Watermark Signature Text
              </label>
              <input
                type="text"
                value={watermark.text}
                onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E1DA] text-xs font-medium text-[#1C1C1C] focus:outline-none focus:border-[#8B0000]"
                placeholder="e.g. Chitrakatha by Hemant"
              />
            </div>

            {/* Position Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider block">
                {t.watermarkEngine.position}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setWatermark({ ...watermark, position: pos.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      watermark.position === pos.id
                        ? 'bg-[#8B0000] text-white shadow'
                        : 'bg-[#FAF7F2] text-[#1C1C1C] hover:bg-[#EFECE6] border border-[#E6E1DA]'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#1C1C1C]">
                <span>{t.watermarkEngine.opacity}</span>
                <span>{Math.round(watermark.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={watermark.opacity}
                onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })}
                className="w-full accent-[#8B0000]"
              />
            </div>

          </div>

          {/* Live Preview Display Column */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E6E1DA] aspect-video bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200"
                alt="Watermark Live Preview"
                className="w-full h-full object-cover"
              />

              {/* Watermark Overlay */}
              {watermark.enabled && (
                <div
                  className={`absolute pointer-events-none watermark-overlay z-20 transition-all duration-300 ${getWatermarkPosClass(watermark.position)}`}
                  style={{ opacity: watermark.opacity }}
                >
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-serif text-xs sm:text-sm font-semibold tracking-widest text-white">
                      {watermark.text}
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 bg-black/70 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                LIVE WATERMARK ENGINE PREVIEW
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
