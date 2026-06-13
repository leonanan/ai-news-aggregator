"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { NewsItem, Category } from "@/lib/types";
import { loadAllNews, searchNews } from "@/lib/search";
import { NewsCard } from "./NewsCard";

const PAGE_SIZE = 15;

interface Props {
  initialData: NewsItem[];
}

export function NewsList({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<NewsItem[]>(initialData);

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") as Category | null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  // Load full data on mount if not already loaded
  useEffect(() => {
    loadAllNews().then(setData).catch(() => {
      // If fetch fails, keep using initialData
    });
  }, []);

  // Filter and search
  const filtered = useMemo(() => {
    let items = data;

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (query) {
      items = searchNews(query, items);
    }

    return items;
  }, [data, category, query]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const updatePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }
      router.push(`/?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, searchParams]
  );

  return (
    <div>
      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        {query || category ? (
          <>
            找到 <span className="font-medium text-foreground">{filtered.length}</span> 条结果
            {(query || category) && (
              <span>
                （
                {query && <span>搜索: &quot;{query}&quot;</span>}
                {query && category && <span> · </span>}
                {category && <span>分类: {category}</span>}
                ）
              </span>
            )}
          </>
        ) : (
          <>
            共 <span className="font-medium text-foreground">{filtered.length}</span> 条新闻
          </>
        )}
      </p>

      {/* News cards */}
      {paged.length > 0 ? (
        <div className="flex flex-col gap-3">
          {paged.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">没有找到匹配的新闻</p>
          <p className="text-sm text-muted-foreground mt-1">试试换个搜索词或清除筛选条件</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <button
            onClick={() => updatePage(safePage - 1)}
            disabled={safePage <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updatePage(p)}
              className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                p === safePage
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => updatePage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
