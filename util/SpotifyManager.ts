import { Project } from "@/models/models";
import { FinalColor } from "extract-colors";
import queryString from "query-string";
import { ErrorResponse, SuccessResponse } from "./errorHandling";

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
  tracks: {
    items: {
      track: Track;
    }[];
  };
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

interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export const isSpotifyError = (obj: any): obj is SpotifyError => {
  return typeof obj === "object" && "error" in obj;
};

const apiCleanup = (
  spotifyError: SpotifyError,
  code?: number
): ErrorResponse => {
  console.log("cleanup");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return code
    ? {
        status: "error",
        message: spotifyError.error.message,
        code: code,
      }
    : {
        status: "error",
        message: spotifyError.error.message,
      };
};

export class SpotifyManager {
  static getUserInfo = async (
    token: string
  ): Promise<SpotifyUser | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const url = "https://api.spotify.com/v1/me";
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      return data;
    };
    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return data2 as SpotifyUser;
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return data1 as SpotifyUser;
    }
  };

  static createPlaylist = async (
    project: Project,
    token: string,
    userId: string
  ): Promise<Playlist | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const body = {
        name: `${project.name} Playlist`,
      };
      const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return data;
    };
    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2, data2.error.status);
        } else {
          return data2 as Playlist;
        }
      } else {
        return apiCleanup(data1, data1.error.status);
      }
    } else {
      return data1 as Playlist;
    }
  };

  static getUserTopTracks = async (
    token: string
  ): Promise<Track[] | ErrorResponse> => {
    // successful tracks response is data.items
    const apiCall = async (tok: string) => {
      const url = `https://api.spotify.com/v1/me/top/tracks?limit=5`;
      const result = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await result.json();
      return data;
    };
    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return data2.items as Track[];
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return data1.items as Track[];
    }
  };

  static addTracksToPlaylist = async (
    playlistId: string,
    uris: string[],
    token: string
  ): Promise<SuccessResponse | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris.join(
        ","
      )}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      return data;
    };

    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return {
            status: "success",
          };
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return {
        status: "success",
      };
    }
  };

  static removeTrackFromPlaylist = async (
    playlistId: string,
    uri: string,
    token: string
  ): Promise<SuccessResponse | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const body = {
        tracks: [{ uri: uri }],
      };
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tok}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return data;
    };

    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return {
            status: "success",
          };
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return {
        status: "success",
      };
    }
  };

  static getPlaylist = async (
    playlistId: string,
    token: string
  ): Promise<Playlist | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const url = `
      https://api.spotify.com/v1/playlists/${playlistId}?playlist_id=${playlistId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      return data;
    };

    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2, data2.error.status);
        } else {
          return data2 as Playlist;
        }
      } else {
        return apiCleanup(data1, data1.error.status);
      }
    } else {
      return data1 as Playlist;
    }
  };

  /**
   * Fetches recommendations based on seeds
   * @param token API token
   * @param palette color palette
   * @param seedTracks limit - 3
   * @returns recommended tracks
   */
  static getRecommendations = async (
    token: string,
    palette: FinalColor[],
    seedTracks?: string[]
  ): Promise<Track[] | ErrorResponse> => {
    const avgIntensity =
      palette
        .map((color) => color.intensity)
        .reduce((acc, curr) => acc + curr, 0) / palette.length;

    const avgLightness =
      palette
        .map((color) => color.lightness)
        .reduce((acc, curr) => acc + curr, 0) / palette.length;

    const minEnergy = avgIntensity > 0.5 ? 0.1 : 0;
    const maxEnergy = avgIntensity > 0.5 ? 1 : 0.9;
    const targetEnergy = avgIntensity > 0.5 ? 0.8 : 0.3;

    const targetMode = avgLightness > 0.5 ? 1 : 0;

    const chillGenres = "piano,chill";
    const intenseGenres = "pop,dance";

    const query = seedTracks
      ? {
          limit: 10,
          market: "US",
          seed_genres: avgIntensity <= 0.6 ? chillGenres : intenseGenres,
          seed_tracks: seedTracks.join(","),
          min_energy: minEnergy,
          max_energy: maxEnergy,
          target_energy: targetEnergy,
          target_mode: targetMode,
        }
      : {
          limit: 10,
          market: "US",
          seed_genres: avgIntensity <= 0.6 ? chillGenres : intenseGenres,
          min_energy: minEnergy,
          max_energy: maxEnergy,
          target_energy: targetEnergy,
          target_mode: targetMode,
        };

    // actual data is in data.tracks
    const apiCall = async (tok: string) => {
      const res = await fetch(
        "https://api.spotify.com/v1/recommendations?" +
          queryString.stringify(query),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tok}`,
          },
        }
      );
      const data = await res.json();
      return data;
    };

    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return data2.tracks as Track[];
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return data1.tracks as Track[];
    }
  };

  static getUserPlaylists = async (
    token: string
  ): Promise<UserPlaylists | ErrorResponse> => {
    const apiCall = async (tok: string) => {
      const url = `https://api.spotify.com/v1/me/playlists?limit=5`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      return data;
    };

    const data1 = await apiCall(token);
    if (isSpotifyError(data1)) {
      if (data1.error.status === 401) {
        const { access_token } = await this.getNewToken();
        localStorage.setItem("access_token", access_token);
        const data2 = await apiCall(access_token);
        if (isSpotifyError(data2)) {
          return apiCleanup(data2);
        } else {
          return data2 as UserPlaylists;
        }
      } else {
        return apiCleanup(data1);
      }
    } else {
      return data1 as UserPlaylists;
    }
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
}
