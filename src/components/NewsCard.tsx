import type { NewsItem, Category, SourceId } from "@/lib/types";
import { SOURCE_ICONS, CATEGORY_LABELS } from "@/lib/types";

export function NewsCard({ item }: { item: NewsItem }) {
  const sourceIcon = SOURCE_ICONS[item.source];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card block p-4 rounded-xl bg-card border border-border hover:bg-card-hover transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Source icon */}
        <span className="text-xl mt-0.5 shrink-0" title={item.sourceName}>
          {sourceIcon}
        </span>

        <div className="flex-1 min-w-0">
          {/* Category + Date + Source */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.sourceName}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {item.date}
            </span>
          </div>

          {/* Chinese title (for English articles) */}
          {item.title_cn && (
            <h3 className="text-base font-semibold leading-snug text-foreground mb-1">
              {item.title_cn}
            </h3>
          )}

          {/* Original title */}
          <p
            className={`leading-snug mb-1 ${
              item.title_cn
                ? "text-sm text-muted-foreground"
                : "text-base font-semibold text-foreground"
            }`}
            lang={item.language === "zh" ? "zh-CN" : "en"}
          >
            {item.title}
          </p>

          {/* Summary */}
          {item.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {item.summary}
            </p>
          )}

          {/* Language badge */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                item.language === "zh"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
            >
              {item.language === "zh" ? "中文" : "EN"}
            </span>

            <svg
              className="w-3.5 h-3.5 text-muted-foreground opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}
