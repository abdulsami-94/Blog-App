import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = (await request.json()) as { views?: number };
    if (body.views !== undefined) {
      await db.post.updateMany({
        where: { id, authorId: session.user.id },
        data: { views: body.views },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update." }, { status: 500 });
  }
}
