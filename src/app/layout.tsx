import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Daily - 人工智能每日前沿",
    template: "%s | AI Daily",
  },
  description:
    "每日汇总AI前沿新闻，中英文双语来源。涵盖大模型、AI应用、研究论文、行业动态、开源工具、政策伦理。机器之心、量子位、36氪、TechCrunch、ArXiv等11个权威源。",
  keywords: [
    "AI",
    "人工智能",
    "AI新闻",
    "大模型",
    "机器学习",
    "深度学习",
    "AI Daily",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AI Daily - 人工智能每日前沿",
    description: "每日汇总AI前沿新闻，中英文双语，涵盖大模型、AI应用、研究论文",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
