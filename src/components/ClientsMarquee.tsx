import React, { useState } from 'react';
import { LayoutGrid, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import { usePortfolioStore } from '../lib/store';

export function ClientsMarquee() {
  const { state } = usePortfolioStore();
  const { clients, settings } = state;
  const primaryColor = settings.customColors.primary;
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');

  // Split clients into two rows for the dual marquee
  const row1 = clients.slice(0, 10);
  const row2 = clients.slice(10, 20);

  return (
    <section id="clients" className="py-20 relative overflow-hidden border-y border-[#27272A]/80 bg-[#0C0C0F]">
      {/* Background radial gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] blur-[150px] opacity-10 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#9E9EA7] border border-[#27272A] bg-[#121216] mb-3">
              <Building2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Proven Brand Portfolio</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
              20 Brands Managed & Scaled
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl">
              From hospitality and luxury dining to FMCG, healthcare, and corporate enterprises across South India.
            </p>
          </div>

          {/* Toggle between Marquee and Grid */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#121216] border border-[#27272A] self-start sm:self-auto">
            <button
              onClick={() => setViewMode('marquee')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'marquee'
                  ? 'bg-[#18181F] text-white shadow'
                  : 'text-[#9E9EA7] hover:text-white'
              }`}
            >
              Continuous Stream
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#18181F] text-white shadow'
                  : 'text-[#9E9EA7] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Grid</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'marquee' ? (
        <div className="space-y-6">
          {/* Row 1: Leftward Scrolling */}
          <div className="relative overflow-hidden whitespace-nowrap py-2 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="animate-marquee flex items-center gap-5">
              {[...row1, ...row1, ...row1].map((client, idx) => (
                <div
                  key={`r1-${client.id}-${idx}`}
                  className="w-56 h-28 rounded-2xl bg-[#14141A] border border-[#27272A] hover:border-[#3F3F46] p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 group relative flex-shrink-0 cursor-default shadow-sm"
                >
                  <div className="w-full h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white/95 p-2">
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#A1A1AA] mt-2 tracking-wider truncate w-full text-center">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Rightward Scrolling (Reverse) */}
          <div className="relative overflow-hidden whitespace-nowrap py-2 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div
              className="flex items-center gap-5"
              style={{
                width: 'max-content',
                animation: 'marquee 38s linear infinite reverse'
              }}
            >
              {[...row2, ...row2, ...row2].map((client, idx) => (
                <div
                  key={`r2-${client.id}-${idx}`}
                  className="w-56 h-28 rounded-2xl bg-[#14141A] border border-[#27272A] hover:border-[#3F3F46] p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 group relative flex-shrink-0 cursor-default shadow-sm"
                >
                  <div className="w-full h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white/95 p-2">
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#A1A1AA] mt-2 tracking-wider truncate w-full text-center">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Full 20-Brand Grid View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl bg-[#14141A] border border-[#27272A] hover:border-[#3F3F46] p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 group shadow-sm"
              >
                <div className="w-full h-20 flex items-center justify-center overflow-hidden rounded-xl bg-white/95 p-2 mb-2.5">
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-bold text-white text-center truncate w-full">
                  {client.name}
                </p>
                <span className="text-[10px] font-mono text-[#9E9EA7] tracking-wider truncate w-full text-center">
                  {client.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

