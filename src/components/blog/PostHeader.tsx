import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/Badge";

export interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps): JSX.Element {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <Link href={`/blog?author=${post.author.id}`} className="flex items-center gap-2 hover:underline">
          {post.author.image ? (
            <Image src={post.author.image} alt="" width={32} height={32} className="rounded-full" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium dark:bg-zinc-700">
              {post.author.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-medium">{post.author.name}</span>
        </Link>
        <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</time>
        <span className="flex items-center gap-1" aria-label={`${post.readingTime} min read`}>
          <Clock className="h-4 w-4" aria-hidden />
          {post.readingTime} min read
        </span>
        {post.views > 0 ? <span>{post.views} views</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
            <Badge variant="secondary">{tag}</Badge>
          </Link>
        ))}
      </div>
    </header>
  );
}
