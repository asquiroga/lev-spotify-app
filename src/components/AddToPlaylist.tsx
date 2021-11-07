import { useState } from "react";
import { SongInformation } from "../models/Types";
import { Playlist } from "../utils/Playlists";

interface Props {
  goBack: () => void;
  playlists: Array<Playlist>;
  song: SongInformation;
  addCurrentSongToPlaylist: (playlist: string) => void;
}

const AddToPlaylist = ({
  goBack,
  playlists,
  song,
  addCurrentSongToPlaylist,
}: Props) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylistAdded, setShowPlaylistAdded] = useState(false);
  const [playlistAddedMessage, setPlaylistAddedMessage] = useState("");
  const newPlaylistNameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setNewPlaylistName((e.target as any).value);
  };

  return (
    <div className="add-to-playlist-container fade-in">
      {showPlaylistAdded ? (
        <div>
          <div className="title">A song has been added</div>
          <div>{playlistAddedMessage}</div>

          <button
            className="action-button"
            onClick={() => {
              setShowPlaylistAdded(false);
              goBack();
            }}
          >
            Return to home
          </button>
        </div>
      ) : (
        <div>
          <div className="title">Enter new playlist name</div>
          <div className="new-playlist">
            <input
              type="text"
              value={newPlaylistName}
              onChange={newPlaylistNameChanged}
            />
            <button
              className="small-action-button"
              disabled={newPlaylistName.trim().length === 0}
              onClick={() => {
                addCurrentSongToPlaylist(newPlaylistName);
                setNewPlaylistName("");
                setShowPlaylistAdded(true);
                setPlaylistAddedMessage(
                  `${song.name} added to Playlist: ${newPlaylistName}`
                );
              }}
            >
              Add
            </button>
          </div>

          {playlists.length > 0 && (
            <>
              <div className="title">Or select an existing playlist:</div>

              <div className="playlist-selector">
                {playlists.map((aPlaylist) => (
                  <div
                    className="item-playlist"
                    key={aPlaylist.name}
                    onClick={() => {
                      addCurrentSongToPlaylist(aPlaylist.name);
                      setShowPlaylistAdded(true);
                      setPlaylistAddedMessage(
                        `${song.name} added to Playlist: ${aPlaylist.name}`
                      );
                    }}
                  >
                    {aPlaylist.name}
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="action-button" onClick={goBack}>
            Go back
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;
