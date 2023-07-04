import { LinkType } from "@/util/enums";
import { Timestamp } from "firebase/firestore";

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
  file: File;
  previewUrl: string;
}

export interface Palette {}

// main
export interface Project {
  _id: string;
  uid: string;
  name: string;
  description: string;
  imageUrls: string[];
  palette: string[];
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
