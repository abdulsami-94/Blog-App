import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user) return <div>{children}</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-8 flex gap-4 border-b border-zinc-200 dark:border-zinc-700" aria-label="Dashboard">
        <Link
          href="/dashboard"
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Overview
        </Link>
        <Link
          href="/dashboard/posts"
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Posts
        </Link>
        <Link
          href="/dashboard/profile"
          className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Profile
        </Link>
      </nav>
      {children}
    </div>
  );
}
