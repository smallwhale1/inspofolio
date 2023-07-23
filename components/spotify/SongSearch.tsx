import styles from "./SongSearch.module.scss";
import { SpotifyManager, Track } from "@/util/SpotifyManager";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ThinTrack from "./ThinTrack";

interface SongSearchProps {
  accessToken?: string;
  onAdd: (track: Track) => void;
  handleTrackPlay: (track: Track) => void;
  handleTrackStop: (track: Track) => void;
  currentTrack: Track | null;
}

// Search with debounce
const SongSearch = ({
  accessToken,
  onAdd,
  handleTrackPlay,
  handleTrackStop,
  currentTrack,
}: SongSearchProps) => {
  const [query, setQuery] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  useEffect(() => {
    const getToken = async () => {
      const clientToken = await SpotifyManager.getClientToken();
      if (clientToken) {
        setToken(clientToken);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!token) return;
    let timer: NodeJS.Timeout | null = null;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&market=US&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSearchResults(data.tracks.items as Track[]);
      setIsLoading(false);
    };

    if (query) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        fetchSearchResults();
      }, 500); // debounce delay
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [query, token]);

  return (
    <>
      <h2>Search for tracks</h2>
      <TextField
        type="text"
        label="Search for tracks"
        placeholder="Search for tracks..."
        fullWidth
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tracks}>
          {searchResults.map((track) => (
            <ThinTrack
              key={track.id}
              track={track}
              onAdd={onAdd}
              handleTrackPlay={handleTrackPlay}
              handleTrackStop={handleTrackStop}
              currentTrack={currentTrack}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SongSearch;
