"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  searchParams?: Record<string, string>;
}

export function Pagination({ basePath, page, totalPages, searchParams }: PaginationProps): JSX.Element {
  const params = new URLSearchParams(searchParams ?? {});

  function hrefFor(p: number): string {
    const q = new URLSearchParams(params);
    if (p <= 1) {
      q.delete("page");
    } else {
      q.set("page", String(p));
    }
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  if (totalPages <= 1) return <nav aria-label="Pagination" className="flex justify-center" />;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-8">
      <PaginationLink href={hrefFor(page - 1)} disabled={page <= 1} aria-label="Previous page">
        Previous
      </PaginationLink>
      <span className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <PaginationLink href={hrefFor(page + 1)} disabled={page >= totalPages} aria-label="Next page">
        Next
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  "aria-label": string;
}): JSX.Element {
  const className =
    "rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700";
  if (disabled) {
    return (
      <span className={cn(className, "cursor-not-allowed opacity-50")} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
