const LOCALSTORAGE_KEY = "spotify_playlists_key";

export interface Playlist {
  name: string;
  songs: Array<string>;
}

/* get All playlists from localStorage */
export const getPlaylists = (): Array<Playlist> => {
  if (localStorage.getItem(LOCALSTORAGE_KEY) === null) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) as string);
};

/* internal - save playlists to localstorage */
const savePlaylists = (playlists: Array<Playlist>): void => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(playlists));
};

/* Creates a new playlist. If playlist already exists, returns false */
export const createNewPlaylist = (name: string): boolean => {
  const playlists = getPlaylists();
  const playlistExists = playlists.find((playlist) => playlist.name === name);
  if (playlistExists) {
    return false;
  }
  playlists.push({ name, songs: [] });
  savePlaylists(playlists);
  return true;
};

/* Adds a song to a playlist. Returns true if succeed */
export const addSongToPlaylist = (
  playlistName: string,
  song: string
): boolean => {
  const playlists = getPlaylists();
  const listPosition = playlists.findIndex(
    (playlist) => playlist.name === playlistName
  );
  if (listPosition === -1) return false;

  /* Check if song already exists in playlist */
  const songs = playlists[listPosition].songs;
  const songExists = songs.find((aSong) => aSong === song);
  if (songExists) {
    return false;
  }
  songs.push(song);
  savePlaylists(playlists);
  return true;
};

/* Removes a playlist, returns true if the list was founded */
export const removePlaylist = (name: string): boolean => {
  const playlists = getPlaylists();
  const listPosition = playlists.findIndex(
    (playlist) => playlist.name === name
  );
  if (listPosition === -1) return false;

  playlists.splice(listPosition, 1);
  savePlaylists(playlists);
  return true;
};
