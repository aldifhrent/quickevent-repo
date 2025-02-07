import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  if (
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) &&
    session?.user.id
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (pathname.startsWith("/organizer") && session?.user.id) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/organizer"],
};
