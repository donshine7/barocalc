import type { MetadataRoute } from "next";
import { tools } from "./tools";

const siteUrl = (process.env.SITE_URL || "https://barocalc-korea.donshine7.chatgpt.site").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/about", "/terms", "/privacy"];
  return [
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path ? "monthly" as const : "weekly" as const,
      priority: path ? 0.5 : 1,
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}${tool.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: tool.popular ? 0.9 : 0.7,
    })),
  ];
}
