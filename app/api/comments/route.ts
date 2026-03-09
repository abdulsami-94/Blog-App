import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentSchema } from "@/lib/validations";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = (await request.json()) as unknown;
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input." }, { status: 400 });
    }
    const { content, parentId } = parsed.data;
    const postId = (body as { postId?: string }).postId;
    if (typeof postId !== "string" || !postId) {
      return NextResponse.json({ success: false, error: "Post ID required." }, { status: 400 });
    }
    const comment = await db.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId,
        parentId: parentId ?? null,
      },
      include: { author: true },
    });
    return NextResponse.json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          email: comment.author.email,
          image: comment.author.image,
          bio: comment.author.bio,
        },
        postId: comment.postId,
        createdAt: comment.createdAt.toISOString(),
        parentId: comment.parentId,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create comment." }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Comment ID required." }, { status: 400 });
    }
    await db.comment.deleteMany({
      where: { id, authorId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete comment." }, { status: 500 });
  }
}
