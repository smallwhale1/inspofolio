import { db } from "@/config/firebase";
import {
  CreateProject,
  AddProject,
  ImageData,
  ImageUpload,
  Project,
} from "@/models/models";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { StorageManager } from "./StorageManager";
import { FinalColor } from "extract-colors";
import {
  ErrorResponse,
  SuccessResponse,
  isErrorRes,
} from "@/util/errorHandling";

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
  static addProject = async (
    project: CreateProject,
    uid: string
  ): Promise<ErrorResponse | Project> => {
    try {
      // handle image uploads first
      const storedImgs = await StorageManager.uploadImages(project.imgs, uid);
      if (!storedImgs)
        return {
          status: "error",
          message: "Failed to upload images.",
        };

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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const projectRef = await addDoc(collection(db, "projects"), newProject);

      return {
        ...newProject,
        _id: projectRef.id,
      } as Project;
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static updateProject = async (
    id: string,
    key: keyof Project,
    newContent: any
  ): Promise<SuccessResponse | ErrorResponse> => {
    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        [key]: newContent,
        updatedAt: new Date(),
      });
      return {
        status: "success",
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static updateImages = async (
    oldProject: Project,
    imgs: ImageUpload[],
    userId: string
  ): Promise<ErrorResponse | ImageData[]> => {
    const storedImgs = await StorageManager.uploadImages(imgs, userId);
    if (!storedImgs)
      return { status: "error", message: "Failed to upload images." };
    const imgsRes = await this.updateProject(oldProject._id, "imgs", [
      ...oldProject.imgs,
      ...storedImgs,
    ]);
    if (isErrorRes(imgsRes)) {
      return { status: "error", message: imgsRes.message };
    }
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
    if (isErrorRes(paletteRes)) {
      return { status: "error", message: paletteRes.message };
    }
    return storedImgs;
  };

  static getProjects = async (
    uid: string
  ): Promise<Project[] | ErrorResponse> => {
    try {
      const q = query(
        collection(db, "projects"),
        where("uid", "==", uid),
        orderBy("updatedAt", "desc")
      );
      const projectsSnapshot = await getDocs(q);
      const projects: Project[] = projectsSnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            _id: doc.id,
            createdAt: (doc.data().createdAt as Timestamp).toDate(),
            updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
          } as Project)
      );
      return projects;
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static getProject = async (id: string): Promise<Project | ErrorResponse> => {
    try {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), _id: docSnap.id } as Project;
      } else {
        return { status: "error", message: "Project does not exist." };
      }
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static removeProject = async (
    project: Project,
    userId: string
  ): Promise<SuccessResponse | ErrorResponse> => {
    try {
      await Promise.all(
        project.imgs.map((img) => StorageManager.removeImg(img._id, userId))
      );
      const docRef = doc(db, "projects", project._id);
      await deleteDoc(docRef);
      localStorage.removeItem("projects");
      return {
        status: "success",
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
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
