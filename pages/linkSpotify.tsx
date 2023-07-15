import styles from "../styles/linkSpotify.module.scss";
import queryString from "query-string";
import LoadingButton from "@/components/common/LoadingButton";
import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import { Button, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { scope } from "@/util/constants";
import { SpotifyManager } from "@/util/SpotifyManager";
import { BsSpotify } from "react-icons/bs";

const LinkSpotify = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.query.code) return;
    const getAccessToken = async () => {
      const spotifyData = await SpotifyManager.getToken(
        router.query.code as string
      );
      localStorage.setItem("access_token", spotifyData.access_token);
      localStorage.setItem("refresh_token", spotifyData.refresh_token);
      if (router.query.projectId) {
        router.push(`/dashboard/${router.query.projectId}?section=music`);
      } else {
        router.push("/dashboard");
      }
    };
    getAccessToken();
  }, [router]);

  return (
    <AuthGuardedLayout>
      <div
        className={styles.linkSpotify}
        style={{ backgroundColor: theme.palette.bgColor.main }}
      >
        <h1>Link your Spotify Account (optional)</h1>
        <h2>
          By linking your Spotify account, you&apos;ll be able to create and
          manage project-specific playlists.
        </h2>
        <div className={styles.btnContainer}>
          <a
            href={
              "https://accounts.spotify.com/authorize?" +
              queryString.stringify({
                response_type: "code",
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
                scope: scope,
                show_dialog: true,
              })
            }
          >
            <LoadingButton
              color="secondary"
              icon={<BsSpotify color="#00c56c" size={20} />}
              text="connect to spotify"
              onSubmit={() => {}}
              loading={loading}
            />
          </a>
          <Button
            variant="text"
            color="secondary"
            onClick={() => {
              if (router.query.createdProject) {
                router.push(`/dashboard/${router.query.createdProject}`);
              } else {
                router.push("/dashboard");
              }
            }}
          >
            go to dashboard
          </Button>
        </div>
      </div>
    </AuthGuardedLayout>
  );
};

export default LinkSpotify;
