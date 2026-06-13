import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        页面不存在
      </h1>
      <p className="text-muted-foreground mb-6">
        你找的页面可能已被移除，或链接地址有误
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}
