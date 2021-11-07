import { useCallback, useState } from "react";
import { SongInformation } from "../models/Types";
import {
  addSongToPlaylist,
  createNewPlaylist,
  getPlaylists,
  removePlaylist,
} from "../utils/Playlists";
import AddToPlaylist from "./AddToPlaylist";
import PlayerInfo from "./PlayerInfo";
import PlaylistsBrowser from "./PlaylistsBrowser";

interface Props {
  song: SongInformation;
}

/* This component shows the song information, a button to Add the song to a playlist, and a button to Browse playlists */
const SongContainer = ({ song }: Props) => {
  const [playlists, setPlaylists] = useState(getPlaylists());
  const [browsePlaylists, setBrowsePlaylists] = useState(false);
  const [addToPlaylist, setAddToPlaylist] = useState(false);

  /* Function passed to childs, to goBack to this screen */
  const goBack = useCallback(() => {
    setBrowsePlaylists(false);
    setAddToPlaylist(false);
  }, []);

  /* Deletes a playlist */
  const deletePlaylist = useCallback((playlistName: string) => {
    removePlaylist(playlistName);
    setPlaylists(getPlaylists());
  }, []);

  /* Adds a song to a playlist. Playlist can be new, or already exist */
  const addCurrentSongToPlaylist = (playlist: string) => {
    createNewPlaylist(playlist);
    addSongToPlaylist(playlist, song.name);
    setPlaylists(getPlaylists());
  };

  return (
    <>
      {!browsePlaylists && !addToPlaylist && (
        <>
          <PlayerInfo song={song} />
          <div className="song-action-container">
            <div>
              <button
                onClick={() => setAddToPlaylist(true)}
                className="action-button"
              >
                Add to playlist
              </button>

              <button
                onClick={() => setBrowsePlaylists(true)}
                className="action-button"
              >
                Browse Playlists
              </button>
            </div>
          </div>
        </>
      )}

      {browsePlaylists && (
        <PlaylistsBrowser
          goBack={goBack}
          playlists={playlists}
          removePlaylist={deletePlaylist}
        />
      )}

      {addToPlaylist && (
        /* Adds a song to a playlist. Playlist can be new, or already exist */
        <AddToPlaylist
          goBack={goBack}
          playlists={playlists}
          song={song}
          addCurrentSongToPlaylist={addCurrentSongToPlaylist}
        />
      )}
    </>
  );
};

export default SongContainer;
