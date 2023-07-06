import styles from "./Music.module.scss";
import LoadingButton from "@/components/common/LoadingButton";
import { Project } from "@/models/models";
import { useEffect, useState } from "react";
import { SpotifyManager, SpotifyUser } from "@/util/SpotifyManager";
import { useRouter } from "next/router";
import { BsSpotify } from "react-icons/bs";
import { Spotify } from "react-spotify-embed";
import { Button } from "@mui/material";

import dynamic from "next/dynamic";
import { ProjectsManager } from "@/firebase/ProjectsManager";

const SpotifyPlayer = dynamic(() => import("react-spotify-web-playback"), {
  loading: () => <p>Loading...</p>,
});

type Props = {
  project: Project;
};

// Needs rennovation - multiple playlists => one playlist

const Music = ({ project }: Props) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState<string[]>([]);
  const [token, setToken] = useState("");
  const [currProject, setCurrProject] = useState<Project>(project);
  const router = useRouter();

  const handleAdd = async (playlist: string) => {
    if (currProject.playlist.some((ls) => ls === playlist)) {
      console.log("Playlist has already been added.");
      return;
    }
    setUserPlaylists((prev) => prev.filter((url) => url !== playlist));
    // const res = await ProjectsManager.updateProject(project._id, "playlists", [
    //   ...currProject.playlist,
    //   playlist,
    // ]);
    setCurrProject((prev) => ({
      ...prev,
      playlist: [...prev.playlist, playlist],
    }));
  };

  const handleRemove = async (url: string) => {
    setCurrProject((prev) => ({
      ...prev,
      playlist: prev.playlist.filter((playlist) => playlist !== url),
    }));
    // const res = await ProjectsManager.updateProject(
    //   project._id,
    //   "playlists",
    //   currProject.playlist.filter((playlist) => playlist !== url)
    // );
    setUserPlaylists((prev) => [...prev, url]);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setToken(token);
  }, []);

  useEffect(() => {
    if (!token) return;
    const getUser = async () => {
      setLoading(true);
      const user = await SpotifyManager.getUserInfo(token);
      if (typeof user === "string") {
        // error
        router.push(`/linkSpotify`);
      } else {
        const spotifyUser = user as SpotifyUser;
        setUser(spotifyUser);
      }
      setLoading(false);
    };

    getUser();
  }, [router, token]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchPlaylists = async () => {
      const res = await SpotifyManager.getUserPlaylists(token);
      if (typeof res === "string") {
      } else {
        setUserPlaylists(
          res.items
            .map((item) => item.external_urls.spotify)
            .filter((url) => !currProject.playlist.some((p) => p === url))
        );
      }
    };

    fetchPlaylists();
  }, [user]);

  return (
    <div className={styles.music}>
      {!loading &&
        (user && token !== "" ? (
          <div className={styles.music}>
            <h3>Project Playlists</h3>
            <div className={styles.musicContainer}>
              {currProject.playlist.map((playlist) => (
                <div key={playlist}>
                  <Spotify link={playlist} />
                  <div className={styles.btnContainer}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleRemove(playlist);
                      }}
                    >
                      remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <h3>Your Other Playlists</h3>
            <div className={styles.musicContainer}>
              {userPlaylists.map((playlist) => (
                <div key={playlist}>
                  <Spotify link={playlist} />
                  <div className={styles.btnContainer}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleAdd(playlist);
                      }}
                    >
                      add
                    </Button>
                    {/* <Button fullWidth variant="contained">
                      play
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ alignSelf: "flex-start" }}>
            <LoadingButton
              color="secondary"
              icon={<BsSpotify color="#00c56c" size={20} />}
              text="connect to spotify"
              onSubmit={() => {
                router.push(`/linkSpotify?createdProject=${project._id}`);
              }}
              loading={false}
            />
          </div>
        ))}
    </div>
  );
};

export default Music;
