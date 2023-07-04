import { SpotifyAccess, SpotifyRefresh } from "./interfaces";

export class SpotifyManager {
  static getUserInfo = async (token: string) => {
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
