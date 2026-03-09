"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/types";

export function useSearch(posts: Pick<Post, "slug" | "title" | "excerpt" | "tags">[], query: string): Pick<Post, "slug" | "title" | "excerpt" | "tags">[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter((p) => {
      const title = p.title.toLowerCase();
      const excerpt = (p.excerpt ?? "").toLowerCase();
      const tags = p.tags.join(" ").toLowerCase();
      return title.includes(q) || excerpt.includes(q) || tags.includes(q);
    });
  }, [posts, query]);
}
