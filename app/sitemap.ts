import type { MetadataRoute } from "next";
import { guides } from "./guides";
import { tools } from "./tools";

const siteUrl = (process.env.SITE_URL || "https://barocalc.co.kr").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/guides", "/about", "/terms", "/privacy"];
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
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
