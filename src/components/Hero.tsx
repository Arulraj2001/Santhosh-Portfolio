import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, MapPin, Mail, Phone, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '../lib/store';

export function Hero() {
  const { state } = usePortfolioStore();
  const { profile, metrics, settings } = state;
  const primaryColor = settings.customColors.primary;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Massive Condensed Background Headline ("PORTFOLIO") as in reference */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
        <h1
          className="font-display font-black text-[18vw] sm:text-[19vw] lg:text-[18vw] leading-none uppercase tracking-tighter opacity-15"
          style={{
            color: primaryColor,
            WebkitTextStroke: '2px rgba(216, 0, 39, 0.3)'
          }}
        >
          PORTFOLIO
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bio & Identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 xl:col-span-4 space-y-5 text-left"
          >
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase border border-[#27272A] bg-[#121216]/90 shadow-inner">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: primaryColor }} />
              <span className="text-[#FAFAFA] font-medium">{profile.availableStatus}</span>
            </div>

            {/* Intro Header */}
            <div>
              <p className="text-sm sm:text-base font-serif italic text-[#A1A1AA] tracking-wide mb-1">
                Hello, I'm
              </p>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none">
                {profile.name}
              </h1>
              <h2
                className="text-lg sm:text-xl font-bold tracking-tight uppercase mt-2.5"
                style={{ color: primaryColor }}
              >
                {profile.title}
              </h2>
            </div>

            {/* Tagline / Professional Summary */}
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-lg">
              {profile.tagline}
            </p>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#9E9EA7] font-mono">
              <div className="flex items-center gap-1.5 bg-[#121216] px-3 py-1 rounded-md border border-[#27272A]">
                <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{profile.location}</span>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 bg-[#121216] px-3 py-1 rounded-md border border-[#27272A] hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{profile.email}</span>
              </a>
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-1.5 bg-[#121216] px-3 py-1 rounded-md border border-[#27272A] hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{profile.phone}</span>
              </a>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-xl flex items-center gap-2 transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <span>View Selected Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider text-[#FAFAFA] border border-[#27272A] bg-[#121216]/80 hover:bg-[#18181F] hover:border-[#3F3F46] transition-all"
              >
                <span>Work Together</span>
              </a>
            </div>
          </motion.div>

          {/* Center Column: Freestanding 3D Portrait (Prominent Hero Scale) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-5 relative flex items-end justify-center my-4 lg:my-0 self-end"
          >
            {/* Ambient Backlight Glow behind Santhosh */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full opacity-35 blur-[100px] pointer-events-none transition-all duration-700"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Freestanding Portrait with subtle 3D Parallax */}
            <div
              className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px] flex items-end justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`
              }}
            >
              <img
                src={
                  !profile.avatarUrl ||
                  profile.avatarUrl === '/assets/santhosh.jpg' ||
                  profile.avatarUrl === '/assets/santhosh-seamless.png'
                    ? '/assets/santhosh1.png'
                    : profile.avatarUrl
                }
                alt={profile.name}
                className="w-full h-auto max-h-[660px] lg:max-h-[720px] object-contain object-bottom select-none [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] transform scale-110 lg:scale-115 origin-bottom"
              />
            </div>
          </motion.div>

          {/* Right Column: Key Metrics Stack as in Reference */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 space-y-3.5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#9E9EA7]">
                Proven Impact
              </p>
            </div>

            {metrics.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-[#121216]/90 border border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display font-black text-3xl sm:text-4xl tracking-tight transition-transform group-hover:scale-105"
                    style={{ color: primaryColor }}
                  >
                    {m.value}
                  </span>
                  <span className="text-[10px] font-mono text-[#9E9EA7] uppercase">
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-white mt-1">
                  {m.label}
                </p>
                {m.sublabel && (
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">
                    {m.sublabel}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <a href="#clients" className="p-2 rounded-full border border-[#27272A] bg-[#121216] text-[#A1A1AA] hover:text-white transition-colors">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

