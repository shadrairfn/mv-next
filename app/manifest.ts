import type { MetadataRoute } from "next";
import { siteName, siteTitle, themeColor } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteTitle,
    short_name: siteName,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeColor,
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
