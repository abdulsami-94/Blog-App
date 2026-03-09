"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">We couldn’t complete your request. Please try again.</p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
