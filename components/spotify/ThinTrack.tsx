import styles from "./ThinTrack.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Track, Track as ThinTrack } from "@/util/SpotifyManager";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { SlSocialSpotify, SlPlus } from "react-icons/sl";
import { BsX } from "react-icons/bs";
import { MdPlayArrow, MdPlayDisabled, MdStop } from "react-icons/md";

type Props = {
  track: ThinTrack;
  onAdd?: (track: Track) => void;
  onRemove?: (id: string) => void;
  handleTrackPlay: (track: Track) => void;
  handleTrackStop: (track: Track) => void;
  currentTrack: Track | null;
};

const ThinTrack = ({
  track,
  onAdd,
  onRemove,
  handleTrackPlay,
  handleTrackStop,
  currentTrack,
}: Props) => {
  const theme = useTheme();
  return (
    <div className={styles.track}>
      <div className={styles.left}>
        <Image
          className={styles.trackImg}
          src={track.album.images[0].url}
          alt="track"
          height={50}
          width={50}
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
                onRemove(track.id);
              }}
            >
              <BsX />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ThinTrack;
