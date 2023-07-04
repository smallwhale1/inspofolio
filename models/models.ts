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

export interface ImageData {
  _id: string;
  colors: string[];
  file: File;
  previewUrl: string;
}

// main
export interface Project {
  _id: string;
  uid: string;
  name: string;
  description: string;
  imageUrls: string[];
  palette: FinalColor[];
  tags: string[];
  links: Link[];
  playlists: string[];
  createdAt: Date;
  shared: boolean;
}

export interface UserInfo {
  _id: string;
  uid: string;
  spotifyAccount: string;
  projectIds: string[];
}
