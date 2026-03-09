"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "blog-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

export function useTheme(): { theme: Theme; resolved: "light" | "dark"; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme(theme);
    setResolved(resolvedTheme);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") setResolved(getResolvedTheme("system"));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, t);
  }, []);

  return { theme, resolved, setTheme };
}
