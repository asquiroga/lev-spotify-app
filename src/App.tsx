import { useCallback, useEffect, useState } from "react";
import "./App.css";
import SongContainer from "./components/SongContainer";
import { SongInformation } from "./models/Types";
import { fetchCurrentPlaying } from "./utils/ApiFetcher";
import {
  createSongInformation,
  getSpotifyAuthUrl,
  getUrlToken,
} from "./utils/Utils";

/* Main component. If no token is in url, shows login button. Otherwise, starts fetching Spotify API */
function App() {
  const [token, setToken] = useState<String | null>();
  const [songInformation, setSongInformation] =
    useState<SongInformation | null>();
  const [noSongInformation, setNoSongInformation] = useState(false);

  const fetchSpotify = useCallback(() => {
    fetchCurrentPlaying()
      .then((spotifyResponse) => {
        if (spotifyResponse.noServerInformation === true) {
          setSongInformation(null);
          setNoSongInformation(true);
        } else {
          setSongInformation(createSongInformation(spotifyResponse));
          setNoSongInformation(false);
        }
        /* Only when whe have the server response, we schedule a timer */
        setTimeout(fetchSpotify, 3000);
      })
      .catch((error) => {
        console.log("Error while fetching Spotify API", error);
      });
  }, []);

  useEffect(() => {
    setToken(getUrlToken());
  }, []);

  useEffect(() => {
    if (token) {
      fetchSpotify();
    }
  }, [token, fetchSpotify]);

  return (
    <div className="app-container">
      <header className="app-header">
        <p>LEV - Spotify App</p>
      </header>

      <div className="app-body">
        {token && songInformation && <SongContainer song={songInformation} />}

        {token && noSongInformation && (
          <div>No song information from Spotify</div>
        )}

        {!token && (
          <a className="login-button" href={getSpotifyAuthUrl()}>
            Login to Spotify
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
