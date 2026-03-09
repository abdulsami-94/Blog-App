import type { Post } from "@/types";
import { PostCard } from "./PostCard";

export interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps): JSX.Element {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-600 dark:text-zinc-400">No posts found.</p>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Blog posts">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
