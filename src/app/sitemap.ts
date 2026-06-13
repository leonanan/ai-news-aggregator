import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL ?? "https://ai-daily.vercel.app";

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Add archive pages for existing daily files
  const dataDir = join(process.cwd(), "public", "data");
  if (existsSync(dataDir)) {
    const files = readdirSync(dataDir).filter((f) => f.match(/^\d{4}-\d{2}-\d{2}\.json$/));
    for (const file of files) {
      const date = file.replace(".json", "");
      entries.push({
        url: `${baseUrl}/${date}`,
        lastModified: new Date(date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
