import { db } from "@/config/firebase";
import { Link, Project } from "@/models/models";
import { CreateProject } from "@/util/interfaces";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

// the only difference between this and Project is _id
interface AddProject {
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

export class ProjectsManager {
  static addProject = async (project: CreateProject, uid: string) => {
    const newProject: AddProject = {
      userId: uid,
      name: project.name,
      description: project.description,
      // placeholder before handling image upload
      imageUrls: project.imgs.map((img) => img.file.name),
      palette: project.palette,
      tags: project.tags.map((tag) => tag.tag),
      links: project.links,
      playlists: [],
      shared: false,
    };

    const projectRef = await addDoc(collection(db, "projects"), newProject);
    return projectRef;
  };

  static getProjects = async (uid: string): Promise<Project[]> => {
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    const projectsSnapshot = await getDocs(q);
    const projects: Project[] = projectsSnapshot.docs.map(
      (doc) => ({ ...doc.data(), _id: doc.id } as Project)
    );
    return projects;
  };
}
