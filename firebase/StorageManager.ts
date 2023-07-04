import { storage } from "@/config/firebase";
import { ImageData } from "@/models/models";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uid } from "uid";

export class StorageManager {
  static uploadImages = async (imgs: ImageData[], userId: string) => {
    try {
      let downloadUrls: string[] = [];
      for (const img of imgs) {
        const storageRef = ref(storage, `${userId}/${uid()}`);
        const snapshot = await uploadBytes(storageRef, img.file);
        const fullPath = storageRef.fullPath;
        console.log(fullPath);
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);
        downloadUrls.push(downloadUrl);
      }
      return downloadUrls;
    } catch (err) {
      console.log(err);
    }
  };
}
