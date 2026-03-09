"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Comment } from "@/types";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

export interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (data: { content: string; parentId?: string | null | undefined }) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
}

function nestComments(flat: Comment[]): Comment[] {
  const byId = new Map<string, Comment>();
  flat.forEach((c) => byId.set(c.id, { ...c, replies: [] }));
  const roots: Comment[] = [];
  flat.forEach((c) => {
    const comment = byId.get(c.id)!;
    if (!c.parentId) {
      roots.push(comment);
    } else {
      const parent = byId.get(c.parentId);
      if (parent) {
        parent.replies = parent.replies ?? [];
        parent.replies.push(comment);
      } else {
        roots.push(comment);
      }
    }
  });
  return roots;
}

export function CommentSection({ postId, comments, onAddComment, onDeleteComment }: CommentSectionProps): JSX.Element {
  const router = useRouter();
  const { data: session, status } = useSession();
  const nested = nestComments(comments);

  const handleAdd = async (data: { content: string; parentId?: string | null | undefined }): Promise<void> => {
    await onAddComment(data);
    router.refresh();
  };

  const handleDelete = async (id: string): Promise<void> => {
    await onDeleteComment(id);
    router.refresh();
  };

  return (
    <section data-comments className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-700">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Comments</h2>
      {status === "authenticated" ? (
        <div className="mb-8">
          <CommentForm
            postId={postId}
            onSubmit={handleAdd}
          />
        </div>
      ) : (
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
      <div className="space-y-6">
        {nested.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No comments yet.</p>
        ) : (
          nested.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={session?.user?.id}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
