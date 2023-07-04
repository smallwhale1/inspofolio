// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import queryString from "querystring";
import { SpotifyInterface } from "@/util/interfaces";

type APIError = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyInterface | string>
) {
  const redirect_uri = "http://localhost:3000/api/spotifyCallback";
  const { code } = req.query;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: queryString.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios(authOptions);
    const data = response.data;
    const accessToken = data.access_token;
    console.log(response.data);

    return res.status(200).json(response.data as SpotifyInterface);
  } catch (err) {
    console.log(err);
    return res.status(500).json("An unexpected error occured");
  }
}
