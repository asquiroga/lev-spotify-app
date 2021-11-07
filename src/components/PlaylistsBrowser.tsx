import { useState } from "react";
import { Playlist } from "../utils/Playlists";

interface Props {
  goBack: () => void;
  playlists: Array<Playlist>;
  removePlaylist: (playlistName: string) => void;
}

const PlaylistsBrowser = ({ goBack, playlists, removePlaylist }: Props) => {
  const [currentPlaylist, setCurrentPlaylist] = useState("");

  return (
    <div className="playlists-container fade-in">
      <div className="title">Browsing {playlists.length} playlists</div>

      {playlists.map((aPlaylist) => {
        return (
          <div className="playlist-item-container" key={aPlaylist.name}>
            <div className="playlist-name">
              Playlist: {aPlaylist.name}
              <button
                className="small-action-button"
                onClick={() => {
                  setCurrentPlaylist(aPlaylist.name);
                }}
              >
                Show Songs
              </button>
            </div>
            {currentPlaylist === aPlaylist.name && (
              <ul className="playlist-songs fade-in">
                {aPlaylist.songs.map((aSong) => (
                  <li key={aSong}>{aSong}</li>
                ))}
              </ul>
            )}
            <button
              className="small-action-button"
              onClick={() => removePlaylist(aPlaylist.name)}
            >
              Delete Playlist
            </button>
          </div>
        );
      })}

      <button className="action-button" onClick={goBack}>
        Go back
      </button>
    </div>
  );
};

export default PlaylistsBrowser;
