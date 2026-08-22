import React from 'react';
import { Heart, Sparkles, ArrowUp, Music } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-[#24130d] text-rose-100 overflow-hidden select-none">
      {/* Decorative top border line */}
      <div className="max-w-4xl mx-auto border-t border-rose-800/40 mb-12 flex items-center justify-center">
        <div className="bg-[#24130d] px-4 -mt-3.5 flex items-center gap-2 text-rose-400 text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Eternal Melody</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Main Footer Quote */}
        <p className="font-romantic italic text-xl sm:text-2xl text-rose-200/90 leading-relaxed">
          Made with ♡ for the ones who make life beautiful.
        </p>

        {/* Couple Signature Name */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-rose-700/60" />
          <h4 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Bbu & Bby</span>
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 inline-block animate-pulse" />
          </h4>
          <div className="h-[1px] w-12 bg-rose-700/60" />
        </div>

        <p className="text-xs text-rose-300/70 tracking-wide font-sans">
          Love song of Bbu and bby • A private sanctuary for our cherished memories
        </p>

        {/* Back to Top button */}
        <div className="pt-4">
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white text-xs font-medium border border-rose-500/30 transition-all hover:scale-105 cursor-pointer shadow-md"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Return to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
