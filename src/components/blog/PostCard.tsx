import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";

export interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps): JSX.Element {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.coverImage ? (
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800" />
        )}
      </Link>
      <CardContent className="p-4">
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold text-zinc-900 line-clamp-2 hover:underline dark:text-zinc-100">
            {post.title}
          </h2>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.slice(0, 4).map((tag) => (
            <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="text-xs">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          {post.author.image ? (
            <Image src={post.author.image} alt="" width={24} height={24} className="rounded-full" />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium dark:bg-zinc-700">
              {post.author.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{post.author.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), "MMM d, yyyy")}</time>
          <span className="flex items-center gap-0.5" aria-label={`${post.readingTime} min read`}>
            <Clock className="h-4 w-4" aria-hidden />
            {post.readingTime} min
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
