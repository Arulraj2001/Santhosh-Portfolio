import React from 'react';
import { Search, Lightbulb, PenTool, Sliders, TrendingUp, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../lib/store';

export function WorkProcess() {
  const { state } = usePortfolioStore();
  const { workProcess, settings, profile } = state;
  const primaryColor = settings.customColors.primary;

  const iconMap: Record<string, React.ReactNode> = {
    search: <Search className="w-5 h-5" />,
    lightbulb: <Lightbulb className="w-5 h-5" />,
    'pen-tool': <PenTool className="w-5 h-5" />,
    sliders: <Sliders className="w-5 h-5" />,
    'trending-up': <TrendingUp className="w-5 h-5" />
  };

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#0A0A0E] border-y border-[#27272A]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 5-Stage Stepper */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-[#9E9EA7] border border-[#27272A] bg-[#121216] mb-3">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>Strategic Execution</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
                Work Process
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-2 max-w-lg">
                A disciplined, data-first roadmap refined across 100+ paid advertising campaigns and 20 multi-industry brands.
              </p>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#D80027] before:via-[#27272A] before:to-transparent">
              {workProcess.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative p-5 sm:p-6 rounded-2xl bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 group shadow-sm hover:shadow-lg"
                >
                  {/* Step node indicator */}
                  <div
                    className="absolute -left-9 sm:-left-11 top-6 w-6 h-6 rounded-full border-2 border-[#09090B] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md transition-transform group-hover:scale-125"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold tracking-widest text-[#9E9EA7]">
                          {step.stepNumber}
                        </span>
                        <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div
                      className="p-2.5 rounded-xl bg-[#18181F] text-white border border-[#27272A] flex-shrink-0 group-hover:border-white transition-colors"
                      style={{ color: primaryColor }}
                    >
                      {iconMap[step.icon] || <Sparkles className="w-5 h-5" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Quote Card & Philosophy (as in Reference) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* The Signature Quote Card */}
            <div
              className="rounded-3xl p-8 sm:p-10 relative overflow-hidden text-white shadow-2xl flex flex-col justify-between min-h-[420px]"
              style={{
                background: `linear-gradient(145deg, #7A0015 0%, #300008 60%, #121216 100%)`,
                borderColor: primaryColor
              }}
            >
              <Quote className="w-16 h-16 opacity-20 text-white mb-6" />

              <div className="space-y-6 relative z-10">
                <blockquote className="font-display font-semibold text-2xl sm:text-3xl leading-snug tracking-tight text-white/95">
                  “Data-driven marketing isn't just about spending budget — it's about engineering predictable, scalable revenue.”
                </blockquote>

                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="font-serif italic text-2xl text-white tracking-wide">
                      {profile.name}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/70 mt-1">
                      Digital Marketing Strategist
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center font-display font-black text-lg bg-black/30 backdrop-blur-md">
                    S
                  </div>
                </div>
              </div>

              {/* Decorative background glow */}
              <div
                className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: primaryColor }}
              />
            </div>

            {/* Quick Action Banner */}
            <div className="p-6 rounded-3xl bg-[#121216] border border-[#27272A] flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#9E9EA7]">Ready to scale?</p>
                <p className="text-sm font-bold text-white">Let’s optimize your ad pipeline.</p>
              </div>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow"
                style={{ backgroundColor: primaryColor }}
              >
                Inquire Now
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

