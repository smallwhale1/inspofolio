import LinkSpotify from "@/components/create/LinkSpotify";
import styles from "../styles/linkSpotify.module.scss";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SpotifyInterface } from "@/util/interfaces";

type Props = {};

const linkSpotify = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!router.query.code) return;
    const getAccessToken = async () => {
      const res = await fetch(`/api/spotifyCallback?code=${router.query.code}`);
      const data = await res.json();
      console.log(data);
      if (typeof data !== "string") {
        const spotifyData = data as SpotifyInterface;
        localStorage.setItem("access_token", spotifyData.access_token);
        localStorage.setItem("refresh_token", spotifyData.refresh_token);
        router.push("/dashboard");
      }
    };

    getAccessToken();
  }, [router]);
  return (
    <div
      className={styles.linkSpotify}
      style={{ backgroundColor: theme.palette.bgColor.main }}
    >
      <LinkSpotify />
    </div>
  );
};

export default linkSpotify;
