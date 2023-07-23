import { Track } from "@/util/SpotifyManager";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { SetStateAction, useEffect, useState } from "react";
import MusicAuthenticated from "./MusicAuthenticated";
import Music from "./Music";
import { Project } from "@/models/models";
import { ProjectsManager } from "@/firebase/ProjectsManager";

type Props = {
  project: Project;
  setProject: (value: SetStateAction<Project | null>) => void;
};

const MusicManager = ({ project, setProject }: Props) => {
  // client or authenticated
  const [musicType, setMusicType] = useState<
    "client" | { token: string } | null
  >(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  const handlePlaylistAddArray = async (track: Track) => {
    if (!project || typeof project.playlist === "string") return;
    // right now, only handling the list of tracks case
    if (project.playlist.some((t) => t.id === track.id)) return;
    await ProjectsManager.updateProject(project._id, "playlist", [
      ...project.playlist,
      track,
    ]);
    setProject({ ...project, playlist: [...project.playlist, track] });
  };

  const handlePlaylistRemoveArray = async (track: Track) => {
    if (!project || typeof project.playlist === "string") return;
    await ProjectsManager.updateProject(
      project._id,
      "playlist",
      project.playlist.filter((t) => t.id !== track.id)
    );
    setProject({
      ...project,
      playlist: project.playlist.filter((t) => t.id !== track.id),
    });
  };

  const changePlaylistToString = async (playlistId: string) => {
    await ProjectsManager.updateProject(project._id, "playlist", playlistId);
    setProject({ ...project, playlist: playlistId });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMusicType("client");
    } else {
      setMusicType({ token: token });
    }
    setLoading(false);
  }, []);
  return (
    <>
      {!loading && musicType !== null ? (
        musicType === "client" ? (
          <Music
            project={project}
            onAdd={handlePlaylistAddArray}
            onRemove={handlePlaylistRemoveArray}
          />
        ) : (
          <MusicAuthenticated
            token={musicType.token}
            project={project}
            changePlaylistType={changePlaylistToString}
          />
        )
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default MusicManager;
