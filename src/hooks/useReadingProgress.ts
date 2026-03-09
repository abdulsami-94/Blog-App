"use client";

import { useState, useEffect } from "react";

export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress(): void {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = window.scrollY;
      setProgress(Math.min(100, (scrolled / scrollHeight) * 100));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return progress;
}
