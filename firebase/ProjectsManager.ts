import { db } from "@/config/firebase";
import { ImageData, ImageUpload, Link, Project, Tag } from "@/models/models";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { StorageManager } from "./StorageManager";
import { FinalColor } from "extract-colors";

export interface CreateProject {
  name: string;
  description: string;
  imgs: ImageUpload[];
  palette: string[];
  links: Link[];
  tags: Tag[];
}

// the only difference between this and Project is _id
interface AddProject {
  uid: string;
  name: string;
  description: string;
  palette: FinalColor[];
  imgs: ImageData[];
  tags: Tag[];
  links: Link[];
  playlist: string[];
  shared: boolean;
}

// TODO: Create demo projects for users
const demoProject: CreateProject = {
  name: "Food studies (Demo Project)",
  description: "A demo project for a project focused on food studies",
  imgs: [],
  palette: [],
  links: [],
  tags: [],
};

export class ProjectsManager {
  static addProject = async (project: CreateProject, uid: string) => {
    try {
      // handle image uploads first
      const storedImgs = await StorageManager.uploadImages(project.imgs, uid);
      if (!storedImgs) return "Failed to upload images.";

      const newProject: AddProject = {
        uid,
        name: project.name,
        description: project.description,
        imgs: storedImgs,
        palette: storedImgs.map((img) => img.colors).flat(),
        tags: project.tags,
        links: project.links,
        playlist: [],
        shared: false,
      };

      const projectRef = await addDoc(collection(db, "projects"), newProject);

      return {
        ...newProject,
        _id: projectRef.id,
        createdAt: new Date(),
      } as Project;
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
      return "An unknown error occured.";
    }
  };

  static updateProject = async (
    id: string,
    key: keyof Project,
    newContent: any
  ) => {
    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        [key]: newContent,
      });
    } catch (err) {
      console.log(err);
    }
  };

  static updateImages = async (
    oldProject: Project,
    imgs: ImageUpload[],
    userId: string
  ): Promise<string | ImageData[]> => {
    const storedImgs = await StorageManager.uploadImages(imgs, userId);
    if (!storedImgs) return "Failed to upload images.";
    const imgsRes = await this.updateProject(oldProject._id, "imgs", [
      ...oldProject.imgs,
      ...storedImgs,
    ]);
    const paletteRes = await this.updateProject(
      oldProject._id,
      "palette",
      Array.from(
        new Set([
          ...oldProject.palette,
          ...storedImgs.map((img) => img.colors).flat(),
        ] as FinalColor[])
      )
    );
    return storedImgs;
  };

  static getProjects = async (uid: string): Promise<Project[]> => {
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    const projectsSnapshot = await getDocs(q);
    const projects: Project[] = projectsSnapshot.docs.map(
      (doc) => ({ ...doc.data(), _id: doc.id } as Project)
    );
    return projects;
  };

  static getProject = async (id: string): Promise<Project | string> => {
    try {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...docSnap.data(), _id: docSnap.id } as Project;
      } else {
        return "Doc does not exist.";
      }
    } catch (err) {
      console.log(err);
      return "Error.";
    }
  };

  static removeProject = async (id: string): Promise<void | string> => {
    try {
      const docRef = doc(db, "projects", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
      return "Error.";
    }
  };

  static userHasProject = async (uid: string): Promise<boolean> => {
    const q = query(
      collection(db, "projects"),
      where("uid", "==", uid),
      limit(1)
    );
    const projectsSnapshot = await getDocs(q);
    if (projectsSnapshot.docs.length > 0) {
      return true;
    }
    return false;
  };
}
