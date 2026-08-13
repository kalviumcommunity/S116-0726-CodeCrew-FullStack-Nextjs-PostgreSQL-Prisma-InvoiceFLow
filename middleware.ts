/**
 * middleware.ts — Next.js Edge Middleware for route protection.
 *
 * Imports ONLY the lightweight auth.config.ts (no Prisma, no bcrypt, no Node APIs).
 * Session verification is done via JWT cookie — no database queries needed here.
 * All user-data authorization (ownership checks) is enforced in individual API routes.
 */
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that are publicly accessible without a session
const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets (images, icons, etc.)
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "?")) ||
    pathname.startsWith("/images/") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check session via lightweight JWT-only auth (no DB query)
  const session = await auth();

  if (!session) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals, static files, and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
