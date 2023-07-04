import { Button } from "@mui/material";
import React from "react";
import queryString from "query-string";
import { callbackUri } from "@/util/constants";

type Props = {};

const scope =
  "streaming app-remote-control user-read-private user-read-email playlist-read-private playlist-modify-private user-top-read user-read-recently-played user-library-modify user-library-read";

const LinkSpotify = (props: Props) => {
  return (
    <div>
      <h1>Link your Spotify Account (optional)</h1>
      <h2>
        By linking your Spotify account, you'll be able to create playlists
        automatically from tags and stream music from within the app.
      </h2>
      <a
        href={
          "https://accounts.spotify.com/authorize?" +
          queryString.stringify({
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: callbackUri,
          })
        }
      >
        <Button variant={"contained"}>Connect Spotify Account</Button>
      </a>
    </div>
  );
};

export default LinkSpotify;
