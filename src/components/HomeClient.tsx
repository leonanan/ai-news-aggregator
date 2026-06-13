"use client";

import { Suspense } from "react";
import type { NewsItem } from "@/lib/types";
import { Header } from "./Header";
import { NewsList } from "./NewsList";

interface Props {
  initialData: NewsItem[];
  today: string;
}

export function HomeClient({ initialData, today }: Props) {
  return (
    <>
      <Suspense fallback={<div className="h-[88px] border-b border-border" />}>
        <Header />
      </Suspense>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            🤖 AI 每日前沿
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {today} · 中英文AI新闻汇总 · 每日更新
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-3 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <NewsList initialData={initialData} />
        </Suspense>
      </main>
    </>
  );
}
