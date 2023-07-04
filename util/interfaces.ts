import { ImageData, Link, Tag } from "@/models/models";

export type ListItemType = {
  _id: string;
} & Record<string, any>;

export interface CreateProject {
  name: string;
  description: string;
  imgs: ImageData[];
  palette: string[];
  links: Link[];
  tags: Tag[];
}

export interface SpotifyAccess {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyRefresh {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}
