import Fuse from "fuse.js";
import type { NewsItem } from "./types";

let fuseInstance: Fuse<NewsItem> | null = null;
let dataCache: NewsItem[] | null = null;

export async function loadAllNews(): Promise<NewsItem[]> {
  if (dataCache) return dataCache;
  const res = await fetch("/data/index.json");
  if (!res.ok) throw new Error("Failed to load news data");
  dataCache = (await res.json()) as NewsItem[];
  fuseInstance = new Fuse(dataCache, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "title_cn", weight: 0.3 },
      { name: "summary", weight: 0.2 },
      { name: "sourceName", weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });
  return dataCache;
}

export function searchNews(query: string, data?: NewsItem[]): NewsItem[] {
  const items = data ?? dataCache ?? [];
  if (!query.trim() || !fuseInstance) return items;

  // Rebuild fuse if data was provided externally
  if (data && data !== dataCache) {
    const tmpFuse = new Fuse(data, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "title_cn", weight: 0.3 },
        { name: "summary", weight: 0.2 },
        { name: "sourceName", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
    return tmpFuse.search(query.trim()).map((r) => r.item);
  }

  return fuseInstance.search(query.trim()).map((r) => r.item);
}
