import React from 'react';
import { Radio, ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../lib/store';

export function LiveClientsSection() {
  const { state } = usePortfolioStore();
  const { liveClients = [], settings } = state;
  const primaryColor = settings.customColors.primary;

  if (!liveClients || liveClients.length === 0) {
    return null;
  }

  return (
    <section id="live-clients" className="py-20 relative overflow-hidden bg-[#09090B]">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] blur-[160px] opacity-10 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-3 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold">Currently Working With • Live Clients</span>
            </div>
            
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
              Active Engagements & Retainers
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2 max-w-2xl leading-relaxed">
              High-growth brands actively scaling performance marketing pipelines, lead funnels, and algorithmic organic reach under Santhosh's management right now.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#9E9EA7] bg-[#121216] px-4 py-2 rounded-full border border-[#27272A]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{liveClients.length} Live Partnerships Active</span>
          </div>
        </div>

        {/* Live Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClients.map((client, idx) => (
            <motion.div
              key={client.id || `live-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 group shadow-lg flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              />

              <div>
                {/* Header row: Logo badge + Active status */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  {/* Circular Illuminated Logo Badge */}
                  <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-b from-white/20 via-[#27272A] to-transparent shadow group-hover:from-[var(--theme-primary)] group-hover:to-white/20 transition-all duration-500 flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-2 shadow-inner">
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Live Status Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{client.status || 'Active Retainer'}</span>
                  </div>
                </div>

                {/* Brand Name & Category */}
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white group-hover:text-primary transition-colors tracking-tight">
                    {client.name}
                  </h3>
                  <p className="text-xs font-mono text-[#9E9EA7] tracking-wider uppercase mt-0.5">
                    {client.category}
                  </p>
                </div>

                {/* Scope & Deliverables */}
                {client.deliverables && (
                  <p className="text-xs text-[#A1A1AA] leading-relaxed mt-3.5 bg-[#18181F]/70 p-3 rounded-2xl border border-[#27272A]/70">
                    {client.deliverables}
                  </p>
                )}
              </div>

              {/* Bottom Footer: Metric Chip */}
              <div className="mt-5 pt-4 border-t border-[#27272A]/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  Target Outcome
                </span>
                {client.impactMetric ? (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-black border tracking-wider"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      backgroundColor: `${primaryColor}15`
                    }}
                  >
                    {client.impactMetric}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Scaling Now</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

