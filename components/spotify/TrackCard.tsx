import { Track, Track as TrackCard } from "@/util/SpotifyManager";
import styles from "./TrackCard.module.scss";
import Image from "next/image";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import Link from "next/link";
import { MdPlayArrow, MdPlayDisabled, MdStop } from "react-icons/md";
import { SlSocialSpotify, SlPlus, SlControlPlay } from "react-icons/sl";
import { BsX } from "react-icons/bs";

type Props = {
  track: TrackCard;
  onAdd?: (track: Track) => void;
  onRemove?: (track: Track) => void;
  handleTrackPlay: (track: Track) => void;
  handleTrackStop: (track: Track) => void;
  currentTrack: Track | null;
};

const TrackCard = ({
  track,
  onAdd,
  onRemove,
  handleTrackPlay,
  handleTrackStop,
  currentTrack,
}: Props) => {
  const theme = useTheme();
  return (
    // <Link href={track.external_urls.spotify} target="_blank">
    <div className={styles.track}>
      <div>
        <Image
          className={styles.trackImg}
          src={track.album.images[0].url}
          alt="track"
          height={200}
          width={200}
        />
        <div className={styles.text}>
          <h3 className={styles.trackName}>{track.name}</h3>
          <h4
            className={styles.trackArtist}
            style={{ color: theme.palette.grey500.main }}
          >
            {track.artists.map((artist) => artist.name).join(", ")}
          </h4>
        </div>
      </div>
      <div className={styles.btns}>
        {currentTrack?.id === track.id ? (
          <Tooltip title="Stop playing">
            <IconButton onClick={() => handleTrackStop(track)}>
              <MdStop />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            title={track.preview_url ? "Play preview" : "No preview available"}
          >
            <IconButton
              onClick={
                track.preview_url ? () => handleTrackPlay(track) : () => {}
              }
            >
              {track.preview_url ? <MdPlayArrow /> : <MdPlayDisabled />}
            </IconButton>
          </Tooltip>
        )}
        <Link href={track.external_urls.spotify} target="_blank">
          <Tooltip title="Open in Spotify">
            <IconButton>
              <SlSocialSpotify />
            </IconButton>
          </Tooltip>
        </Link>
        {onAdd && (
          <Tooltip title="Add Track">
            <IconButton
              onClick={() => {
                onAdd(track);
              }}
            >
              <SlPlus />
            </IconButton>
          </Tooltip>
        )}
        {onRemove && (
          <Tooltip title="Remove Track">
            <IconButton
              onClick={() => {
                onRemove(track);
              }}
            >
              <BsX />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
    // </Link>
  );
};

export default TrackCard;
