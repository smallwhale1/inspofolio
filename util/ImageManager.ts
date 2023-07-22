import { extractColors } from "extract-colors";

// Manages the images in each project
export class ImageManager {
  // loads all images into img elements
  static loadImages = async (
    imageFiles: File[]
  ): Promise<HTMLImageElement[]> => {
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

  // loads a single img into an img element
  static loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);

      const url = URL.createObjectURL(file);
      img.src = url;
    });
  };

  // extracts a list of collors from an img element
  static getImgColors = async (img: HTMLImageElement) => {
    const colors = await extractColors(img);
    return colors;
  };
}
