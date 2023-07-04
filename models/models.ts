import { LinkType } from "@/util/enums";

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
  userId: string;
  name: string;
  description: string;
  imageUrls: string[];
  palette: string[];
  tags: string[];
  links: Link[];
  playlists: string[];
  shared: boolean;
}

export interface UserInfo {
  _id: string;
  userId: string;
  spotifyAccount: string;
  projectIds: string[];
}
