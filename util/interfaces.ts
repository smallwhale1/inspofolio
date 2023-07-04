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
