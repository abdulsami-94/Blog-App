import { NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/posts";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const perPage = Math.min(20, Math.max(1, parseInt(searchParams.get("perPage") ?? "9", 10)));
    const tag = searchParams.get("tag") ?? undefined;
    const sort = (searchParams.get("sort") as "latest" | "oldest" | "views") ?? "latest";
    const result = await getPostsPaginated({ page, perPage, tag: tag ?? undefined, sort });
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch posts." }, { status: 500 });
  }
}
