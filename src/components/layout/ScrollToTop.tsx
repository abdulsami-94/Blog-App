"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

const THRESHOLD = 400;

export function ScrollToTop(): JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (): void => {
      setVisible(window.scrollY > THRESHOLD);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return <div className="fixed bottom-6 right-6 z-40" aria-hidden />;

  return (
    <Button
      variant="secondary"
      size="sm"
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg"
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </Button>
  );
}
