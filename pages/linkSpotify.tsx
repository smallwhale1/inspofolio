import styles from "../styles/linkSpotify.module.scss";
import queryString from "query-string";
import LoadingButton from "@/components/common/LoadingButton";
import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import { Button, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { scope } from "@/util/constants";
import { SpotifyManager } from "@/util/SpotifyManager";
import { BsSpotify } from "react-icons/bs";
import { ToastContext } from "@/contexts/ToastContext";

const generateRandomString = function (length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const LinkSpotify = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gettingToken, setGettingToken] = useState(false);
  const state = useRef<string>("");
  const { setToastMessage } = useContext(ToastContext);

  useEffect(() => {
    if (router.query.code || router.query.state) return;
    state.current = generateRandomString(16);
  }, [router]);

  useEffect(() => {
    if (!router.query.code) return;
    const getAccessToken = async () => {
      setGettingToken(true);
      const spotifyData = await SpotifyManager.getToken(
        router.query.code as string
      );
      localStorage.setItem("access_token", spotifyData.access_token);
      localStorage.setItem("refresh_token", spotifyData.refresh_token);
      const savedProjectId = localStorage.getItem("projectId");
      if (savedProjectId) {
        localStorage.removeItem("projectId");
        router.push(`/dashboard/${savedProjectId}?section=music`);
      } else {
        router.push("/dashboard");
      }
    };
    getAccessToken();
  }, [router.query]);

  return (
    <AuthGuardedLayout>
      <div
        className={styles.linkSpotify}
        style={{ backgroundColor: theme.palette.bgColor.main }}
      >
        {gettingToken ? (
          <p>Successfully authenticated! Redirecting in a few moments...</p>
        ) : (
          <>
            <h1>Link your Spotify Account (optional)</h1>
            <h2>
              By linking your Spotify account, you&apos;ll be able to create
              project-specific Spotify playlists. You&apos;ll still be able to
              create a playlist of tracks without linking your account, but it
              won&apos;t be linked to your Spotify account.
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
                    // state: state.current,
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
                  const savedProjectId = localStorage.getItem("projectId");
                  if (savedProjectId) {
                    localStorage.removeItem("projectId");
                    router.push(`/dashboard/${savedProjectId}`);
                  } else {
                    router.push("/dashboard");
                  }
                }}
              >
                maybe later
              </Button>
            </div>
          </>
        )}
      </div>
    </AuthGuardedLayout>
  );
};

export default LinkSpotify;
