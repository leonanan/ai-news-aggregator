import type { NewsItem } from "../src/lib/types";

/**
 * Normalize a URL for comparison:
 * - Remove protocol (http/https)
 * - Remove www. prefix
 * - Remove trailing slash
 * - Remove UTM and tracking params
 * - Lowercase
 */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove tracking params
    const skipParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "ref",
      "referrer",
      "fbclid",
      "gclid",
    ];
    for (const p of skipParams) {
      u.searchParams.delete(p);
    }
    // Normalize
    let normalized = u.hostname.replace(/^www\./, "") + u.pathname + u.search;
    normalized = normalized.replace(/\/$/, "").toLowerCase();
    return normalized;
  } catch {
    return url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }
}

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity ratio (0-1) between two strings.
 * 1 = identical, 0 = completely different.
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const len = Math.max(a.length, b.length);
  if (len === 0) return 1;
  return 1 - levenshtein(a, b) / len;
}

/**
 * Extract a comparable title: lowercase, remove common prefixes/suffixes,
 * remove special characters.
 */
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[|｜\-–—:：].*$/, "") // Remove after separators
    .replace(/[^\w\s一-鿿]/g, "") // Remove special chars
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Deduplicate news items using a two-pass strategy:
 * 1. Exact URL match (after normalization)
 * 2. Fuzzy title match (>85% similarity on same date)
 *
 * When duplicates are found, keep the item with the longer summary.
 */
export function deduplicate(items: NewsItem[]): NewsItem[] {
  const seen = new Map<string, NewsItem>();
  const dedupLog: string[] = [];

  // Pass 1: URL-based dedup
  for (const item of items) {
    const normalized = normalizeUrl(item.url);
    const existing = seen.get(normalized);

    if (!existing) {
      seen.set(normalized, item);
    } else {
      // Keep the one with more complete metadata
      const existingScore =
        (existing.summary?.length ?? 0) + (existing.title_cn ? 50 : 0);
      const newScore =
        (item.summary?.length ?? 0) + (item.title_cn ? 50 : 0);

      if (newScore > existingScore) {
        seen.set(normalized, item);
        dedupLog.push(`URL dedup (replaced): ${existing.title} ← ${item.title}`);
      } else {
        dedupLog.push(`URL dedup (skipped): ${item.title}`);
      }
    }
  }

  // Pass 2: Title-based fuzzy dedup
  const remaining = Array.from(seen.values());
  const result: NewsItem[] = [];
  const titleUsed: string[] = [];

  for (const item of remaining) {
    const nt = normalizeTitle(item.title);
    let isDuplicate = false;

    for (let i = 0; i < titleUsed.length; i++) {
      const sim = similarity(nt, titleUsed[i]);
      // Only consider same-date items
      if (sim > 0.8 && result[i]?.date === item.date) {
        isDuplicate = true;
        // Keep the one with more info
        if (
          (item.summary?.length ?? 0) + (item.title_cn ? 50 : 0) >
          (result[i].summary?.length ?? 0) + (result[i].title_cn ? 50 : 0)
        ) {
          dedupLog.push(
            `Title dedup (replaced): ${result[i].title} ← ${item.title} (sim: ${sim.toFixed(2)})`
          );
          result[i] = item;
          titleUsed[i] = nt;
        } else {
          dedupLog.push(
            `Title dedup (skipped): ${item.title} ~ ${result[i].title} (sim: ${sim.toFixed(2)})`
          );
        }
        break;
      }
    }

    if (!isDuplicate) {
      result.push(item);
      titleUsed.push(nt);
    }
  }

  if (dedupLog.length > 0) {
    console.log(`\n[Dedupe] Removed ${dedupLog.length} duplicates:`);
    dedupLog.forEach((l) => console.log(`  ${l}`));
  }

  return result;
}
