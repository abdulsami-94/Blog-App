import Link from "next/link";
import { getPublishedPosts, getTagCounts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { TagCloud } from "@/components/blog/TagCloud";
import { NewsletterSection } from "@/components/blog/NewsletterSection";

const FEATURED_COUNT = 1;
const RECENT_COUNT = 5;

export default async function HomePage(): Promise<JSX.Element> {
  const [posts, tagCounts] = await Promise.all([getPublishedPosts(), getTagCounts()]);
  const featured = posts.slice(0, FEATURED_COUNT);
  const recent = posts.slice(FEATURED_COUNT, FEATURED_COUNT + RECENT_COUNT);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          Welcome to the blog
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Thoughts, tutorials, and updates. Read the latest below or browse by tag.
        </p>
      </section>

      {featured[0] != null ? (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Featured</h2>
          <PostCard post={featured[0]} />
        </section>
      ) : null}

      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Recent posts</h2>
          <Link href="/blog" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View all
          </Link>
        </div>
        {recent.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">No posts yet.</p>
        )}
      </section>

      <section id="newsletter" className="mb-16">
        <NewsletterSection />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Popular tags</h2>
        <TagCloud tagCounts={tagCounts} />
      </section>
    </div>
  );
}
