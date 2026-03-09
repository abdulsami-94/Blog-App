import Link from "next/link";
import { auth } from "@/lib/auth";
import { APP_NAME } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { SearchTrigger } from "./SearchTrigger";

export async function Header(): Promise<JSX.Element> {
  const session = await auth();

  return (
    <header data-header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          <Link href="/blog" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Blog
          </Link>
          <SearchTrigger />
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" width={32} height={32} />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                    {(session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{session.user.name ?? "User"}</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Log in
            </Link>
          )}
          <ThemeToggle />
        </nav>
        <MobileMenu sessionUser={session?.user ?? null} />
      </div>
    </header>
  );
}
