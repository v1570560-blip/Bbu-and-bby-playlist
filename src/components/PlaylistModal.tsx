import React, { useState } from 'react';
import { X, Play, Pause, Search, Music, Sparkles, ExternalLink, Heart } from 'lucide-react';
import { Song } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  onSelectSong: (index: number) => void;
}

export function PlaylistModal({
  isOpen,
  onClose,
  songs,
  currentIndex,
  isPlaying,
  onSelectSong,
}: PlaylistModalProps) {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const filteredSongs = songs
    .map((song, originalIdx) => ({ ...song, originalIndex: originalIdx }))
    .filter(
      (s) =>
        s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(filterQuery.toLowerCase()) ||
        s.movieOrAlbum.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (s.memoryNote && s.memoryNote.toLowerCase().includes(filterQuery.toLowerCase()))
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Glassmorphism Playlist Panel */}
      <div
        id="playlist-panel"
        className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-3xl glass-card shadow-2xl border border-rose-200/80 overflow-hidden z-10"
      >
        {/* Panel Header */}
        <div className="p-5 sm:p-6 border-b border-rose-100/80 flex items-center justify-between bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-md">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2c1810]">
                Love Song Playlist
              </h3>
              <p className="text-xs text-rose-800/80 font-medium">
                {songs.length} Selected Love Songs for Bbu & Bby ♡
              </p>
            </div>
          </div>

          <button
            id="close-playlist-btn"
            onClick={onClose}
            aria-label="Close playlist"
            className="p-2 rounded-full hover:bg-rose-100 text-rose-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside playlist */}
        <div className="p-4 border-b border-rose-100 bg-white/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
            <input
              id="playlist-search-input"
              type="text"
              placeholder="Search playlist by song, singer, or memory..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white/80 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-[#2c1810] placeholder-rose-400"
            />
          </div>
        </div>

        {/* Song List Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-transparent">
          {filteredSongs.length === 0 ? (
            <div className="py-12 text-center text-rose-800/70">
              <Heart className="w-8 h-8 mx-auto mb-2 text-rose-300" />
              <p className="font-romantic text-lg">No songs matched your search</p>
            </div>
          ) : (
            filteredSongs.map((song) => {
              const isActive = song.originalIndex === currentIndex;
              return (
                <div
                  key={song.id}
                  id={`playlist-item-${song.originalIndex}`}
                  onClick={() => onSelectSong(song.originalIndex)}
                  className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-600/25 scale-[1.01]'
                      : 'hover:bg-rose-100/70 text-[#2c1810] bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* Index or Play icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isActive ? (
                        isPlaying ? (
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                            <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <Pause className="w-3.5 h-3.5 fill-white" />
                        )
                      ) : (
                        <span>{song.originalIndex + 1}</span>
                      )}
                    </div>

                    {/* Song Details */}
                    <div className="truncate">
                      <p className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-[#2c1810]'}`}>
                        {song.title}
                      </p>
                      <p className={`text-xs truncate ${isActive ? 'text-rose-100' : 'text-rose-800/80'}`}>
                        {song.artist} • {song.movieOrAlbum}
                      </p>
                    </div>
                  </div>

                  {/* Right side Duration & Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-mono ${isActive ? 'text-rose-100' : 'text-rose-600/80'}`}>
                      {formatTime(song.durationSec)}
                    </span>
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open YouTube link"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'text-rose-200 hover:text-white hover:bg-white/10' : 'text-rose-400 hover:text-rose-700 hover:bg-rose-200/50'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 bg-white/40 border-t border-rose-100/80 text-center text-xs text-rose-800/80 flex items-center justify-between">
          <span>Continuous playback enabled ♡</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
