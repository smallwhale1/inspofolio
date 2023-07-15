export const fadeDuration = 0.7;
export const navbarLogoSize = "1rem";

// spotify
export const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
export const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const scope =
  "streaming app-remote-control " +
  "user-read-private user-read-email " +
  "playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative " +
  "user-top-read user-read-recently-played " +
  "user-library-modify user-library-read user-library-modify " +
  "user-modify-playback-state user-read-currently-playing user-read-playback-state";
