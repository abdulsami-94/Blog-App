"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { APP_NAME } from "@/lib/utils";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/login", label: "Log in" },
];

export interface MobileMenuProps {
  sessionUser?: { name?: string | null; image?: string | null } | null;
}

export function MobileMenu({ sessionUser }: MobileMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const links = sessionUser ? [...navLinks.filter((l) => l.href !== "/login"), { href: "/dashboard", label: "Dashboard" }] : navLinks;

  return (
    <div className="flex items-center gap-2 md:hidden">
      <ThemeToggle />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>
      {open ? (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full mt-2 flex flex-col gap-2 border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <Link href="/" className="font-semibold" onClick={() => setOpen(false)}>
            {APP_NAME}
          </Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-zinc-600 dark:text-zinc-400 hover:underline" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
