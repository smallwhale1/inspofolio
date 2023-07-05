import { LinkType } from "./enums";

export class LinkManager {
  static extractLinkType = (url: string): LinkType => {
    if (url.trim().includes("pinterest")) {
      return LinkType.PINTEREST;
    } else if (url.trim().includes("instagram")) {
      return LinkType.INSTAGRAM;
    } else if (url.trim().includes("twitter")) {
      return LinkType.TWITTER;
    } else if (url.trim().includes("youtube")) {
      return LinkType.YOUTUBE;
    } else if (url.trim().includes("tiktok")) {
      return LinkType.TIKTOK;
      // non-embed
    } else if (url.trim().includes("artstation")) {
      return LinkType.ARTSTATION;
    } else if (url.trim().includes("figma")) {
      return LinkType.FIGMA;
    } else {
      return LinkType.OTHER;
    }
  };

  // TODO: More robust regex based validation

  static validInstagramEmbed = (url: string): boolean => {
    return url.trim().startsWith("https://www.instagram.com/p/");
  };

  static validPinterestEmbed = (url: string): boolean => {
    return url.trim().startsWith("https://www.pinterest.com/pin/");
  };

  static validYoutubeEmbed = (url: string): boolean => {
    return url.trim().startsWith("https://www.youtube.com/watch?v=");
  };

  static validTiktokEmbed = (url: string): boolean => {
    const cleaned = url.trim();
    return (
      cleaned.startsWith("https://www.tiktok.com/") &&
      cleaned.includes("/video/")
    );
  };

  static validTwitterEmbed = (url: string): boolean => {
    const cleaned = url.trim();
    return (
      cleaned.startsWith("https://twitter.com") && cleaned.includes("/status/")
    );
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
