"use client";

import type { NewsItem } from "@/lib/types";
import { NewsCard } from "./NewsCard";

export function ArchiveClient({ data }: { data: NewsItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
