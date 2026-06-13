import { Suspense } from "react";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { NewsItem } from "@/lib/types";
import { ArchiveClient } from "@/components/ArchiveClient";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ date: string }>;
}

function loadDateData(date: string): NewsItem[] | null {
  const dataPath = join(process.cwd(), "public", "data", `${date}.json`);
  if (!existsSync(dataPath)) return null;
  try {
    const raw = readFileSync(dataPath, "utf-8");
    return JSON.parse(raw) as NewsItem[];
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `AI Daily - ${date}`,
    description: `${date} AI前沿新闻汇总`,
  };
}

export default async function ArchivePage({ params }: Props) {
  const { date } = await params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const data = loadDateData(date);
  if (!data) {
    notFound();
  }

  // Calculate adjacent dates
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const prevStr = formatDate(prevDate);
  const nextStr = formatDate(nextDate);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">加载中...</div>
        </div>
      }
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold text-primary hover:opacity-80 transition-opacity"
            >
              ← AI Daily
            </Link>
            <span className="text-sm text-muted-foreground">历史存档</span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
          {/* Date heading with navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/${prevStr}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-muted"
            >
              ← {prevStr}
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">
                📅 {date}
              </h1>
              {date === today && (
                <span className="text-xs text-primary font-medium">今天</span>
              )}
            </div>

            {nextStr <= today ? (
              <Link
                href={`/${nextStr}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-muted"
              >
                {nextStr} →
              </Link>
            ) : (
              <div className="w-[100px]" />
            )}
          </div>

          {/* News list */}
          {data.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground">
                共 <span className="font-medium text-foreground">{data.length}</span> 条新闻
              </p>
            </div>
          ) : null}

          <ArchiveClient data={data} />
        </main>

        <footer className="border-t border-border mt-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
            <p>
              <Link href="/" className="text-primary hover:underline">
                ← 返回今日新闻
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
