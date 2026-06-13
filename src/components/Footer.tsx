export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        <p className="mb-1">
          🤖 <span className="font-medium text-foreground">AI Daily</span> — 每日AI前沿新闻汇总
        </p>
        <p className="mb-2">
          数据来源：机器之心 · 量子位 · 36氪 · 虎嗅 · 雷锋网 · Hacker News · TechCrunch · The Verge · ArXiv · Reddit · VentureBeat
        </p>
        <p>
          通过 GitHub Actions 每日自动更新 ·{" "}
          <span className="text-muted-foreground/60">
            Built with Next.js · Deployed on Vercel
          </span>
        </p>
      </div>
    </footer>
  );
}
