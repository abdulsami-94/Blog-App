import { cache } from "react";
import { db } from "@/lib/db";
import type { Comment, Author } from "@/types";

function mapUserToAuthor(user: { id: string; name: string | null; email: string; image: string | null; bio: string | null }): Author {
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    image: user.image,
    bio: user.bio,
  };
}

export const getCommentsForPost = cache(async (postId: string): Promise<Comment[]> => {
  const list = await db.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
  return list.map((c) => ({
    id: c.id,
    content: c.content,
    author: mapUserToAuthor(c.author),
    postId: c.postId,
    createdAt: c.createdAt.toISOString(),
    parentId: c.parentId,
    replies: [],
  }));
});
