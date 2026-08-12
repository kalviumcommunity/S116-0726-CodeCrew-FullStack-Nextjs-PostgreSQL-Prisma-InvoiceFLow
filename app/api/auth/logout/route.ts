import { NextResponse } from "next/server";

// Logout is handled client-side via next-auth/react signOut().
// This route exists for completeness but is not used by the frontend.
// signOut() from next-auth/react correctly clears the session cookie.
export async function POST() {
  return NextResponse.json({ message: "Use client-side signOut() from next-auth/react" }, { status: 200 });
}
