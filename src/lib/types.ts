export type Category =
  | "大模型"
  | "AI应用"
  | "研究论文"
  | "行业动态"
  | "开源工具"
  | "政策伦理";

export type Language = "zh" | "en";

export type SourceId =
  | "jiqizhixin"
  | "liangziwei"
  | "36kr-ai"
  | "huxiu-ai"
  | "leiphone-ai"
  | "hackernews"
  | "techcrunch-ai"
  | "theverge-ai"
  | "arxiv-cs-ai"
  | "reddit-ml"
  | "venturebeat-ai";

export interface NewsItem {
  id: string;
  title: string;
  title_cn?: string;
  summary?: string;
  source: SourceId;
  sourceName: string;
  url: string;
  date: string; // "2026-06-13"
  category: Category;
  language: Language;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  大模型: "🧠 大模型",
  AI应用: "🚀 AI应用",
  研究论文: "📄 研究论文",
  行业动态: "📰 行业动态",
  开源工具: "🛠 开源工具",
  政策伦理: "⚖️ 政策伦理",
};

export const SOURCE_ICONS: Record<SourceId, string> = {
  jiqizhixin: "🤖",
  liangziwei: "🔮",
  "36kr-ai": "🦾",
  "huxiu-ai": "🐯",
  "leiphone-ai": "⚡",
  hackernews: "🔶",
  "techcrunch-ai": "📱",
  "theverge-ai": "📡",
  "arxiv-cs-ai": "📐",
  "reddit-ml": "🔬",
  "venturebeat-ai": "💼",
};
