export interface Song {
  id: string;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  artist: string;
  movieOrAlbum: string;
  durationSec: number;
  memoryNote?: string;
  coverImage?: string;
}

export interface LoveMessage {
  id: string;
  senderName: string;
  partnerName: string;
  message: string;
  createdAt: string;
  themeColor?: string;
  likes?: number;
}

export interface PlayerState {
  currentSongIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  isPlaylistOpen: boolean;
  isLoading: boolean;
}
