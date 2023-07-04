import styles from "./AddMoodInfo.module.scss";

type Props = {};

interface PlaylistOpts {
  type: "stylized" | "realistic";
  theme: "light-hearted" | "serious";
  intensity: "chill" | "intense";
  genres: string[];
  //
}

const AddPlaylistOpts = (props: Props) => {
  return <div>AddMoodInfo</div>;
};

export default AddPlaylistOpts;
