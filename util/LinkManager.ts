import { LinkType } from "./enums";

export class LinkManager {
  static extractLinkType = (url: string): LinkType => {
    if (url.trim().toLowerCase().includes("pinterest")) {
      return LinkType.PINTEREST;
    } else if (url.includes("instagram")) {
      return LinkType.INSTAGRAM;
    } else if (url.includes("twitter")) {
      return LinkType.TWITTER;
    } else if (url.includes("youtube")) {
      return LinkType.YOUTUBE;
    } else {
      return LinkType.OTHER;
    }
  };

  static validInstagramEmbed = (url: string): boolean => {
    return false;
  };

  static validPinterestEmbed = (url: string): boolean => {
    return false;
  };

  static getPageTitle = (url: string) => {
    return fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const match = html.match(/<title[^>]*>([^<]*)/);
        if (match && match[1]) {
          return match[1];
        } else {
          return "Title Not Found";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        return "Error Retrieving Title";
      });
  };
}
