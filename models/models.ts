import { Track } from "@/util/SpotifyManager";
import { LinkType } from "@/util/enums";
import { FinalColor } from "extract-colors";

// sub interfaces
export interface Link {
  _id: string;
  url: string;
  title?: string;
  type: LinkType;
}

export interface Tag {
  _id: string;
  tag: string;
}

export interface ImageUpload {
  _id: string;
  file: File;
  previewUrl: string;
}

export interface ImageData {
  _id: string;
  colors: FinalColor[];
  url: string;
}

// main
export interface Project {
  _id: string;
  uid: string;
  name: string;
  description: string;
  imgs: ImageData[];
  links: Link[];
  palette: FinalColor[];
  tags: Tag[];
  // either a playlist id for authenticated users or a list of tracks for non-authenticated users
  playlist: Track[] | string;
  createdAt: Date;
  updatedAt: Date;
  shared: boolean;
}

export interface CreateProject {
  name: string;
  description: string;
  imgs: ImageUpload[];
  palette: string[];
  links: Link[];
  tags: Tag[];
}

// the only difference between this and Project is _id
export interface AddProject {
  uid: string;
  name: string;
  description: string;
  palette: FinalColor[];
  imgs: ImageData[];
  tags: Tag[];
  links: Link[];
  playlist: Track[];
  shared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  _id: string;
  uid: string;
  spotifyAccount: string;
  projectIds: string[];
}
