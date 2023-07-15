import { FinalColor } from "extract-colors";

export class ColorManager {
  static simpleSort = (colors: FinalColor[]): FinalColor[] => {
    colors.sort((a, b) => {
      if (a.hue !== b.hue) {
        return b.hue - a.hue;
      } else {
        return b.saturation - a.saturation;
      }
    });
    return colors;
  };

  static sortColors(colors: FinalColor[]): FinalColor[] {
    // Convert color from RGB to CIELAB format
    const convertToLab = (color: FinalColor): number[] => {
      const r = color.red / 255;
      const g = color.green / 255;
      const b = color.blue / 255;

      const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
      const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

      const pivot = 0.008856;
      const factor = 903.3;

      const fx = x > pivot ? Math.cbrt(x) : (factor * x + 16) / 116;
      const fy = y > pivot ? Math.cbrt(y) : (factor * y + 16) / 116;
      const fz = z > pivot ? Math.cbrt(z) : (factor * z + 16) / 116;

      const L = 116 * fy - 16;
      const a = (fx - fy) * 500;
      const b1 = (fy - fz) * 200;

      return [L, a, b1];
    };

    // Sort colors using CIELAB distance for smooth transitions
    colors.sort((colorA, colorB) => {
      const labA = convertToLab(colorA);
      const labB = convertToLab(colorB);

      // Calculate Euclidean distance in CIELAB space
      const distanceA = Math.sqrt(
        Math.pow(labA[0] - labB[0], 2) +
          Math.pow(labA[1] - labB[1], 2) +
          Math.pow(labA[2] - labB[2], 2)
      );

      const distanceB = Math.sqrt(
        Math.pow(labB[0] - labA[0], 2) +
          Math.pow(labB[1] - labA[1], 2) +
          Math.pow(labB[2] - labA[2], 2)
      );

      return distanceA - distanceB; // Sort by CIELAB distance
    });

    return colors;
  }
}
