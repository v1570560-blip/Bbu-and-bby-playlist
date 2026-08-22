import React, { useState, useEffect } from 'react';
import { Heart, Music, Sparkles, Menu, X, Play, Pause } from 'lucide-react';
import { Song } from '../types';

interface FloatingNavbarProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPlaylist: () => void;
}

export function FloatingNavbar({
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenPlaylist,
}: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="floating-navigation"
      className="fixed top-4 sm:top-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="w-full max-w-4xl flex items-center justify-between pointer-events-auto">
        {/* Left Brand Badge */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full glass-card border border-rose-200/80 shadow-lg hover:scale-105 transition-all text-[#2c1810] cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="font-heading font-bold text-xs sm:text-sm tracking-tight">
            Bbu & Bby
          </span>
        </button>

        {/* Center Desktop Navigation Pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full glass-card border border-rose-200/80 shadow-lg text-xs font-semibold text-[#2c1810]">
          <button
            onClick={() => scrollToSection('hero')}
            className="px-4 py-1.5 rounded-full hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-rose-300">•</span>
          <button
            onClick={() => scrollToSection('songs')}
            className="px-4 py-1.5 rounded-full hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5 text-rose-600" />
            <span>Songs</span>
          </button>
          <span className="text-rose-300">•</span>
          <button
            onClick={() => scrollToSection('notes')}
            className="px-4 py-1.5 rounded-full hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Love Notes</span>
          </button>
        </div>

        {/* Right Floating Mini-Player Pill */}
        <div className="flex items-center gap-2">
          {/* Mini Playing Chip visible when scrolled or active */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-rose-200/80 shadow-lg">
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={onOpenPlaylist}
              className="text-left hidden sm:block max-w-[130px] truncate cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="text-[11px] font-semibold text-[#2c1810] truncate">
                {currentSong.title}
              </p>
              <p className="text-[9px] text-rose-600 truncate font-mono">
                ♫ Song List (24)
              </p>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-full glass-card border border-rose-200/80 text-[#2c1810] shadow-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 inset-x-4 max-w-sm mx-auto glass-card rounded-3xl p-5 border border-rose-200 shadow-2xl space-y-3 md:hidden pointer-events-auto animate-fadeIn">
          <div className="text-center pb-2 border-b border-rose-100">
            <p className="font-heading font-bold text-sm text-[#2c1810]">
              Love song of Bbu and bby ♡
            </p>
            <p className="text-xs text-rose-600 font-romantic italic">
              "Every song has a memory. Every memory has us."
            </p>
          </div>

          <div className="flex flex-col space-y-1 text-sm font-semibold text-[#2c1810]">
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full text-left py-2.5 px-4 rounded-xl hover:bg-rose-100 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('songs')}
              className="w-full text-left py-2.5 px-4 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-600" />
                <span>Songs (24 Tracks)</span>
              </span>
              <span className="text-xs text-rose-500 font-normal">Explore</span>
            </button>
            <button
              onClick={() => scrollToSection('notes')}
              className="w-full text-left py-2.5 px-4 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Love Notes 💌</span>
              </span>
              <span className="text-xs text-rose-500 font-normal">Leave a note</span>
            </button>
          </div>

          <div className="pt-2 border-t border-rose-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlaylist();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-500/30"
            >
              <Music className="w-3.5 h-3.5" />
              <span>♫ Open Song List Drawer</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
