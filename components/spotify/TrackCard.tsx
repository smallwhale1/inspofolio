import { Track, Track as TrackCard } from "@/util/SpotifyManager";
import styles from "./TrackCard.module.scss";
import Image from "next/image";
import { IconButton, useTheme } from "@mui/material";
import Link from "next/link";
import { VscPlay } from "react-icons/vsc";
import { SlSocialSpotify, SlPlus, SlControlPlay } from "react-icons/sl";
import { BsX } from "react-icons/bs";

type Props = {
  track: TrackCard;
  onAdd?: (track: Track) => void;
  onRemove?: (id: string) => void;
};

const TrackCard = ({ track, onAdd, onRemove }: Props) => {
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
        {/* <IconButton>
          <VscPlay />
        </IconButton> */}
        <Link href={track.external_urls.spotify} target="_blank">
          <IconButton>
            <SlSocialSpotify />
          </IconButton>
        </Link>
        {onAdd && (
          <IconButton
            onClick={() => {
              onAdd(track);
            }}
          >
            <SlPlus />
          </IconButton>
        )}
        {onRemove && (
          <IconButton
            onClick={() => {
              onRemove(track.id);
            }}
          >
            <BsX />
          </IconButton>
        )}
      </div>
    </div>
    // </Link>
  );
};

export default TrackCard;
