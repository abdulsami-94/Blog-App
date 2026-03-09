import { Suspense } from "react";
import { getPostsPaginated, getTagCounts } from "@/lib/posts";
import { PostList } from "@/components/blog/PostList";
import { Sidebar } from "@/components/layout/Sidebar";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";

const PER_PAGE = 9;

export interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<{ title: string; description: string }> {
  const params = await searchParams;
  const tag = params.tag;
  return {
    title: tag ? `Posts tagged "${tag}"` : "Blog",
    description: tag ? `All posts tagged with ${tag}.` : "Browse all blog posts.",
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const tag = params.tag ?? undefined;
  const sort = (params.sort as "latest" | "oldest" | "views") ?? "latest";

  const result = await getPostsPaginated({
    page,
    perPage: PER_PAGE,
    ...(tag !== undefined ? { tag } : {}),
    sort,
  });
  const tagCounts = await getTagCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <Suspense fallback={<BlogPageSkeleton />}>
            <PostList posts={result.data} />
          </Suspense>
          <Pagination
            basePath="/blog"
            page={page}
            totalPages={result.totalPages}
            searchParams={{ ...(tag ? { tag } : {}), ...(sort !== "latest" ? { sort } : {}) }}
          />
        </div>
        <Sidebar tagCounts={tagCounts} />
      </div>
    </div>
  );
}

function BlogPageSkeleton(): JSX.Element {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
