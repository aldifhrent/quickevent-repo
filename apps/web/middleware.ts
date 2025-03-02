import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Jika user sudah login, redirect dari /sign-in & /sign-up ke /
  if (
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) &&
    session?.user.id
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Blokir akses ke /organizer kecuali untuk /organizer/organizerId
  if (
    pathname.startsWith("/organizer") &&
    !pathname.match(/^\/organizer\/[^/]+$/) &&
    !session?.user.id
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Blokir akses ke /event/create jika belum login
  if (pathname === "/event/create" && !session?.user.id) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Blokir akses ke /profile/profile dan /profile/:id jika belum login
  if (
    (pathname.startsWith("/profile/")) &&
    !session?.user.id
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (pathname === "/event" && !session?.user.id) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Blokir akses ke /event/[id]/transactions jika belum login
  const eventTransactionRegex = /^\/event\/[^/]+\/transactions$/;
  if (eventTransactionRegex.test(pathname) && !session?.user.id) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Jika user berperan ORGANIZER, blokir akses ke /dashboard
  if (pathname.startsWith("/dashboard") && session?.user.role === "ORGANIZER") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/organizer/:path*", // /organizer path matcher
    "/dashboard/:path*",
    "/event/:path*",
    "/profile/:path*",
    "/profile/profile", // Tambahkan matcher spesifik untuk /profile/profile
  ],
};
