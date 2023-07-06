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
  playlist: string[];
  createdAt: Date;
  shared: boolean;
}

export interface UserInfo {
  _id: string;
  uid: string;
  spotifyAccount: string;
  projectIds: string[];
}
