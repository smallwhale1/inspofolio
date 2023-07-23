import styles from "./Music.module.scss";
import { Project } from "@/models/models";
import { useEffect, useRef, useState } from "react";
import { SpotifyManager, Track } from "@/util/SpotifyManager";
import { useRouter } from "next/router";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { BsSearch, BsSpotify } from "react-icons/bs";
import TrackCard from "@/components/spotify/TrackCard";
import CustomModal from "../CustomModal";
import SongSearch from "@/components/spotify/SongSearch";
import LoadingButton from "@/components/common/LoadingButton";
import { shuffleArray } from "@/util/constants";
import { IoMdRefresh } from "react-icons/io";

type Props = {
  project: Project;
  onAdd: (track: Track) => Promise<void>;
  onRemove: (track: Track) => Promise<void>;
};

// Needs rennovation - multiple playlists => one playlist
const Music = ({ project, onAdd, onRemove }: Props) => {
  const [recs, setRecs] = useState<Track[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const token = useRef<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const handleTrackClick = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (!track.preview_url) return;
      setCurrentTrack(track);
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.play();
    } else {
      if (!track.preview_url) return;
      setCurrentTrack(track);
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.play();
    }
  };

  const handleTrackStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentTrack(null);
    }
  };

  const getRecs = async () => {
    setLoadingRecs(true);
    if (token.current) {
      const clientToken = token.current;
      if (typeof project.playlist !== "string") {
        const recs = await SpotifyManager.getRecommendations(
          clientToken,
          project.palette,
          shuffleArray(project.playlist.slice(0, 3).map((t) => t.id))
        );
        setRecs(recs);
      }
    } else {
      const clientToken = await SpotifyManager.getClientToken();
      if (clientToken && typeof project.playlist !== "string") {
        token.current = clientToken;
        const recs = await SpotifyManager.getRecommendations(
          clientToken,
          project.palette,
          shuffleArray(project.playlist.slice(0, 3).map((t) => t.id))
        );
        setRecs(recs);
      }
    }
    setLoadingRecs(false);
  };

  useEffect(() => {
    getRecs();
  }, [project.palette]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      setCurrentTrack(null);
    };
  }, []);

  // somehow access_token removed, redirect to login
  if (typeof project.playlist === "string")
    return (
      <div>
        <p>You were logged out of Spotify. Please login again.</p>
        <LoadingButton
          color="secondary"
          icon={<BsSpotify color="#00c56c" size={20} />}
          text="link spotify"
          onSubmit={() => {
            router.push("/linkSpotify");
          }}
          loading={false}
        />
      </div>
    );

  return (
    <div className={styles.music}>
      <div className={styles.playlist}>
        <div className={styles.playlistHeader}>
          <h2 className={styles.sectionHeading}>Your Playlist</h2>
          <LoadingButton
            color="secondary"
            icon={<BsSpotify color="#00c56c" size={20} />}
            text="link spotify"
            onSubmit={() => {
              router.push("/linkSpotify");
            }}
            loading={false}
          />
        </div>
        {project.playlist.length > 0 ? (
          <div className={styles.tracks}>
            {project.playlist.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onRemove={onRemove}
                handleTrackPlay={handleTrackClick}
                handleTrackStop={handleTrackStop}
                currentTrack={currentTrack}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: theme.palette.grey500.main }}>
            No tracks added yet.
          </p>
        )}
      </div>
      <div className={styles.recommended}>
        <div className={styles.recommendedHeader}>
          <h2 className={styles.sectionHeading}>Recommended Tracks</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Tooltip title="Refresh Recommendations">
              <IconButton onClick={getRecs}>
                <IoMdRefresh color={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>
            <Button
              variant="text"
              onClick={() => {
                setSearchOpen(true);
              }}
            >
              <span className={styles.searchBtn}>
                search <BsSearch />
              </span>
            </Button>
          </div>
        </div>
        {loadingRecs ? (
          <p>Finding recommendations...</p>
        ) : (
          <div className={styles.tracks}>
            {recs.map((rec) => (
              <TrackCard
                key={rec.id}
                track={rec}
                onAdd={onAdd}
                handleTrackPlay={handleTrackClick}
                handleTrackStop={handleTrackStop}
                currentTrack={currentTrack}
              />
            ))}
          </div>
        )}
      </div>
      <CustomModal modalOpen={searchOpen} setModalOpen={setSearchOpen}>
        <SongSearch
          onAdd={onAdd}
          handleTrackPlay={handleTrackClick}
          handleTrackStop={handleTrackStop}
          currentTrack={currentTrack}
        />
      </CustomModal>
    </div>
  );
};

export default Music;
