import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";

export async function GET(): Promise<NextResponse> {
  try {
    const posts = await getPublishedPosts();
    const data = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags,
    }));
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to search." }, { status: 500 });
  }
}
