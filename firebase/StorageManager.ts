import { storage } from "@/config/firebase";
import { ImageData, ImageUpload } from "@/models/models";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { uid } from "uid";
import { ImageManager } from "./ImageManager";

export class StorageManager {
  static uploadImages = async (imgs: ImageUpload[], userId: string) => {
    try {
      const responses = await Promise.all(
        imgs.map((img) => this.uploadSingleImg(img, userId))
      );
      if (responses.some((res) => res === undefined)) return;
      return responses as ImageData[];
    } catch (err) {
      console.log(err);
    }
  };

  static uploadSingleImg = async (
    img: ImageUpload,
    userId: string
  ): Promise<ImageData | undefined> => {
    try {
      const imgElement = await ImageManager.loadImage(img.file);
      const palette = await ImageManager.getImgColors(imgElement);
      const id = uid();
      const storageRef = ref(storage, `${userId}/${id}`);
      await uploadBytes(storageRef, img.file);
      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl, _id: id, colors: palette };
    } catch (err) {
      console.log(err);
    }
  };

  static removeImg = async (imgId: string, userId: string) => {
    try {
      const storageRef = ref(storage, `${userId}/${imgId}`);
      await deleteObject(storageRef);
    } catch (err) {
      console.log(err);
    }
  };
}
