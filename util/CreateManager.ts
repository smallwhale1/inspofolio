import { SetStateAction } from "react";
import { CreateProject } from "./interfaces";
import { ListManager } from "./ListManager";
import { LinkManager } from "./LinkManager";

export class CreateManager {
  static addImgs = (
    acceptedFiles: File[],
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      imgs: [
        ...prev.imgs,
        ...acceptedFiles.map((file, i) => ({
          _id: ListManager.getNewId(prev.imgs, i),
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ],
    }));
  };

  static removeImg = (
    id: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      imgs: prev.imgs.filter((img) => img._id !== id),
    }));
  };

  static addLink = (
    newLink: string,
    setProject: (value: SetStateAction<CreateProject>) => void,
    linkTitle: string
  ) => {
    setProject((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          _id: ListManager.getNewId(prev.links),
          url: newLink,
          title: linkTitle !== "" ? linkTitle : "Untitled Link",
          type: LinkManager.extractLinkType(newLink),
        },
      ],
    }));
  };

  static removeLink = (
    id: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link._id !== id),
    }));
  };

  static addTag = (
    newTag: string,
    project: CreateProject,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      tags: [
        ...prev.tags,
        {
          _id: ListManager.getNewId(prev.tags),
          tag: newTag,
        },
      ],
    }));
  };

  static removeTag = (
    id: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag._id !== id),
    }));
  };
}
