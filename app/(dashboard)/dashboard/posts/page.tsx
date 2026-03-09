import Link from "next/link";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Manage posts",
  description: "Create and manage your posts",
};

export default async function DashboardPostsPage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) return <div>Not authenticated.</div>;

  const posts = await db.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { tags: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Posts</h1>
        <Link href="/dashboard/posts/new">
          <Button>New post</Button>
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Views</th>
              <th className="pb-2 font-medium">Updated</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-3">
                  <Link href={`/blog/${post.slug}`} className="font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </Link>
                </td>
                <td className="py-3">
                  <span className={post.published ? "text-green-600 dark:text-green-400" : "text-zinc-500"}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-3">{post.views}</td>
                <td className="py-3 text-zinc-500 dark:text-zinc-400">{format(post.updatedAt, "MMM d, yyyy")}</td>
                <td className="py-3">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="text-blue-600 hover:underline dark:text-blue-400">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? (
          <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">No posts yet. Create your first post.</p>
        ) : null}
      </div>
    </div>
  );
}
