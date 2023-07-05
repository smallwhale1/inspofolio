import { SpotifyAccess, SpotifyRefresh } from "./interfaces";
import { FinalColor } from "extract-colors";

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

export class SpotifyManager {
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
  static get10Recommendations = (
    token: string,
    userId: string,
    palette: FinalColor[]
  ) => {};

  // To be implemented
  static generatePlaylist = (token: string, userId: string) => {
    const query = {
      limit: 10,
    };
  };

  static getUserPlaylists = async (
    userId: string,
    token: string
  ): Promise<UserPlaylists | string> => {
    const url = `https://api.spotify.com/v1/users/${userId}/playlists?user_id=${userId}&limit=5`;
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

  static playPlaylist = (token: string) => {};

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
