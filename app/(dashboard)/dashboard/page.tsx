import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = {
  title: "Dashboard",
  description: "Author dashboard",
};

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) return <div>Not authenticated.</div>;

  const [postCount, publishedCount] = await Promise.all([
    db.post.count({ where: { authorId: session.user.id } }),
    db.post.count({ where: { authorId: session.user.id, published: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Welcome back, {session.user.name ?? session.user.email}.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/posts"
          className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Posts</h2>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{postCount}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{publishedCount} published</p>
        </Link>
      </div>
      <div className="mt-6">
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New post
        </Link>
      </div>
    </div>
  );
}
