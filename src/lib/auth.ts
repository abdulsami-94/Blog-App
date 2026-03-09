import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import type { Provider } from "next-auth/providers";

const credentialsProvider = Credentials({
  async authorize(credentials) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;
    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });
    if (!user?.password) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
});

const providers: Provider[] = [credentialsProvider];
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? null;
        token.name = user.name ?? null;
        token.picture = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? "") as string;
        session.user.email = (token.email ?? "") as string;
      }
      return session;
    },
  },
});
