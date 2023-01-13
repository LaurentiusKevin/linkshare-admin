import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./config/FirebaseAuthentication";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const user = request.cookies.get("user") ?? null;

  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/auth/sign-out")
  ) {
    if (user === null) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/sign-in")) {
    if (user !== null) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/auth/sign-out", "/auth/sign-in"],
};
