import { SetStateAction } from "react";
import { ListManager } from "./ListManager";
import { LinkManager } from "./LinkManager";
import { CreateProject } from "@/models/models";

/**
 * Handles client-side management of project assets (pre-database interaction).
 */
export class CreateManager {
  /**
   * Adds new images to the project.
   * @param acceptedFiles image files to add
   * @param setProject state setter for the project
   */
  static addImgs = (
    acceptedFiles: File[],
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      imgs: [
        ...prev.imgs,
        ...acceptedFiles.map((file) => ({
          _id: ListManager.getNewId(),
          file,
          colors: [],
          previewUrl: URL.createObjectURL(file),
        })),
      ],
    }));
  };

  /**
   * @param id Image to remove
   * @param setProject state setter for the project
   */
  static removeImg = (
    id: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      imgs: prev.imgs.filter((img) => img._id !== id),
    }));
  };

  /**
   * Adds a new link to the project.
   * @param newLink new link to add
   * @param setProject state setter for the project
   * @param linkTitle title of the link
   */
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
          _id: ListManager.getNewId(),
          url: newLink.trim(),
          title: linkTitle !== "" ? linkTitle : "Untitled Link",
          type: LinkManager.extractLinkType(newLink),
        },
      ],
    }));
  };

  /**
   * Removes a link from the project.
   * @param id id of the link to remove
   * @param setProject state setter for the project
   */
  static removeLink = (
    id: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link._id !== id),
    }));
  };

  /**
   * Adds a new tag to the project
   * @param newTag new tag to add
   * @param setProject state setter for the project
   */
  static addTag = (
    newTag: string,
    setProject: (value: SetStateAction<CreateProject>) => void
  ) => {
    setProject((prev) => ({
      ...prev,
      tags: [
        ...prev.tags,
        {
          _id: ListManager.getNewId(),
          tag: newTag,
        },
      ],
    }));
  };

  /**
   * Removes a tag from the project.
   * @param id id of the tag to remove
   * @param setProject state setter for the project
   */
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
