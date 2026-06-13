import { Suspense } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import type { NewsItem } from "@/lib/types";
import { HomeClient } from "@/components/HomeClient";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

function loadInitialData(): NewsItem[] {
  try {
    const dataPath = join(process.cwd(), "public", "data", "index.json");
    const raw = readFileSync(dataPath, "utf-8");
    return JSON.parse(raw) as NewsItem[];
  } catch {
    return [];
  }
}

export default function Home() {
  const initialData = loadInitialData();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">加载中...</div>
        </div>
      }
    >
      <HomeClient initialData={initialData} today={today} />
      <Footer />
    </Suspense>
  );
}
