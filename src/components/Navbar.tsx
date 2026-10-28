import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { usePortfolioStore } from '../lib/store';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export function Navbar({ onOpenAdmin }: NavbarProps) {
  const { state } = usePortfolioStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Brands', href: '#clients' },
    { label: 'Case Studies', href: '#projects' },
    { label: 'Process', href: '#process' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#09090B]/85 backdrop-blur-md border-b border-[#27272A]/80 shadow-2xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo / Monogram */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm tracking-wider text-white shadow-lg transition-transform group-hover:scale-105"
                 style={{ backgroundColor: 'var(--theme-primary)' }}>
              S
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                {state.profile.name}
                <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
              </span>
              <span className="text-[10px] tracking-widest text-[#9E9EA7] uppercase font-mono block">
                {state.profile.title}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-[#A1A1AA]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: 'var(--theme-primary)' }} />
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Direct Contact Button */}
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all duration-200 shadow-md hover:brightness-110 active:scale-95"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#27272A] bg-[#121216] text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#09090B]/95 backdrop-blur-xl border-b border-[#27272A] px-5 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium uppercase tracking-wider text-[#A1A1AA]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#27272A]">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-xs font-semibold text-center uppercase tracking-wider text-white block"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

