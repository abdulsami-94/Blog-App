import Link from "next/link";
import { format } from "date-fns";
import type { Post } from "@/types";

export interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps): JSX.Element {
  if (posts.length === 0) return <div data-related className="mt-12" />;

  return (
    <aside data-related className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-700">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Related posts</h2>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="block text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span className="font-medium">{post.title}</span>
              <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-500">
                {format(new Date(post.publishedAt), "MMM d, yyyy")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
