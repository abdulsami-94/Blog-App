import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as unknown;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors?.password?.[0] ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered." }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { name, email, password: hashed },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Registration failed." }, { status: 500 });
  }
}
