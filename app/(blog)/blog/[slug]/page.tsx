import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts, incrementPostViews } from "@/lib/posts";
import { getCommentsForPost } from "@/lib/comments";
import { serializeMdx } from "@/lib/mdx";
import { createComment, deleteComment } from "@/app/actions";
import { PostHeader } from "@/components/blog/PostHeader";
import { PostBody } from "@/components/blog/PostBody";
import { TableOfContents, extractTocFromContent } from "@/components/blog/TableOfContents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { CommentSection } from "@/components/comments/CommentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { APP_URL } from "@/lib/utils";
import type { Metadata } from "next";

export interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const ogUrl = `${APP_URL}/api/og?title=${encodeURIComponent(post.title)}`;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PostPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const postId = post.id;

  const [mdxSource, comments] = await Promise.all([
    serializeMdx(post.content),
    getCommentsForPost(postId),
  ]);
  await incrementPostViews(slug);

  const toc = extractTocFromContent(post.content);

  async function handleAddComment(data: { content: string; parentId?: string | null | undefined }): Promise<void> {
    const result = await createComment(postId, { content: data.content, parentId: data.parentId ?? null });
    if (result.error) throw new Error(result.error);
  }
  async function handleDeleteComment(id: string): Promise<void> {
    const result = await deleteComment(id);
    if (result.error) throw new Error(result.error);
  }

  const related = await getRelatedPosts(postId, post.tags, 5);

  return (
    <>
      <ReadingProgress />
      <JsonLd post={post} />
      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            {post.coverImage ? (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
            <PostHeader post={post} />
            <div className="prose-wrapper">
              <PostBody source={mdxSource} />
            </div>
            <div className="mt-8 flex items-center justify-between">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
            {post.author.bio ? (
              <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/50">
                <div className="flex items-start gap-4">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xl font-medium dark:bg-zinc-700">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <Link href={`/blog?author=${post.author.id}`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
                      {post.author.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <RelatedPosts posts={related} />
            <CommentSection
              postId={postId}
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
          {toc.length > 0 ? (
            <aside className="no-print w-full shrink-0 lg:w-56">
              <TableOfContents items={toc} />
            </aside>
          ) : null}
        </div>
      </article>
    </>
  );
}
