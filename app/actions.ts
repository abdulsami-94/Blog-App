"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentSchema, newsletterSchema, postSchema } from "@/lib/validations";
import { slugify, readingTime, wordCount } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function createComment(postId: string, data: { content: string; parentId: string | null }): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  const parsed = commentSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input." };
  try {
    await db.comment.create({
      data: {
        content: parsed.data.content,
        authorId: session.user.id,
        postId,
        parentId: parsed.data.parentId ?? null,
      },
    });
    revalidatePath(`/blog/[slug]`, "page");
    return {};
  } catch {
    return { error: "Failed to create comment." };
  }
}

export async function deleteComment(commentId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await db.comment.deleteMany({ where: { id: commentId, authorId: session.user.id } });
    revalidatePath("/blog/[slug]", "page");
    return {};
  } catch {
    return { error: "Failed to delete comment." };
  }
}

export async function subscribeNewsletter(email: string): Promise<{ error?: string }> {
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) return { error: "Invalid email." };
  try {
    await db.newsletter.create({ data: { email: parsed.data.email } });
    return {};
  } catch (e) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002" ? "This email is already subscribed." : "Failed to subscribe.";
    return { error: msg };
  }
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  tagNames: string[];
}): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  const parsed = postSchema.safeParse({
    ...data,
    coverImage: data.coverImage || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().formErrors[0] ?? "Validation failed." };
  try {
    const tagNames = [...new Set(parsed.data.tagNames.filter(Boolean))];
    const tags = await Promise.all(
      tagNames.map((name) => db.tag.upsert({ where: { name }, create: { name }, update: {} }))
    );
    const now = parsed.data.published ? new Date() : null;
    await db.post.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage || null,
        published: parsed.data.published,
        authorId: session.user.id,
        publishedAt: now,
        tags: { connect: tags.map((t) => ({ id: t.id })) },
      },
    });
    revalidatePath("/blog");
    revalidatePath("/dashboard/posts");
    return {};
  } catch {
    return { error: "Failed to create post." };
  }
}

export async function updatePost(
  postId: string,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    published: boolean;
    tagNames: string[];
  }
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  const parsed = postSchema.safeParse({
    ...data,
    coverImage: data.coverImage || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().formErrors[0] ?? "Validation failed." };
  try {
    const existing = await db.post.findFirst({ where: { id: postId, authorId: session.user.id } });
    if (!existing) return { error: "Post not found." };
    const tagNames = [...new Set(parsed.data.tagNames.filter(Boolean))];
    const tags = await Promise.all(
      tagNames.map((name) => db.tag.upsert({ where: { name }, create: { name }, update: {} }))
    );
    const updateData: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      coverImage: string | null;
      published: boolean;
      publishedAt: Date | null;
      tags: { set: { id: string }[] };
    } = {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      published: parsed.data.published,
      publishedAt: existing.publishedAt ?? (parsed.data.published ? new Date() : null),
      tags: { set: tags.map((t) => ({ id: t.id })) },
    };
    if (existing.published && !parsed.data.published) updateData.publishedAt = existing.publishedAt;
    await db.post.update({
      where: { id: postId },
      data: updateData,
    });
    revalidatePath("/blog");
    revalidatePath("/dashboard/posts");
    revalidatePath(`/blog/${parsed.data.slug}`);
    return {};
  } catch {
    return { error: "Failed to update post." };
  }
}

export async function deletePost(postId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await db.post.deleteMany({ where: { id: postId, authorId: session.user.id } });
    revalidatePath("/blog");
    revalidatePath("/dashboard/posts");
    return {};
  } catch {
    return { error: "Failed to delete post." };
  }
}

export async function generateSlugFromTitle(title: string): Promise<string> {
  return slugify(title) || "untitled";
}
