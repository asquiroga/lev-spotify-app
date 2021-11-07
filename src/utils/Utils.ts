import environment from "../config/Environment";
import { SongInformation, SpotifyResponse } from "../models/Types";

let token: String | null = null;

/* Extracts token from url hash (www.url.com#access_token=123 returns 123) */
export const getUrlToken = (): String | null => {
  if (!token) {
    token = (window.location.hash as any).match(/access_token=([^&]+)/)?.[1];
  }
  return token;
};

export const getSpotifyAuthUrl = (): string => {
  const { clientId, scopes, authEndpoint, redirectUri } = environment;

  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
};

/* Creates a SongInformation item from a Spotify Response */
export const createSongInformation = (
  response: SpotifyResponse
): SongInformation => {
  const { item } = response;
  const { album } = item;
  return {
    name: item.name,
    albumName: album.name,
    albumPhoto: album.images[0].url,
    artist: item.artists?.[0].name,
    playingPosition: Math.round(
      (response.progress_ms * 100) / response.item.duration_ms
    ),
    songDuration: Math.round(response.item.duration_ms / 1000),
    isPlaying: response.is_playing,
  };
};

export const timePrettyPrint = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);

  return `${minutes} minutes ${seconds % 60} seconds`;
};
