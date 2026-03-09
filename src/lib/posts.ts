import { cache } from "react";
import { db } from "@/lib/db";
import type { Post, Author, PaginatedResponse } from "@/types";
import { readingTime, wordCount } from "@/lib/utils";

function mapUserToAuthor(user: { id: string; name: string | null; email: string; image: string | null; bio: string | null }): Author {
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    image: user.image,
    bio: user.bio,
  };
}

function mapDbPostToPost(
  p: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
    views: number;
    publishedAt: Date | null;
    updatedAt: Date;
    author: { id: string; name: string | null; email: string; image: string | null; bio: string | null };
    tags: { name: string }[];
  }
): Post {
  const words = wordCount(p.content);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage ?? "",
    author: mapUserToAuthor(p.author),
    tags: p.tags.map((t) => t.name),
    publishedAt: p.publishedAt?.toISOString() ?? "",
    updatedAt: p.updatedAt.toISOString(),
    readingTime: readingTime(words),
    published: p.published,
    views: p.views,
  };
}

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const list = await db.post.findMany({
    where: { published: true },
    include: { author: true, tags: true },
    orderBy: { publishedAt: "desc" },
  });
  return list.map(mapDbPostToPost);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const p = await db.post.findUnique({
    where: { slug, published: true },
    include: { author: true, tags: true },
  });
  return p ? mapDbPostToPost(p) : null;
});

export const getPostBySlugForDashboard = cache(async (slug: string, authorId: string): Promise<Post | null> => {
  const p = await db.post.findFirst({
    where: { slug, authorId },
    include: { author: true, tags: true },
  });
  return p ? mapDbPostToPost(p) : null;
});

export const getPostsPaginated = cache(
  async (opts: {
    page: number;
    perPage: number;
    tag?: string | undefined;
    sort?: "latest" | "oldest" | "views" | undefined;
  }): Promise<PaginatedResponse<Post>> => {
    const { page, perPage, tag, sort = "latest" } = opts;
    const where: { published: boolean; tags?: { some: { name: string } } } = { published: true };
    if (tag) {
      where.tags = { some: { name: tag } };
    }
    const orderBy =
      sort === "oldest"
        ? { publishedAt: "asc" as const }
        : sort === "views"
          ? { views: "desc" as const }
          : { publishedAt: "desc" as const };

    const [data, total] = await Promise.all([
      db.post.findMany({
        where,
        include: { author: true, tags: true },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.post.count({ where }),
    ]);

    return {
      data: data.map(mapDbPostToPost),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }
);

export const getTagCounts = cache(async (): Promise<{ name: string; count: number }[]> => {
  const tags = await db.tag.findMany({
    include: { _count: { select: { posts: true } } },
  });
  return tags.map((t) => ({ name: t.name, count: t._count.posts })).filter((t) => t.count > 0);
});

export const getRelatedPosts = cache(async (postId: string, tagNames: string[], limit: number): Promise<Post[]> => {
  if (tagNames.length === 0) return [];
  const list = await db.post.findMany({
    where: {
      id: { not: postId },
      published: true,
      tags: { some: { name: { in: tagNames } } },
    },
    include: { author: true, tags: true },
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
  return list.map(mapDbPostToPost);
});

export async function incrementPostViews(slug: string): Promise<void> {
  await db.post.updateMany({ where: { slug }, data: { views: { increment: 1 } } });
}
