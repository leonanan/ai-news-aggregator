import RssParser from "rss-parser";
import type { NewsItem, Category } from "../src/lib/types";
import type { SourceDef } from "./sources";

const parser = new RssParser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "AI-News-Aggregator/1.0 (news bot; contact@example.com)",
  },
});

// ── Category Classification ──
function classifyCategory(
  title: string,
  summary: string,
  sourceDefault: Category
): Category {
  const text = `${title} ${summary}`.toLowerCase();

  if (
    /gpt|claude|gemini|llama|deepseek|qwen|ernie|chatglm|yi-|mistral|mixtral|大模型|llm|foundation.model|base.model|基座模型|预训练|pre.?train/i.test(
      text
    )
  )
    return "大模型";

  if (
    /product|launch|app|应用|产品|release|shipping|发布|上线|推出|开放/i.test(
      text
    )
  )
    return "AI应用";

  if (
    /paper|arxiv|论文|research|neurips|icml|iclr|cvpr|emnlp|acl|conference|journal|study|实验|证明|提出一种|提出了一种/i.test(
      text
    )
  )
    return "研究论文";

  if (
    /funding|raised|series|融资|ipo|acquis|估值|投资|估值|b轮|c轮|billion|million/i.test(
      text
    )
  )
    return "行业动态";

  if (
    /open.source|github|framework|tool|库|工具|开源|hugging.face|pytorch|tensorflow|api|sdk|repo/i.test(
      text
    )
  )
    return "开源工具";

  if (
    /regulation|policy|ban|政策|监管|ethics|bias|伦理|安全|法案|law|compliance|隐私|privacy/i.test(
      text
    )
  )
    return "政策伦理";

  return sourceDefault;
}

// ── Slug Generator ──
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ── Main Fetch Function ──
export async function fetchSource(source: SourceDef): Promise<NewsItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  const items: NewsItem[] = [];

  try {
    const feed = await parser.parseURL(source.feedUrl);

    if (!feed.items || feed.items.length === 0) {
      console.warn(`[${source.id}] No items in feed`);
      return items;
    }

    for (const entry of feed.items) {
      // Skip items without a title or link
      if (!entry.title || !entry.link) continue;

      const title = entry.title.trim();
      const link = entry.link.trim();
      let summary = (entry.contentSnippet || entry.content || "")
        .trim();

      // Clean HackerNews-style summaries (remove Article/Comments URL lines)
      summary = summary
        .replace(/^Article URL:\s*https?:\/\/\S+/gm, "")
        .replace(/^Comments URL:\s*https?:\/\/\S+/gm, "")
        .replace(/^Points:\s*\d+/gm, "")
        .replace(/^# Comments:\s*\d+/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, 300);

      // Try to get date from feed
      let date = today;
      if (entry.pubDate) {
        try {
          date = new Date(entry.pubDate).toISOString().slice(0, 10);
        } catch {
          // keep today
        }
      } else if (entry.isoDate) {
        date = entry.isoDate.slice(0, 10);
      }

      const category = classifyCategory(title, summary, source.defaultCategory);

      const normalizedId = `${date}-${source.id}-${slug(title)}`;

      const newsItem: NewsItem = {
        id: normalizedId,
        title,
        summary: summary || undefined,
        source: source.id,
        sourceName: source.name,
        url: link,
        date,
        category,
        language: source.language,
      };

      // For English items, leave title_cn empty (can be enriched later)
      // For Chinese items, title_cn = title
      if (source.language === "zh") {
        newsItem.title_cn = title;
      }

      items.push(newsItem);
    }

    console.log(`[${source.id}] Fetched ${items.length} items`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${source.id}] Failed: ${message}`);
  }

  return items;
}

export async function fetchAllSources(
  sources: SourceDef[]
): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    sources.map((s) => fetchSource(s))
  );

  const allItems: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  return allItems;
}
