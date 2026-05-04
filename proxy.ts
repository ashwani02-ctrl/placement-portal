import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token"); // ✅ FIXED

  const { pathname } = request.nextUrl;

  // protect dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // prevent logged-in user from going to login page
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}