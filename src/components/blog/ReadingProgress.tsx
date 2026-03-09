"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgress(): JSX.Element {
  const progress = useReadingProgress();
  if (progress <= 0) return <div data-reading-progress className="h-0" aria-hidden />;
  return (
    <div
      data-reading-progress
      className="fixed left-0 right-0 top-0 z-50 h-1 bg-zinc-200 dark:bg-zinc-700"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
