/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { SONGS_PLAYLIST } from './data/songs';
import { Song, PlayerState } from './types';
import { YouTubeEngine } from './components/YouTubeEngine';
import { FloatingHearts } from './components/FloatingHearts';
import { FloatingNavbar } from './components/FloatingNavbar';
import { HeroSection } from './components/HeroSection';
import { MusicPlayer } from './components/MusicPlayer';
import { PlaylistModal } from './components/PlaylistModal';
import { LoveWall } from './components/LoveWall';
import { Footer } from './components/Footer';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SONGS_PLAYLIST[0].durationSec);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [seekRequested, setSeekRequested] = useState<number | null>(null);

  const currentSong: Song = useMemo(
    () => SONGS_PLAYLIST[currentSongIndex] || SONGS_PLAYLIST[0],
    [currentSongIndex]
  );

  // Playback actions
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNextSong = useCallback(() => {
    setCurrentTime(0);
    if (isLoop) {
      // Replay same song
      setSeekRequested(0);
      setIsPlaying(true);
      return;
    }

    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * SONGS_PLAYLIST.length);
      if (randomIndex === currentSongIndex && SONGS_PLAYLIST.length > 1) {
        randomIndex = (randomIndex + 1) % SONGS_PLAYLIST.length;
      }
      setCurrentSongIndex(randomIndex);
      setDuration(SONGS_PLAYLIST[randomIndex].durationSec);
    } else {
      const nextIndex = (currentSongIndex + 1) % SONGS_PLAYLIST.length;
      setCurrentSongIndex(nextIndex);
      setDuration(SONGS_PLAYLIST[nextIndex].durationSec);
    }
    setIsPlaying(true);
  }, [currentSongIndex, isShuffle, isLoop]);

  const handlePrevSong = useCallback(() => {
    setCurrentTime(0);
    // If more than 3 seconds in, reset to start of song, otherwise jump to prev song
    if (currentTime > 4) {
      setSeekRequested(0);
      return;
    }

    const prevIndex = (currentSongIndex - 1 + SONGS_PLAYLIST.length) % SONGS_PLAYLIST.length;
    setCurrentSongIndex(prevIndex);
    setDuration(SONGS_PLAYLIST[prevIndex].durationSec);
    setIsPlaying(true);
  }, [currentSongIndex, currentTime]);

  const handleSongEnded = useCallback(() => {
    // Automatically advance to next song
    handleNextSong();
  }, [handleNextSong]);

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    setSeekRequested(seconds);
  }, []);

  const handleSelectSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    setDuration(SONGS_PLAYLIST[index].durationSec);
    setCurrentTime(0);
    setIsPlaying(true);
    setIsPlaylistOpen(false);
  }, []);

  const scrollToSongs = () => {
    const el = document.getElementById('songs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNotes = () => {
    const el = document.getElementById('notes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#faf6f0] text-[#2c1810] flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* Background Interactive Floating Hearts & Petals */}
      <FloatingHearts interactive={true} />

      {/* Invisible YouTube Player Engine with auto-sync */}
      <YouTubeEngine
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        onSongEnded={handleSongEnded}
        onTimeUpdate={(cur, dur) => {
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
        }}
        onStateChange={(playing) => setIsPlaying(playing)}
        onLoadingChange={(loading) => setIsLoading(loading)}
        seekRequested={seekRequested}
        onSeekComplete={() => setSeekRequested(null)}
      />

      {/* Floating Navigation Pill */}
      <FloatingNavbar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
      />

      {/* 1. HERO / Full-Screen Couple Section */}
      <HeroSection
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onScrollToSongs={scrollToSongs}
        onScrollToNotes={scrollToNotes}
      />

      {/* 2. MUSIC PLAYER Deck */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        isLoop={isLoop}
        isLoading={isLoading}
        onTogglePlay={handleTogglePlay}
        onPrevSong={handlePrevSong}
        onNextSong={handleNextSong}
        onSeek={handleSeek}
        onVolumeChange={(val) => {
          setVolume(val);
          if (val > 0 && isMuted) setIsMuted(false);
        }}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleLoop={() => setIsLoop(!isLoop)}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
      />

      {/* 3. LOVE MESSAGE WALL Section */}
      <LoveWall />

      {/* 4. FOOTER */}
      <Footer />

      {/* 5. PLAYLIST MODAL / DRAWER */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        songs={SONGS_PLAYLIST}
        currentIndex={currentSongIndex}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
      />
    </div>
  );
}
