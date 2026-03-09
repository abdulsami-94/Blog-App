import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "My Blog";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
