// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import queryString from "querystring";
import { SpotifyRefresh } from "@/util/SpotifyManager";

type APIError = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyRefresh | string>
) {
  const { refreshToken } = req.query;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: queryString.stringify({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    json: true,
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

    return res.status(200).json(response.data as SpotifyRefresh);
  } catch (err) {
    console.log(err);
    return res.status(500).json("An unexpected error occured");
  }
}
