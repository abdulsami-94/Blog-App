"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/blog/SearchBar";
import type { Post } from "@/types";

export function SearchTrigger(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Pick<Post, "slug" | "title" | "excerpt" | "tags">[]>([]);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSearch]);

  useEffect(() => {
    if (!open || posts.length > 0) return;
    fetch("/api/search")
      .then((res) => res.json())
      .then((json: { success?: boolean; data?: Pick<Post, "slug" | "title" | "excerpt" | "tags">[] }) => {
        if (json.success && Array.isArray(json.data)) setPosts(json.data);
      })
      .catch(() => {});
  }, [open, posts.length]);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Search (Ctrl+K)"
      >
        <Search className="h-5 w-5" aria-hidden />
      </button>
      <SearchBar posts={posts} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
