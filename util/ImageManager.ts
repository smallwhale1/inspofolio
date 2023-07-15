import { extractColors } from "extract-colors";

export class ImageManager {
  static loadImages = async (imageFiles: File[]) => {
    try {
      const imageElements = await Promise.all(
        imageFiles.map((file) => this.loadImage(file))
      );
      return imageElements;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  static getImgColors = async (img: HTMLImageElement) => {
    const colors = await extractColors(img);
    return colors;
  };

  static loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);

      const url = URL.createObjectURL(file);
      img.src = url;
    });
  };
}
