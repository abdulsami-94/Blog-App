import Link from "next/link";
import { APP_NAME, APP_URL } from "@/lib/utils";

const currentYear = new Date().getFullYear();

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {APP_NAME}
            </Link>
            <nav aria-label="Footer">
              <ul className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href={`${APP_URL}/#newsletter`} className="hover:text-zinc-900 dark:hover:text-zinc-100">
                    Newsletter
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
