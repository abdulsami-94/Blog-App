"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps): JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0% -80% 0%" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return <div className={className} />;

  return (
    <nav aria-label="Table of contents" className={cn("sticky top-24", className)}>
      <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">On this page</h3>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block py-0.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                activeId === item.id && "font-medium text-zinc-900 dark:text-zinc-100"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function extractTocFromContent(htmlOrMdx: string): TocItem[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(htmlOrMdx)) !== null) {
    const level = match[0]?.match(/^#+/)?.at(0)?.length ?? 0;
    const text = (match[1] ?? "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}
