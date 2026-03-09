import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditPostForm } from "@/components/dashboard/EditPostForm";

export interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<{ title: string }> {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Edit" };
  const post = await db.post.findFirst({ where: { id, authorId: session.user.id } });
  return { title: post ? `Edit: ${post.title}` : "Edit" };
}

export default async function EditPostPage({ params }: EditPostPageProps): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) return <div>Not authenticated.</div>;

  const { id } = await params;
  const post = await db.post.findFirst({
    where: { id, authorId: session.user.id },
    include: { tags: true },
  });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit post</h1>
      <EditPostForm
        postId={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          published: post.published,
          tagNames: post.tags.map((t) => t.name),
        }}
      />
    </div>
  );
}
