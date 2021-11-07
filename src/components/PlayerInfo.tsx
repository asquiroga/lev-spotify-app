import { SongInformation } from "../models/Types";
import { timePrettyPrint } from "../utils/Utils";

interface Props {
  song: SongInformation;
}

const PlayerInfo = ({ song }: Props) => {
  const {
    name,
    artist,
    playingPosition,
    albumPhoto,
    albumName,
    songDuration,
    isPlaying,
  } = song;
  return (
    <div className="player fade-in">
      <div className="album-photo">
        <img src={albumPhoto} alt="Current song Album" height="150px" />
      </div>
      <div className="song-info">
        <div className="song-name">
          {name} - {artist}
        </div>
        <div>{albumName}</div>
        <div>Song duration: {timePrettyPrint(songDuration)} </div>

        {isPlaying ? (
          <div> Current Position: {playingPosition}%</div>
        ) : (
          <div className="paused-song">Paused</div>
        )}
      </div>
    </div>
  );
};
export default PlayerInfo;
