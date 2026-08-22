import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  Heart,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Song } from '../types';

interface MusicPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onPrevSong: () => void;
  onNextSong: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  onOpenPlaylist: () => void;
}

export function MusicPlayer({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isLoop,
  isLoading,
  onTogglePlay,
  onPrevSong,
  onNextSong,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleLoop,
  onOpenPlaylist,
}: MusicPlayerProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverTime(ratio * duration);
  };

  return (
    <section id="songs" className="w-full py-16 sm:py-24 px-4 sm:px-6 relative">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Music className="w-3.5 h-3.5 text-rose-600" />
            <span>Romantic Soundtrack</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2c1810]">
            Love Songs of Bbu & bby
          </h2>
          <p className="font-romantic text-lg sm:text-xl text-rose-900/80 mt-2 max-w-xl mx-auto italic">
            "Every melody is a chapter in our love story."
          </p>
        </div>

        {/* Master Player Deck Card */}
        <div className="relative glass-card rounded-3xl p-6 sm:p-10 shadow-2xl shadow-rose-950/10 border border-rose-200/60 overflow-hidden">
          {/* Subtle floral/vinyl aesthetic watermark */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-rose-100/50 to-pink-100/30 blur-2xl pointer-events-none" />

          {/* Top metadata bar with Song List trigger */}
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-rose-100">
            <div className="flex items-center gap-2 text-xs font-medium text-rose-800/80">
              <span className="flex h-2 w-2 relative">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-rose-500' : 'bg-rose-300'}`} />
              </span>
              <span>{isPlaying ? 'Now Playing for You' : 'Soundtrack Ready'}</span>
              {isLoading && <span className="text-rose-500 font-medium animate-pulse">(buffering...)</span>}
            </div>

            {/* ♫ Song List Button as specifically requested */}
            <button
              id="open-song-list-button"
              onClick={onOpenPlaylist}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs sm:text-sm font-semibold border border-rose-200 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <span className="text-rose-600 font-bold">♫</span>
              <span>Song List</span>
              <span className="bg-rose-200 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">24</span>
            </button>
          </div>

          {/* Center Song Details */}
          <div className="my-8 text-center flex flex-col items-center">
            {/* Animated Vinyl / Artwork Visualizer Disc */}
            <div className="relative mb-6">
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#2c1810] via-[#4a2820] to-[#2c1810] p-1.5 shadow-xl border-4 border-rose-200/80 flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '16s' }}
              >
                {/* Vinyl grooved rings */}
                <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center p-3">
                  <div className="w-full h-full rounded-full border border-white/15 flex items-center justify-center p-3 bg-[#1e0e0a]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 via-pink-400 to-rose-600 flex flex-col items-center justify-center text-white shadow-inner">
                      <Heart className="w-6 h-6 fill-white text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Little floating note badge */}
              <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-rose-200 shadow-md text-xs font-semibold text-rose-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Bbu & Bby</span>
              </div>
            </div>

            {/* Song Title */}
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2c1810] tracking-tight">
              {currentSong.title}
            </h3>

            {/* Artist & Film */}
            <p className="text-rose-800 text-sm sm:text-base font-medium mt-1">
              {currentSong.artist} <span className="text-rose-400">•</span> {currentSong.movieOrAlbum}
            </p>

            {/* Romantic memory quote tag if present */}
            {currentSong.memoryNote && (
              <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-rose-100/60 border border-rose-200/70 text-rose-900 text-xs sm:text-sm font-romantic italic">
                “{currentSong.memoryNote}”
              </div>
            )}
          </div>

          {/* Progress Bar & Seek Scrub */}
          <div className="w-full mb-6">
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              onMouseMove={handleProgressBarMouseMove}
              onMouseEnter={() => setIsHoveringProgress(true)}
              onMouseLeave={() => {
                setIsHoveringProgress(false);
                setHoverTime(null);
              }}
              className="relative w-full h-2.5 sm:h-3 bg-rose-200/60 hover:bg-rose-200 rounded-full cursor-pointer transition-all overflow-hidden group"
              role="slider"
              aria-label="Track progress"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration}
            >
              {/* Played bar */}
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-100 relative"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Glowing playhead knob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Current Time & Total Duration display */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-rose-900/80 mt-2">
              <span>{formatTime(currentTime)}</span>
              {isHoveringProgress && hoverTime !== null && (
                <span className="text-rose-600 font-sans text-xs bg-rose-100 px-2 py-0.5 rounded-md">
                  Seek: {formatTime(hoverTime)}
                </span>
              )}
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls Deck */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* Left Aux Controls (Shuffle / Loop) */}
            <div className="flex items-center gap-3 order-2 sm:order-1">
              <button
                id="player-shuffle-btn"
                onClick={onToggleShuffle}
                title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isShuffle ? 'bg-rose-500 text-white shadow-md shadow-rose-400/40' : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                id="player-loop-btn"
                onClick={onToggleLoop}
                title={isLoop ? 'Loop track enabled' : 'Loop track disabled'}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isLoop ? 'bg-rose-500 text-white shadow-md shadow-rose-400/40' : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Center Playback Controls (Prev, Big Play/Pause, Next) */}
            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
              <button
                id="player-prev-btn"
                onClick={onPrevSong}
                aria-label="Previous song"
                className="p-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
              >
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-900" />
              </button>

              <button
                id="player-main-play-btn"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white/50"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-9 sm:h-9 fill-white" />
                ) : (
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white ml-0.5" />
                )}
              </button>

              <button
                id="player-next-btn"
                onClick={onNextSong}
                aria-label="Next song"
                className="p-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
              >
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-900" />
              </button>
            </div>

            {/* Right Aux Controls (Volume & External Link) */}
            <div className="flex items-center gap-3 order-3">
              <button
                id="player-mute-btn"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="text-rose-700 hover:text-rose-950 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-20 sm:w-24 h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                aria-label="Volume controller"
              />
              <a
                href={currentSong.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                title="Open on YouTube"
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-full transition-colors ml-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
