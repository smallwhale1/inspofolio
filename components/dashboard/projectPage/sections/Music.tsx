import { Project } from "@/models/models";
import { useEffect, useState } from "react";
import { SpotifyManager } from "@/util/SpotifyManager";
import { useRouter } from "next/router";
import LoadingButton from "@/components/common/LoadingButton";
import { BsSpotify } from "react-icons/bs";
import FoldingBoxesLoader from "@/components/common/animation/FoldingBoxesLoader";

type Props = {
  project: Project;
};

interface SpotifyUser {
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
const Music = ({ project }: Props) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const getUser = async () => {
      setLoading(true);
      const user = await SpotifyManager.getUserInfo(token);
      console.log(user);
      if (typeof user === "string") {
        // error
        router.push(`/linkSpotify`);
      } else {
        setLoggedIn(true);
        const spotifyUser = user as SpotifyUser;
        setUser(spotifyUser);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <div>
      {loading && <FoldingBoxesLoader />}
      {!loading &&
        (loggedIn ? (
          <div>
            <h2>{user?.display_name}</h2>
            <h3>{user?.email}</h3>
          </div>
        ) : (
          <LoadingButton
            color="secondary"
            icon={<BsSpotify color="#00c56c" size={20} />}
            text="connect to spotify"
            onSubmit={() => {
              router.push(`/linkSpotify?createdProject=${project._id}`);
            }}
            loading={false}
          />
        ))}
    </div>
  );
};

export default Music;
