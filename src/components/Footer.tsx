import React from 'react';
import { ArrowUp, Lock, Linkedin, Instagram, Youtube, MessageCircle, Mail } from 'lucide-react';
import { usePortfolioStore } from '../lib/store';

interface FooterProps {
  onOpenAdmin: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const { state } = usePortfolioStore();
  const { profile, settings } = state;
  const primaryColor = settings.customColors.primary;

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Multi-target scroll ensuring compatibility with all browsers
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkedinUrl =
    profile.socialLinks?.linkedin && profile.socialLinks.linkedin.trim() !== ''
      ? profile.socialLinks.linkedin
      : 'https://www.linkedin.com';

  const instagramUrl =
    profile.socialLinks?.instagram && profile.socialLinks.instagram.trim() !== ''
      ? profile.socialLinks.instagram
      : 'https://www.instagram.com';

  const youtubeUrl =
    profile.socialLinks?.youtube && profile.socialLinks.youtube.trim() !== ''
      ? profile.socialLinks.youtube
      : 'https://www.youtube.com';

  const getWhatsAppUrl = () => {
    const raw = (profile.socialLinks?.whatsapp || profile.phone || '9597193371').trim();
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    const cleanDigits = raw.replace(/[^0-9]/g, '');
    const phone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    return `https://wa.me/${phone || '919597193371'}`;
  };

  return (
    <footer className="relative z-30 py-12 bg-[#08080A] border-t border-[#27272A]/70 text-[#9E9EA7] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#27272A]/60">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs text-white shadow-md flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              S
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">
                {profile.name}
              </p>
              <p className="text-[11px] text-[#A1A1AA]">
                {profile.title} • {profile.location}
              </p>
            </div>
          </div>

          {/* Working Social Media Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
              <span>LinkedIn</span>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Instagram Profile"
            >
              <Instagram className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
              <span>Instagram</span>
            </a>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="YouTube Channel"
            >
              <Youtube className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
              <span>YouTube</span>
            </a>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121216] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:scale-105"
              title="Send Direct Email"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
              <span>Email</span>
            </a>
          </div>

          {/* Action: Working Back to Top Arrow */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="p-3 rounded-full border border-[#27272A] bg-[#121216] hover:bg-[#18181F] text-white hover:border-white transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer relative z-30 flex items-center justify-center"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Bottom copyright line with discreet subtle Admin trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
            {/* Discreet Admin Lock - hidden in plain sight for the portfolio owner */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="opacity-20 hover:opacity-100 transition-opacity p-1 text-[#71717A] hover:text-white rounded cursor-pointer"
              title="Admin CMS Access (or press Ctrl+Shift+A or type #admin)"
              aria-label="Admin Access"
            >
              <Lock className="w-3 h-3 pointer-events-none" />
            </button>
          </div>
          <p className="text-[#71717A]">
            Digital Marketing & Performance Ad Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
