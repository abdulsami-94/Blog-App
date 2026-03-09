"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Comment } from "@/types";
import { Button } from "@/components/ui/Button";

export interface CommentItemProps {
  comment: Comment;
  currentUserId?: string | null | undefined;
  onDelete?: ((id: string) => void) | undefined;
}

export function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps): JSX.Element {
  const canDelete = currentUserId != null && comment.author.id === currentUserId;

  return (
    <div className={comment.parentId ? "ml-6 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700" : ""}>
      <div className="flex items-start gap-3">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt=""
            width={40}
            height={40}
            className="rounded-full shrink-0"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
            {comment.author.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{comment.author.name}</span>
            <time dateTime={comment.createdAt} className="text-zinc-500 dark:text-zinc-400">
              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' HH:mm")}
            </time>
            {canDelete && onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-400"
                onClick={() => onDelete(comment.id)}
                aria-label="Delete comment"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            ) : null}
          </div>
          <p className="mt-0.5 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{comment.content}</p>
        </div>
      </div>
      {comment.replies?.length ? (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
