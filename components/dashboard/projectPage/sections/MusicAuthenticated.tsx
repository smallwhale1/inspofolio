import LoadingButton from "@/components/common/LoadingButton";
import styles from "./MusicAuthenticated.module.scss";
import TrackCard from "@/components/spotify/TrackCard";
import CustomModal from "../CustomModal";
import SongSearch from "@/components/spotify/SongSearch";
import { Project } from "@/models/models";
import {
  Playlist,
  SpotifyManager,
  SpotifyUser,
  Track,
} from "@/util/SpotifyManager";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { BsSearch, BsSpotify } from "react-icons/bs";
import Link from "next/link";
import { ToastContext } from "@/contexts/ToastContext";
import { IoMdRefresh } from "react-icons/io";
import { shuffleArray } from "@/util/constants";
import { isErrorRes, isSuccessRes } from "@/util/errorHandling";

type Props = {
  token: string;
  project: Project;
  changePlaylistType: (playlistId: string) => Promise<void>;
  setMusicType: React.Dispatch<
    React.SetStateAction<
      | {
          token: string;
        }
      | "client"
      | null
    >
  >;
};

const validEmails = new Set([
  "sumikkowhale@gmail.com",
  "sophie_zhang@brown.edu",
]);

const MusicAuthenticated = ({
  token,
  project,
  changePlaylistType,
  setMusicType,
}: Props) => {
  const { setToastMessage } = useContext(ToastContext);
  const router = useRouter();
  const theme = useTheme();
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recs, setRecs] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const playId = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const accessToken = useRef<string>(token);

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

  const handlePlaylistAddString = async (track: Track) => {
    if (!playId.current) return;
    const res = await SpotifyManager.addTracksToPlaylist(
      playId.current,
      [track.uri],
      accessToken.current
    );
    if (!isErrorRes(res)) {
      setToastMessage("Successfully added track!");
      const updatedPlaylist = await SpotifyManager.getPlaylist(
        playId.current,
        accessToken.current
      );
      if (!isErrorRes(updatedPlaylist)) {
        setPlaylist(updatedPlaylist);
        setPlaylistTracks(
          updatedPlaylist.tracks.items.map((track) => track.track)
        );
      } else {
        setToastMessage(updatedPlaylist.message);
      }
    } else {
      setToastMessage(res.message);
    }
  };

  const handlePlaylistRemoveString = async (track: Track) => {
    if (!playId.current) return;
    const res = await SpotifyManager.removeTrackFromPlaylist(
      playId.current,
      track.uri,
      accessToken.current
    );
    if (typeof res !== "string") {
      setPlaylistTracks((prev) => prev.filter((t) => t.uri !== track.uri));
      setToastMessage("Successfully removed track.");
    } else {
      setToastMessage(res);
    }
  };

  const getUser = async () => {
    const user = await SpotifyManager.getUserInfo(accessToken.current);
    if (isErrorRes(user)) {
      localStorage.setItem("projectId", project._id);
      router.push(`/linkSpotify`);
    } else {
      if (validEmails.has(user.email)) {
        const newToken = localStorage.getItem("access_token");
        if (newToken) {
          accessToken.current = newToken;
        }
        setUser(user);
      } else {
        setToastMessage(
          "Waiting for an extended quota from Spotify, redirecting to unauthenticated flow for now..."
        );
        setMusicType("client");
      }
    }
  };

  const handleRecs = async () => {
    setLoadingRecs(true);
    let trackSeeds: string[] = [];
    if (playlistTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlistTracks.length);
      const randomTrack = playlistTracks[randomIndex];
      trackSeeds.push(randomTrack.id);
    }
    const userTopTracks = await SpotifyManager.getUserTopTracks(
      accessToken.current
    );
    if (!isErrorRes(userTopTracks)) {
      trackSeeds = [
        ...trackSeeds,
        ...shuffleArray(userTopTracks)
          .slice(0, 2)
          .map((t) => t.id),
      ];
    }
    const recs = await SpotifyManager.getRecommendations(
      accessToken.current,
      project.palette,
      trackSeeds
    );

    if (isErrorRes(recs)) {
      setToastMessage(recs.message);
    } else {
      setRecs(recs);
    }
    setLoadingRecs(false);
  };

  const handleSetup = async () => {
    if (!user) return;
    if (typeof project.playlist === "string") {
      // already a string playlist
      playId.current = project.playlist;
      const playlist = await SpotifyManager.getPlaylist(
        project.playlist,
        accessToken.current
      );
      if (!isErrorRes(playlist)) {
        setPlaylistTracks(playlist.tracks.items.map((track) => track.track));
        setPlaylist(playlist);
      } else {
        // an error occured, assume need to create a new playlist
        const res = await SpotifyManager.createPlaylist(
          project,
          accessToken.current,
          user.id
        );
        if (!isErrorRes(res)) {
          const playlistId = res.id;
          playId.current = playlistId;
          setPlaylist(res);
        } else {
          setToastMessage(res.message);
        }
      }
    } else {
      // create a playlist for the user, migrate all the tracks to the playlist
      const res = await SpotifyManager.createPlaylist(
        project,
        accessToken.current,
        user.id
      );
      if (!isErrorRes(res)) {
        const playlistId = res.id;
        playId.current = playlistId;
        await changePlaylistType(playlistId);
        setPlaylist(res);
        if (project.playlist.length > 0) {
          const addRes = await SpotifyManager.addTracksToPlaylist(
            playlistId,
            project.playlist.map((track) => track.uri),
            accessToken.current
          );
          if (isSuccessRes(addRes)) {
            const playlist = await SpotifyManager.getPlaylist(
              playlistId,
              accessToken.current
            );
            if (!isErrorRes(playlist)) {
              // changing playlist type from list of tracks to a spotify playlist id
              setPlaylistTracks(
                playlist.tracks.items.map((track) => track.track)
              );
              setPlaylist(playlist);
            } else {
              setToastMessage(playlist.message);
            }
          } else {
            setToastMessage(addRes.message);
          }
        }
      } else {
        setToastMessage(res.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    getUser();
  }, [token]);

  useEffect(() => {
    if (!user) return;
    handleSetup();
  }, [user]);

  useEffect(() => {
    if (loading || !playId.current) return;
    handleRecs();
  }, [loading]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      setCurrentTrack(null);
    };
  }, []);

  return (
    <>
      {!loading ? (
        <div className={styles.music}>
          <div className={styles.playlist}>
            <div className={styles.playlistHeader}>
              <h2 className={styles.sectionHeading}>Your Playlist</h2>
              {playlist && (
                <Link href={playlist.external_urls.spotify} target="_blank">
                  <LoadingButton
                    color="secondary"
                    icon={<BsSpotify color="#00c56c" size={20} />}
                    text="play in spotify"
                    onSubmit={() => {}}
                    loading={false}
                  />
                </Link>
              )}
            </div>
            {playlist &&
              (playlistTracks.length > 0 ? (
                <div className={styles.tracks}>
                  {playlistTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onRemove={handlePlaylistRemoveString}
                      handleTrackPlay={handleTrackClick}
                      handleTrackStop={handleTrackStop}
                      currentTrack={currentTrack}
                    />
                  ))}
                </div>
              ) : (
                <p>No tracks added yet.</p>
              ))}
          </div>
          <div className={styles.recommended}>
            <div className={styles.recommendedHeader}>
              <h2 className={styles.sectionHeading}>Recommended Tracks</h2>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Tooltip title="Refresh Recommendations">
                  <IconButton onClick={handleRecs}>
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
              <p>Loading recs...</p>
            ) : (
              <div className={styles.tracks}>
                {recs.map((rec) => (
                  <TrackCard
                    key={rec.id}
                    track={rec}
                    onAdd={handlePlaylistAddString}
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
              onAdd={handlePlaylistAddString}
              handleTrackPlay={handleTrackClick}
              handleTrackStop={handleTrackStop}
              currentTrack={currentTrack}
            />
          </CustomModal>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default MusicAuthenticated;
