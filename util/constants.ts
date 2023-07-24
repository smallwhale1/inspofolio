export const fadeDuration = 0.7;
export const navbarLogoSize = "1rem";

// spotify api
export const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
export const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const scope =
  "user-read-private user-read-email " +
  "playlist-modify-private playlist-modify-public " +
  "user-top-read ";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
}
