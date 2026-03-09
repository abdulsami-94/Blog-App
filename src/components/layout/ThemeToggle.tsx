"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";

export function ThemeToggle(): JSX.Element {
  const { resolved, setTheme } = useTheme();

  const cycle = (): void => {
    setTheme(resolved === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="h-9 w-9 p-0"
    >
      {resolved === "dark" ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </Button>
  );
}
