import { db } from "@/config/firebase";
import { Link, Project } from "@/models/models";
import { CreateProject } from "@/util/interfaces";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { StorageManager } from "./StorageManager";

// the only difference between this and Project is _id
interface AddProject {
  uid: string;
  name: string;
  description: string;
  imageUrls: string[];
  palette: string[];
  tags: string[];
  links: Link[];
  playlists: string[];
  shared: boolean;
}

export class ProjectsManager {
  static addProject = async (project: CreateProject, uid: string) => {
    try {
      // handle image uploads first
      const downloadUrls = await StorageManager.uploadImages(project.imgs, uid);
      if (!downloadUrls) return;

      const newProject: AddProject = {
        uid,
        name: project.name,
        description: project.description,
        // placeholder before handling image upload
        imageUrls: downloadUrls,
        palette: project.palette,
        tags: project.tags.map((tag) => tag.tag),
        links: project.links,
        playlists: [],
        shared: false,
      };

      const projectRef = await addDoc(collection(db, "projects"), newProject);
      return {
        ...newProject,
        _id: projectRef.id,
        createdAt: new Date(),
      } as Project;
    } catch (err) {
      console.log(err);
    }
  };

  static getProjects = async (uid: string): Promise<Project[]> => {
    console.log("hi");
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    const projectsSnapshot = await getDocs(q);
    const projects: Project[] = projectsSnapshot.docs.map(
      (doc) => ({ ...doc.data(), _id: doc.id } as Project)
    );
    return projects;
  };
}
