import React from 'react';
import { Play, Pause, Music, Heart, Volume2, Sparkles, ChevronDown } from 'lucide-react';
import { Song } from '../types';
import heroImage from '../assets/images/couple_hero_bg_1787414543366.jpg';

interface HeroSectionProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPlaylist: () => void;
  onScrollToSongs: () => void;
  onScrollToNotes: () => void;
}

export function HeroSection({
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenPlaylist,
  onScrollToSongs,
  onScrollToNotes,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] h-[100dvh] flex flex-col items-center justify-between overflow-hidden text-white select-none"
    >
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Bbu and bby Romantic Couple Portrait"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_28%] sm:object-[center_22%] filter brightness-[0.88] contrast-[1.04] scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Soft anime cinematic vignette & gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#200e0a]/90 via-[#2c1810]/40 to-[#190d09]/75 backdrop-contrast-105" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-rose-950/20 to-black/60 pointer-events-none" />
      </div>

      {/* Top Floating Badge */}
      <header className="relative z-20 pt-8 sm:pt-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-rose-200/30 text-rose-100 text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-black/20 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Our Private Memory Book</span>
          <span className="text-rose-300 font-semibold">•</span>
          <span className="text-rose-200">Forever & Always</span>
        </div>
      </header>

      {/* Main Hero Centerpiece */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-3xl my-auto">
        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          Bbu and bby
        </h1>

        {/* Sub-heading */}
        <p className="font-romantic text-2xl sm:text-3xl md:text-4xl text-rose-200 mt-2 sm:mt-3 font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          Love song of Bbu and bby ♡
        </p>

        {/* Romantic Subtitle Quote */}
        <div className="mt-4 sm:mt-6 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/10 max-w-xl">
          <p className="font-romantic italic text-lg sm:text-xl text-rose-100/95 leading-relaxed tracking-wide">
            “Every song has a memory. Every memory has us.”
          </p>
        </div>

        {/* Big Circular Play / Pause Button with Romantic Pulse */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring animation when active */}
            {isPlaying && (
              <>
                <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '2.5s' }} />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500/40 via-pink-400/40 to-rose-600/40 animate-spin opacity-80 pointer-events-none" style={{ animationDuration: '8s' }} />
              </>
            )}

            <button
              id="hero-play-button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause love song' : 'Play love song'}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:shadow-[0_0_50px_rgba(244,63,94,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border-2 border-white/40"
            >
              {isPlaying ? (
                <Pause className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-white transition-transform group-hover:scale-110" />
              ) : (
                <Play className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-white ml-1 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>

          {/* Currently loaded track banner */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-rose-300/30 max-w-sm sm:max-w-md">
            <div className="flex items-center gap-1">
              <span className={`w-1 h-3.5 rounded-full bg-rose-400 ${isPlaying ? 'animate-bounce' : ''}`} style={{ animationDelay: '0ms' }} />
              <span className={`w-1 h-5 rounded-full bg-rose-300 ${isPlaying ? 'animate-bounce' : ''}`} style={{ animationDelay: '150ms' }} />
              <span className={`w-1 h-3 rounded-full bg-rose-400 ${isPlaying ? 'animate-bounce' : ''}`} style={{ animationDelay: '300ms' }} />
            </div>
            <div className="text-left truncate">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-[11px] text-rose-200/80 truncate">
                {currentSong.artist} • {currentSong.movieOrAlbum}
              </p>
            </div>
            <button
              id="hero-open-playlist-btn"
              onClick={onOpenPlaylist}
              className="ml-auto text-xs px-2.5 py-1 rounded-full bg-rose-500/40 hover:bg-rose-500/70 text-rose-100 hover:text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Music className="w-3 h-3" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-goto-songs-btn"
            onClick={onScrollToSongs}
            className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Music className="w-4 h-4 text-rose-300" />
            <span>Soundtrack</span>
          </button>
          <button
            id="hero-goto-notes-btn"
            onClick={onScrollToNotes}
            className="px-5 py-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 backdrop-blur-md border border-rose-400/40 text-white text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
            <span>Love Notes 💌</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <footer className="relative z-20 pb-6 sm:pb-8 flex flex-col items-center text-center">
        <button
          onClick={onScrollToSongs}
          aria-label="Scroll to music section"
          className="flex flex-col items-center text-rose-200/80 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-xs font-light tracking-widest uppercase mb-1">Explore Memories</span>
          <ChevronDown className="w-5 h-5 text-rose-300 animate-bounce group-hover:text-white transition-colors" />
        </button>
      </footer>
    </section>
  );
}
