export interface SongInformation {
  name: string;
  artist: string;
  albumName: string;
  albumPhoto: string;
  playingPosition: number; // percentage
  songDuration: number; //in seconds
  isPlaying: boolean;
}

export interface SpotifyResponse {
  progress_ms: number;
  is_playing: boolean;
  item: {
    album: {
      name: string;
      images: Array<{
        height: number;
        width: number;
        url: string;
      }>;
    };
    artists: Array<{
      name: string;
    }>;
    name: string;
    duration_ms: number;
  };
}
