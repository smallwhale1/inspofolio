import styles from "./Music.module.scss";
import { Project } from "@/models/models";
import { useEffect, useState } from "react";
import { SpotifyManager, SpotifyUser, Track } from "@/util/SpotifyManager";
import { useRouter } from "next/router";
import WebPlayback from "@/components/spotify/WebPlayback";
import TrackCard from "@/components/spotify/TrackCard";
import { Button, useTheme } from "@mui/material";
import { BsSearch } from "react-icons/bs";
import CustomModal from "../CustomModal";
import SongSearch from "@/components/spotify/SongSearch";
import { ProjectsManager } from "@/firebase/ProjectsManager";

type Props = {
  project: Project;
};

// Needs rennovation - multiple playlists => one playlist

interface TokenInfo {
  token: string | null;
  type: "client" | "authenticated";
}

const Music = ({ project }: Props) => {
  const [token, setToken] = useState<TokenInfo>({
    token: null,
    type: "client",
  });
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [recs, setRecs] = useState<Track[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleRemove = async (url: string) => {};

  useEffect(() => {
    setPlaylist(project.playlist as Track[]);
  }, [project.playlist]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setToken({
      token: token,
      type: "authenticated",
    });
  }, []);

  useEffect(() => {
    const getRecs = async () => {
      const clientToken = await SpotifyManager.getClientToken();
      if (clientToken) {
        setToken({
          token: clientToken,
          type: "client",
        });
        const recs = await SpotifyManager.getRecommendations(
          clientToken,
          project.palette
        );
        setRecs(recs);
      }
    };
    getRecs();
  }, [project.palette]);

  const onAdd = async (track: Track) => {
    // right now, only handling the list of tracks case
    if (playlist.some((t) => t.id === track.id)) return;
    await ProjectsManager.updateProject(project._id, "playlist", [
      ...playlist,
      track,
    ]);
    setPlaylist((prev) => [...prev, track]);
  };

  const onRemove = async (removeId: string) => {
    await ProjectsManager.updateProject(
      project._id,
      "playlist",
      playlist.filter((t) => t.id !== removeId)
    );
    setPlaylist((prev) => prev.filter((t) => t.id !== removeId));
  };

  // Gets the spotify user

  // useEffect(() => {
  //   if (!token) return;

  //   const getUser = async () => {
  //     setLoading(true);
  //     const user = await SpotifyManager.getUserInfo(token);
  //     if (typeof user === "string") {
  //       // error
  //       router.push(`/linkSpotify`);
  //     } else {
  //       const spotifyUser = user as SpotifyUser;
  //       setUser(spotifyUser);
  //     }
  //     setLoading(false);
  //   };

  //   getUser();
  // }, [router, token]);

  return (
    <div className={styles.music}>
      <div className={styles.playlist}>
        <h2 className={styles.sectionHeading}>Your Playlist</h2>
        {playlist.length > 0 ? (
          <div className={styles.tracks}>
            {playlist.map((track) => (
              <TrackCard key={track.id} track={track} onRemove={onRemove} />
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
        <div className={styles.tracks}>
          {recs.map((rec) => (
            <TrackCard key={rec.id} track={rec} onAdd={onAdd} />
          ))}
        </div>
      </div>
      <CustomModal modalOpen={searchOpen} setModalOpen={setSearchOpen}>
        <SongSearch onAdd={onAdd} />
      </CustomModal>
    </div>
  );
};

export default Music;
