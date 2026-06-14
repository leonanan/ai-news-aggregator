import type { SourceId, Category } from "../src/lib/types";

export interface SourceDef {
  id: SourceId;
  name: string;
  nameCN: string;
  url: string;
  feedUrl: string;
  type: "rss" | "scrape";
  language: "zh" | "en";
  defaultCategory: Category;
}

export const SOURCES: SourceDef[] = [
  // ── Chinese Sources ──
  {
    id: "jiqizhixin",
    name: "机器之心",
    nameCN: "机器之心",
    url: "https://jiqizhixin.com",
    feedUrl: "https://www.jiqizhixin.com/rss",
    type: "rss",
    language: "zh",
    defaultCategory: "行业动态",
  },
  {
    id: "liangziwei",
    name: "量子位",
    nameCN: "量子位",
    url: "https://www.qbitai.com",
    feedUrl: "https://www.qbitai.com/feed",
    type: "rss",
    language: "zh",
    defaultCategory: "行业动态",
  },
  {
    id: "36kr-ai",
    name: "36Kr AI",
    nameCN: "36氪",
    url: "https://36kr.com",
    feedUrl: "https://36kr.com/feed",
    type: "rss",
    language: "zh",
    defaultCategory: "行业动态",
  },
  {
    id: "huxiu-ai",
    name: "虎嗅 AI",
    nameCN: "虎嗅",
    url: "https://www.huxiu.com",
    feedUrl: "https://www.huxiu.com/rss/0.xml",
    type: "rss",
    language: "zh",
    defaultCategory: "行业动态",
  },
  {
    id: "leiphone-ai",
    name: "雷锋网 AI",
    nameCN: "雷锋网",
    url: "https://www.leiphone.com",
    feedUrl: "https://www.leiphone.com/feed",
    type: "rss",
    language: "zh",
    defaultCategory: "AI应用",
  },

  // ── English Sources ──
  {
    id: "hackernews",
    name: "Hacker News",
    nameCN: "HN",
    url: "https://news.ycombinator.com",
    feedUrl:
      "https://hnrss.org/frontpage?q=ai+OR+ml+OR+llm+OR+gpt+OR+openai+OR+anthropic+OR+gemini",
    type: "rss",
    language: "en",
    defaultCategory: "行业动态",
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    nameCN: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
    type: "rss",
    language: "en",
    defaultCategory: "行业动态",
  },
  {
    id: "theverge-ai",
    name: "The Verge AI",
    nameCN: "The Verge",
    url: "https://www.theverge.com/ai-artificial-intelligence",
    feedUrl:
      "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    type: "rss",
    language: "en",
    defaultCategory: "行业动态",
  },
  {
    id: "arxiv-cs-ai",
    name: "ArXiv CS.AI",
    nameCN: "ArXiv",
    url: "https://arxiv.org",
    feedUrl: "https://rss.arxiv.org/rss/cs.AI",
    type: "rss",
    language: "en",
    defaultCategory: "研究论文",
  },
  {
    id: "reddit-ml",
    name: "r/MachineLearning",
    nameCN: "Reddit ML",
    url: "https://reddit.com/r/MachineLearning",
    feedUrl: "https://www.reddit.com/r/MachineLearning/.rss",
    type: "rss",
    language: "en",
    defaultCategory: "研究论文",
  },
  {
    id: "venturebeat-ai",
    name: "VentureBeat AI",
    nameCN: "VentureBeat",
    url: "https://venturebeat.com/category/ai/",
    feedUrl: "https://venturebeat.com/category/ai/feed/",
    type: "rss",
    language: "en",
    defaultCategory: "行业动态",
  },
];
