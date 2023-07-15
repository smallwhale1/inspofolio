import { SpotifyManager } from "@/util/SpotifyManager";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {};

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const WebPlayback = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setToken(token);
  }, []);

  //   useEffect(() => {
  //     if (!token) return;
  //   }, [token]);

  useEffect(() => {
    if (!token) return;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        await SpotifyManager.transferPlayback(token, device_id);

        const trackUri = "spotify:track:3CgsEYvmjyAPjoNU3LIfyu";
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          console.log("changed");
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          player.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true);
          });
        }
      );

      player.connect();
    };
  }, [token]);

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          <img
            src={current_track?.album.images[0].url}
            className="now-playing__cover"
            alt=""
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{current_track?.name}</div>
            <div className="now-playing__artist">
              {current_track?.artists[0].name}
            </div>

            <button
              className="btn-spotify"
              onClick={() => {
                player?.previousTrack();
              }}
            >
              &lt;&lt;
            </button>
            <button
              className="btn-spotify"
              onClick={() => {
                player?.togglePlay();
              }}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className="btn-spotify"
              onClick={() => {
                player?.nextTrack();
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebPlayback;
