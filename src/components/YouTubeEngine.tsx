import { useEffect, useRef, useState, useCallback } from 'react';
import { Song } from '../types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeEngineProps {
  currentSong: Song;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onSongEnded: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  onLoadingChange: (isLoading: boolean) => void;
  seekRequested: number | null;
  onSeekComplete: () => void;
}

export function YouTubeEngine({
  currentSong,
  isPlaying,
  volume,
  isMuted,
  onSongEnded,
  onTimeUpdate,
  onStateChange,
  onLoadingChange,
  seekRequested,
  onSeekComplete,
}: YouTubeEngineProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const lastLoadedSongIdRef = useRef<string>('');
  const timeIntervalRef = useRef<any>(null);

  // Initialize or load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || !containerRef.current) {
        return;
      }

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }

      const playerDivId = 'yt-hidden-player';
      let element = document.getElementById(playerDivId);
      if (!element && containerRef.current) {
        element = document.createElement('div');
        element.id = playerDivId;
        containerRef.current.appendChild(element);
      }

      try {
        playerRef.current = new window.YT.Player(playerDivId, {
          height: '100%',
          width: '100%',
          videoId: currentSong.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              lastLoadedSongIdRef.current = currentSong.youtubeId;
              event.target.setVolume(isMuted ? 0 : volume);
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                onLoadingChange(false);
                onStateChange(true);
              } else if (state === window.YT.PlayerState.PAUSED) {
                onLoadingChange(false);
                onStateChange(false);
              } else if (state === window.YT.PlayerState.BUFFERING) {
                onLoadingChange(true);
              } else if (state === window.YT.PlayerState.ENDED) {
                onLoadingChange(false);
                onStateChange(false);
                onSongEnded();
              }
            },
            onError: (error: any) => {
              console.warn('YouTube Player error code:', error.data);
              onLoadingChange(false);
              // If video is unplayable or restricted, gracefully advance to next song
              setTimeout(() => {
                onSongEnded();
              }, 1200);
            },
          },
        });
      } catch (err) {
        console.error('Error creating YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        if (isMounted) {
          initPlayer();
        }
      };
    }

    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Song change handler
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    if (lastLoadedSongIdRef.current !== currentSong.youtubeId) {
      lastLoadedSongIdRef.current = currentSong.youtubeId;
      try {
        if (isPlaying) {
          playerRef.current.loadVideoById({
            videoId: currentSong.youtubeId,
            startSeconds: 0,
          });
        } else {
          playerRef.current.cueVideoById({
            videoId: currentSong.youtubeId,
            startSeconds: 0,
          });
        }
      } catch (e) {
        console.warn('Could not switch video in YT player', e);
      }
    }
  }, [currentSong, isReady, isPlaying]);

  // Play / Pause synchronization
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try {
      const playerState = playerRef.current.getPlayerState?.();
      if (isPlaying) {
        if (playerState !== window.YT?.PlayerState.PLAYING && playerState !== window.YT?.PlayerState.BUFFERING) {
          playerRef.current.playVideo();
        }
      } else {
        if (playerState === window.YT?.PlayerState.PLAYING || playerState === window.YT?.PlayerState.BUFFERING) {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {
      console.warn('Error syncing playback state:', e);
    }
  }, [isPlaying, isReady]);

  // Volume & Mute synchronization
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch (e) {
      console.warn('Error adjusting volume', e);
    }
  }, [volume, isMuted, isReady]);

  // Seek request synchronization
  useEffect(() => {
    if (seekRequested !== null && isReady && playerRef.current) {
      try {
        playerRef.current.seekTo(seekRequested, true);
        onSeekComplete();
      } catch (e) {
        console.warn('Error seeking in YT player', e);
      }
    }
  }, [seekRequested, isReady, onSeekComplete]);

  // Polling for progress & duration updates
  useEffect(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    if (isReady && isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        if (!playerRef.current) return;
        try {
          const cur = playerRef.current.getCurrentTime?.() || 0;
          const dur = playerRef.current.getDuration?.() || currentSong.durationSec;
          onTimeUpdate(cur, dur > 0 ? dur : currentSong.durationSec);
        } catch {
          // ignore
        }
      }, 350);
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isReady, isPlaying, currentSong, onTimeUpdate]);

  return (
    <div
      ref={containerRef}
      className="hidden pointer-events-none opacity-0 w-0 h-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
