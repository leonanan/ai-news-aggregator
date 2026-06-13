"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategory = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) {
        params.set("category", cat);
      } else {
        params.delete("category");
      }
      params.delete("page");
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Top row: logo + search + theme */}
        <div className="flex items-center gap-3 mb-3">
          <a href="/" className="text-xl font-bold text-primary shrink-0 hover:opacity-80 transition-opacity">
            AI Daily
          </a>
          <SearchBar
            initialValue={searchParams.get("q") ?? ""}
            onSearch={handleSearch}
          />
          <ThemeToggle />
        </div>

        {/* Category pills */}
        <CategoryFilter
          active={searchParams.get("category")}
          onChange={handleCategory}
        />
      </div>
    </header>
  );
}
