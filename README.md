# 🤖 AI Daily — 人工智能每日前沿

每日自动汇总 AI 前沿新闻，中英文双语，11 个权威来源。

## 功能

- 📰 **每日新闻汇总** — 覆盖大模型、AI应用、研究论文、行业动态、开源工具、政策伦理
- 🌐 **中英文双语** — 机器之心、量子位、36氪、TechCrunch、ArXiv 等 11 个来源
- 🔍 **全文搜索** — 支持中英文关键词搜索
- 📂 **分类筛选** — 按主题类别快速过滤
- 📅 **历史存档** — 浏览任意历史日期的新闻

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **样式**: Tailwind CSS v4
- **搜索**: fuse.js (客户端)
- **数据抓取**: rss-parser
- **定时任务**: GitHub Actions (每日 08:30 北京时间)
- **部署**: Vercel

## 本地开发

```bash
npm install
npm run dev              # 开发服务器
npm run build            # 生产构建
npx tsx scripts/aggregate.ts  # 手动抓取新闻
```

## 项目结构

```
├── .github/workflows/    # GitHub Action 定时抓取
├── public/data/          # 新闻 JSON 数据
├── scripts/              # 抓取脚本
│   ├── aggregate.ts      # 主入口
│   ├── sources.ts        # 11个新闻源定义
│   ├── fetcher.ts        # RSS 抓取 + 解析
│   └── dedupe.ts         # 去重逻辑
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   └── lib/              # 类型 + 搜索
```

## 数据来源

| 中文源 | 英文源 |
|--------|--------|
| 机器之心 | Hacker News |
| 量子位 | TechCrunch AI |
| 36氪 | The Verge AI |
| 虎嗅 | Reddit r/ML |
| 雷锋网 | ArXiv CS.AI |
| | VentureBeat AI |

## License

MIT
