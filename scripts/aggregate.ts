/**
 * Daily AI News Aggregation Script
 *
 * Run: npx tsx scripts/aggregate.ts
 *
 * 1. Fetch all sources in parallel
 * 2. Deduplicate across sources
 * 3. Sort by date descending
 * 4. Write today's JSON + update index.json
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { NewsItem } from "../src/lib/types";
import { SOURCES, type SourceDef } from "./sources";

// Dynamic import because rss-parser is ESM and tsx handles it fine,
// but we need to be explicit about the import style
async function main() {
  const { fetchAllSources } = await import("./fetcher");
  const { deduplicate } = await import("./dedupe");

  const today = new Date().toISOString().slice(0, 10);
  console.log(`=== AI News Aggregator ===`);
  console.log(`Date: ${today}`);
  console.log(`Sources: ${SOURCES.length}`);
  console.log(``);

  // Step 1: Fetch all sources
  console.log(`[1/4] Fetching ${SOURCES.length} sources...`);
  const allItems = await fetchAllSources(SOURCES);
  console.log(`  Total fetched: ${allItems.length} items\n`);

  // Step 2: Deduplicate
  console.log(`[2/4] Deduplicating...`);
  const deduped = deduplicate(allItems);
  console.log(`  After dedup: ${deduped.length} items\n`);

  // Step 3: Sort by date (newest first), then by source priority
  console.log(`[3/4] Sorting and enriching...`);
  const sourceOrder = new Map(SOURCES.map((s, i) => [s.id, i]));

  deduped.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    const ao = sourceOrder.get(a.source) ?? 99;
    const bo = sourceOrder.get(b.source) ?? 99;
    return ao - bo;
  });

  // Assign stable IDs
  const todayItems: NewsItem[] = [];
  const enriched: NewsItem[] = [];

  for (const item of deduped) {
    if (item.date === today) {
      todayItems.push(item);
    }
    enriched.push(item);
  }

  console.log(`  Today items: ${todayItems.length}`);
  console.log(`  Total enriched: ${enriched.length}\n`);

  // Step 5: Write files
  console.log(`[5/5] Writing files...`);

  const dataDir = join(process.cwd(), "public", "data");
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  // Write today's file
  const todayPath = join(dataDir, `${today}.json`);
  writeFileSync(todayPath, JSON.stringify(todayItems, null, 2), "utf-8");
  console.log(`  ✓ Wrote ${todayPath} (${todayItems.length} items)`);

  // Update index.json (keep last 30 days)
  const indexPath = join(dataDir, "index.json");
  let existingIndex: NewsItem[] = [];
  if (existsSync(indexPath)) {
    try {
      existingIndex = JSON.parse(readFileSync(indexPath, "utf-8"));
    } catch {
      existingIndex = [];
    }
  }

  // Merge: remove old today's items, prepend new ones
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const filtered = existingIndex.filter(
    (item) => item.date >= cutoffStr && item.date !== today
  );

  const merged = [...enriched.filter((i) => i.date === today), ...filtered];

  writeFileSync(indexPath, JSON.stringify(merged, null, 2), "utf-8");
  console.log(`  ✓ Wrote ${indexPath} (${merged.length} items, 30-day window)`);

  // Summary
  console.log(`\n=== Done ===`);
  console.log(`  Today: ${todayItems.length} news items`);
  console.log(`  Index: ${merged.length} total items`);
}

main().catch((err) => {
  console.error("Aggregation failed:", err);
  process.exit(1);
});
