import { storage } from "@/config/firebase";
import { ImageData } from "@/models/models";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uid } from "uid";

export class StorageManager {
  static uploadImages = async (imgs: ImageData[], userId: string) => {
    try {
      const responses = await Promise.all(
        imgs.map((img) => this.uploadSingleImg(img, userId))
      );
      return responses;
    } catch (err) {
      console.log(err);
    }
  };

  static uploadSingleImg = async (img: ImageData, userId: string) => {
    const storageRef = ref(storage, `${userId}/${uid()}`);
    const snapshot = await uploadBytes(storageRef, img.file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };
}
