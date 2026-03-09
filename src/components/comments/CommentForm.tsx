"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSubmit: (data: CommentInput) => Promise<void>;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onSubmit, onCancel }: CommentFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "", parentId: parentId ?? null },
  });

  const handleFormSubmit = async (data: CommentInput): Promise<void> => {
    await onSubmit({ content: data.content, parentId: data.parentId ?? null });
    reset({ content: "", parentId: parentId ?? null });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div>
        <label htmlFor="comment-content" className="sr-only">
          Comment
        </label>
        <textarea
          id="comment-content"
          {...register("content")}
          rows={3}
          placeholder="Write a comment…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
          aria-invalid={errors.content ? true : undefined}
        />
        {errors.content ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.content.message}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          Post comment
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
