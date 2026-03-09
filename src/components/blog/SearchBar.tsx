"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import type { Post } from "@/types";

export interface SearchBarProps {
  posts: Pick<Post, "slug" | "title" | "excerpt" | "tags">[];
  open: boolean;
  onClose: () => void;
}

export function SearchBar({ posts, open, onClose }: SearchBarProps): JSX.Element {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const results = useSearch(posts, debouncedQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  if (!open) return <div className="hidden" />;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-700">
          <Search className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search posts… (title, excerpt, tags)"
            className="flex-1 py-3 text-zinc-900 placeholder-zinc-500 focus:outline-none dark:bg-transparent dark:text-zinc-100"
            aria-label="Search"
            autoComplete="off"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {debouncedQuery.trim() === "" ? (
            <p className="py-4 text-center text-sm text-zinc-500">Type to search.</p>
          ) : results.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-500">No results.</p>
          ) : (
            <ul>
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={onClose}
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</span>
                    {post.excerpt ? (
                      <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">{post.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
