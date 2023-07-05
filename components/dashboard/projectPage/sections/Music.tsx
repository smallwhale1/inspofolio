import styles from "./Music.module.scss";
import { Project } from "@/models/models";
import { useEffect, useState } from "react";
import { SpotifyManager } from "@/util/SpotifyManager";
import { useRouter } from "next/router";
import LoadingButton from "@/components/common/LoadingButton";
import { BsSpotify } from "react-icons/bs";
import FoldingBoxesLoader from "@/components/common/animation/FoldingBoxesLoader";
import { Spotify } from "react-spotify-embed";

type Props = {
  project: Project;
};

interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  external_urls: string[];
  followers: { href: string | null; total: number };
  href: string;
  id: string;
  images: string[];
  product: string;
  type: string;
  uri: string;
}
const Music = ({ project }: Props) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const getUser = async () => {
      setLoading(true);
      const user = await SpotifyManager.getUserInfo(token);
      console.log(user);
      if (typeof user === "string") {
        // error
        router.push(`/linkSpotify`);
      } else {
        setLoggedIn(true);
        const spotifyUser = user as SpotifyUser;
        setUser(spotifyUser);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <div className={styles.music}>
      {loading && <FoldingBoxesLoader />}
      {!loading &&
        (loggedIn ? (
          <div className={styles.music}>
            <p>Logged in as {user?.display_name}</p>
            <h3>Recommended</h3>
            <div className={styles.musicContainer}>
              <Spotify
                link="https://open.spotify.com/album/2QJmrSgbdM35R67eoGQo4j"
                width={"100%"}
              />
              <Spotify
                link="https://open.spotify.com/album/5M8td2xvD7Vg9FNAhEFJj1"
                width={"100%"}
              />
            </div>
          </div>
        ) : (
          <LoadingButton
            color="secondary"
            icon={<BsSpotify color="#00c56c" size={20} />}
            text="connect to spotify"
            onSubmit={() => {
              router.push(`/linkSpotify?createdProject=${project._id}`);
            }}
            loading={false}
          />
        ))}
    </div>
  );
};

export default Music;
