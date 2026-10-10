import React, { useState } from 'react';
import { NavPage } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Menu, X, PenTool } from 'lucide-react';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenWarmup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenWarmup }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavPage; label: string }[] = [
    { id: 'home', label: 'Studio Home' },
    { id: 'isometrics', label: 'Isometric Practice' },
    { id: 'lessons', label: 'Architectural Lessons' },
    { id: 'studio', label: 'Drawing Studio' },
    { id: 'progress', label: 'Sketchbook & Progress' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0e0f13]/85 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#f5f0ea] group-hover:text-white transition-colors">
            PIXELBEN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e24a4a] shadow-[0_0_8px_#e24a4a]" />
        </button>

        {/* Zone 2: 4–6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs font-medium tracking-wide uppercase transition-colors relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-[#f5f0ea] font-semibold'
                    : 'text-[#9ea4b0] hover:text-[#f5f0ea]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e24a4a] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3">
          <AudioPlayer />

          {onOpenWarmup && (
            <button
              onClick={onOpenWarmup}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0d0e11] bg-[#f5f0ea] hover:bg-white hover:shadow-[0_0_15px_rgba(245,240,234,0.3)] transition-all whitespace-nowrap"
            >
              <PenTool className="w-3.5 h-3.5 text-[#e24a4a]" />
              <span>Daily Warm-up</span>
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#9ea4b0] hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#121319]/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === link.id
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[#9ea4b0] hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          {onOpenWarmup && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWarmup();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0d0e11] bg-[#f5f0ea]"
            >
              <PenTool className="w-4 h-4 text-[#e24a4a]" />
              <span>Launch 5-Min Warm-up</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
