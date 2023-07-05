import { db } from "@/config/firebase";
import { Link, Project } from "@/models/models";
import { CreateProject } from "@/util/interfaces";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { StorageManager } from "./StorageManager";
import { ImageManager } from "./ImageManager";

// the only difference between this and Project is _id
interface AddProject {
  uid: string;
  name: string;
  description: string;
  imageUrls: string[];
  tags: string[];
  links: Link[];
  playlists: string[];
  shared: boolean;
}

// TODO: Create demo projects for users
const DemoProject: CreateProject = {
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
      // extract palette
      const imgs = await ImageManager.loadImages(
        project.imgs.map((img) => img.file)
      );
      const promises = imgs.map((img) => ImageManager.getImgColors(img));
      const palettes = await Promise.all(promises);
      const palette = palettes.flat().slice(0, 10);

      // handle image uploads first
      const downloadUrls = await StorageManager.uploadImages(project.imgs, uid);
      if (!downloadUrls) return "Failed to upload images.";

      const newProject: AddProject = {
        uid,
        name: project.name,
        description: project.description,
        imageUrls: downloadUrls,
        tags: project.tags.map((tag) => tag.tag),
        links: project.links,
        playlists: [],
        shared: false,
      };

      const projectRef = await addDoc(collection(db, "projects"), {
        ...newProject,
        palette: palette,
      });

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
