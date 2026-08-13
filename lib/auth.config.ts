/**
 * auth.config.ts — Edge-safe authentication configuration.
 *
 * This file contains ONLY the lightweight parts of the NextAuth config that
 * are safe to run in the Vercel Edge runtime (no Prisma, no bcrypt, no Node APIs).
 *
 * It is used exclusively by middleware.ts to verify JWT sessions.
 * The full auth config (with Credentials provider + Prisma + bcrypt) lives in lib/auth.ts.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  // No database/Prisma/bcrypt — only JWT session reading is needed here.
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url;
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) return url;
      } catch {
        // Fallback
      }
      return baseUrl;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
};
