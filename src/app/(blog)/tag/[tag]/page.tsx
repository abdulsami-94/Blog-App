import { notFound } from "next/navigation";
import { getPostsPaginated, getTagCounts } from "@/lib/posts";
import { PostList } from "@/components/blog/PostList";
import { Sidebar } from "@/components/layout/Sidebar";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

const PER_PAGE = 9;

export interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `Tag: ${decoded}`,
    description: `All posts tagged with ${decoded}.`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps): Promise<JSX.Element> {
  const { tag } = await params;
  const tagDecoded = decodeURIComponent(tag);
  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10));

  const result = await getPostsPaginated({ page, perPage: PER_PAGE, tag: tagDecoded });
  const tagCounts = await getTagCounts();

  const tagExists = tagCounts.some((t) => t.name === tagDecoded);
  if (result.data.length === 0 && !tagExists) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Tag: <span className="text-blue-600 dark:text-blue-400">{tagDecoded}</span>
      </h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <PostList posts={result.data} />
          <Pagination
            basePath={`/tag/${tag}`}
            page={page}
            totalPages={result.totalPages}
          />
        </div>
        <Sidebar tagCounts={tagCounts} />
      </div>
    </div>
  );
}
