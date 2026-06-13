"use client";

import type { Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const ALL_CATEGORIES: (Category | "全部")[] = [
  "全部",
  "大模型",
  "AI应用",
  "研究论文",
  "行业动态",
  "开源工具",
  "政策伦理",
];

interface Props {
  active: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="category-scroll overflow-x-auto">
      <div className="flex gap-1.5 min-w-max">
        {ALL_CATEGORIES.map((cat) => {
          const isActive =
            cat === "全部" ? !active : active === cat;
          const label = cat === "全部" ? "📋 全部" : CATEGORY_LABELS[cat as Category];

          return (
            <button
              key={cat}
              onClick={() => onChange(cat === "全部" ? null : cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
