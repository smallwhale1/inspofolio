import styles from "./ThinTrack.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Track, Track as ThinTrack } from "@/util/SpotifyManager";
import { IconButton, useTheme } from "@mui/material";
import { SlSocialSpotify, SlPlus, SlControlPlay } from "react-icons/sl";
import { BsX } from "react-icons/bs";
import { VscPlay } from "react-icons/vsc";

type Props = {
  track: ThinTrack;
  onAdd?: (track: Track) => void;
  onRemove?: (id: string) => void;
};

const ThinTrack = ({ track, onAdd, onRemove }: Props) => {
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
  );
};

export default ThinTrack;
