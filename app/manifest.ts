import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} Wholesale`,
    short_name: "Kavara",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#17120e",
    theme_color: "#17120e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
