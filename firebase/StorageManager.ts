import { storage } from "@/config/firebase";
import { ImageData, ImageUpload } from "@/models/models";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { uid } from "uid";
import { ImageManager } from "../util/ImageManager";
import { ErrorResponse, SuccessResponse } from "@/util/errorHandling";

export class StorageManager {
  static uploadImages = async (imgs: ImageUpload[], userId: string) => {
    try {
      const responses = await Promise.all(
        imgs.map((img) => this.uploadSingleImgResized(img, userId))
      );
      if (responses.some((res) => res === undefined)) return;
      return responses as ImageData[];
    } catch (err) {
      console.log(err);
    }
  };

  static uploadSingleImgResized = async (
    img: ImageUpload,
    userId: string
  ): Promise<ImageData | undefined> => {
    const file = img.file;
    // Read the uploaded image file
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // Convert the image to a blob asynchronously
    const loadImage = (fileReader: FileReader) =>
      new Promise<Blob | null>((resolve) => {
        fileReader.onload = (loadEvent) => {
          const image = new Image();
          image.src = loadEvent.target?.result as string;
          image.onload = () => {
            const canvas = document.createElement("canvas");
            const maxWidth = 640;
            // under max size
            if (image.width <= maxWidth) {
              resolve(null);
            }
            const scaleFactor = maxWidth / image.width;
            const newWidth = image.width * scaleFactor;
            const newHeight = image.height * scaleFactor;

            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(image, 0, 0, newWidth, newHeight);

            canvas.toBlob(
              (resizedBlob) => {
                resolve(resizedBlob);
              },
              file.type || "image/jpeg",
              0.92
            ); // Use the original file type if available, or use JPEG with 92% quality
          };
        };
      });

    try {
      const blob = await loadImage(reader);
      if (!blob) {
        const id = uid();
        const storageRef = ref(storage, `${userId}/${id}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        return { url: downloadUrl, _id: id, colors: [] };
      }
      // Upload the resized image to Firebase Storage
      const id = uid();
      const storageRef = ref(storage, `${userId}/${id}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl, _id: id, colors: [] };
    } catch (error) {
      console.error("Error uploading image:", error);
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

  static removeImg = async (
    imgId: string,
    userId: string
  ): Promise<SuccessResponse | ErrorResponse> => {
    try {
      const storageRef = ref(storage, `${userId}/${imgId}`);
      await deleteObject(storageRef);
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
}
