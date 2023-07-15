import { clientId, redirectUri, scope } from "@/util/constants";
import { NextApiRequest, NextApiResponse } from "next";

const generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = generateRandomString(16);

  const query = new URLSearchParams({
    response_type: "code",
    client_id: clientId as string,
    scope: scope,
    redirect_uri: redirectUri as string,
    state: state,
    show_dialog: "true",
  });

  res.writeHead(302, {
    Location: "https://accounts.spotify.com/authorize/?" + query.toString(),
  });
  res.end();
}
