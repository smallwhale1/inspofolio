import { FinalColor } from "extract-colors";
import queryString from "query-string";

export interface SpotifyAccessClient {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyAccess {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyRefresh {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export interface SpotifyUser {
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

export interface Playlist {
  name: string;
  images: { height: any; width: any; url: string }[];
  id: string;
  external_urls: {
    spotify: string;
  };
  public: boolean;
}

export interface UserPlaylists {
  href: string;
  items: Playlist[];
}

// Track model

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  type: string;
  uri: string;
  genres: string[];
  label: string;
  popularity: number;
  album_group: string;
  artists: Artist[];
}

export class SpotifyManager {
  // When the user is not logged in, uses the client flow to retrieve songs
  static getClientToken = async (): Promise<string | undefined> => {
    try {
      const res = await fetch("/api/getClientToken");
      const data = await res.json();
      return data.access_token as string;
    } catch (err) {
      console.log(err);
      return;
    }
  };

  // To be implemented
  static getRecommendations = async (token: string, palette: FinalColor[]) => {
    const avgLightness =
      palette
        .map((color) => color.lightness)
        .reduce((acc, curr) => acc + curr, 0) / palette.length;

    const avgIntensity =
      palette
        .map((color) => color.intensity)
        .reduce((acc, curr) => acc + curr, 0) / palette.length;

    const minEnergy = avgIntensity > 0.6 ? 0.1 : 0;
    const maxEnergy = avgIntensity > 0.6 ? 1 : 0.9;

    const chillGenres = "pop,ambient,study,piano,chill";
    const intenseGenres = "hip-hop,work-out,pop,dance,party";

    const res = await fetch(
      "https://api.spotify.com/v1/recommendations?" +
        queryString.stringify({
          limit: 10,
          market: "US",
          seed_genres: avgIntensity <= 0.6 ? chillGenres : intenseGenres,
          min_energy: minEnergy,
          max_energy: maxEnergy,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data.tracks as Track[];
  };

  static getUserInfo = async (token: string): Promise<SpotifyUser | string> => {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await result.json();
    if (data.error) {
      try {
        const { access_token } = await this.getNewToken();
        const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        return await result.json();
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return "Validation failed.";
      }
    } else {
      return data as SpotifyUser;
    }
  };

  // To be implemented
  static createPlaylist = (token: string, userId: string) => {
    const query = {
      limit: 10,
    };
  };

  static transferPlayback = async (token: string, id: string) => {
    const body = {
      device_ids: [id],
      play: true,
    };
    const url = `https://api.spotify.com/v1/me/player`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  };

  static getUserPlaylists = async (
    token: string
  ): Promise<UserPlaylists | string> => {
    const url = `https://api.spotify.com/v1/me/playlists?limit=5`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
      try {
        const { access_token } = await this.getNewToken();
        const result = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        return (await result.json()) as UserPlaylists;
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return "Validation failed.";
      }
    } else {
      return data as UserPlaylists;
    }
  };

  static getToken = async (code: string): Promise<SpotifyAccess> => {
    const res = await fetch(`/api/getAccessToken?code=${code}`);
    const data = await res.json();
    return data as SpotifyAccess;
  };

  static getNewToken = async (): Promise<SpotifyRefresh> => {
    const refreshToken = localStorage.getItem("refresh_token");
    const res = await fetch(`/api/refreshToken?refreshToken=${refreshToken}`);
    const data = await res.json();
    return data as SpotifyRefresh;
  };
}
