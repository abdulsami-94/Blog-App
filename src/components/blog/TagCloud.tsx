import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TagCloudProps {
  tagCounts: { name: string; count: number }[];
  className?: string;
}

export function TagCloud({ tagCounts, className }: TagCloudProps): JSX.Element {
  if (tagCounts.length === 0) return <div className={className} />;

  const maxCount = Math.max(...tagCounts.map((t) => t.count), 1);

  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900", className)}>
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map(({ name, count }) => {
          const scale = 0.75 + (count / maxCount) * 0.5;
          return (
            <Link
              key={name}
              href={`/tag/${encodeURIComponent(name)}`}
              className="rounded-full bg-zinc-200 px-3 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              style={{ fontSize: `${scale}rem` }}
            >
              {name} ({count})
            </Link>
          );
        })}
      </div>
    </div>
  );
}
