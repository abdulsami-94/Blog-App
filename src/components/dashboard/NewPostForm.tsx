"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { postSchema } from "@/lib/validations";
import { createPost, generateSlugFromTitle } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const newPostFormSchema = postSchema.extend({
  tagNames: z.string().optional().default(""),
});

type NewPostFormData = z.infer<typeof newPostFormSchema>;

export function NewPostForm(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewPostFormData>({
    resolver: zodResolver(newPostFormSchema) as import("react-hook-form").Resolver<NewPostFormData>,
    defaultValues: { published: false, tagNames: "" },
  });
  const title = watch("title");
  const slug = watch("slug");

  const fillSlug = async (): Promise<void> => {
    if (!title) return;
    const s = await generateSlugFromTitle(title);
    setValue("slug", s);
  };

  const onSubmit = async (data: NewPostFormData): Promise<void> => {
    setServerError(null);
    const tagNames = (data.tagNames ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const result = await createPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      ...(data.coverImage !== undefined && data.coverImage !== "" ? { coverImage: data.coverImage } : {}),
      published: data.published,
      tagNames,
    });
    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push("/dashboard/posts");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      {serverError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {serverError}
        </p>
      ) : null}
      <Input label="Title" error={errors.title?.message} {...register("title")} onBlur={fillSlug} />
      <div>
        <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
        <button type="button" onClick={fillSlug} className="mt-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
          Generate from title
        </button>
      </div>
      <Input label="Excerpt" error={errors.excerpt?.message} {...register("excerpt")} />
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Content (Markdown)</label>
        <textarea
          {...register("content")}
          rows={16}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          aria-invalid={errors.content ? true : undefined}
        />
        {errors.content ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
        ) : null}
      </div>
      <Input label="Cover image URL (optional)" {...register("coverImage")} />
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("published")} id="published" className="h-4 w-4 rounded" />
        <label htmlFor="published" className="text-sm text-zinc-700 dark:text-zinc-300">
          Publish
        </label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tags (comma-separated)</label>
        <input
          {...register("tagNames")}
          placeholder="javascript, nextjs"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          Create post
        </Button>
        <Link href="/dashboard/posts">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
