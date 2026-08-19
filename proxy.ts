import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // Login page
  if (pathname === "/login") {
    // Token nahi hai → login page open rehne do
    if (!token) {
      return NextResponse.next();
    }

    // Token hai → verify karo
    try {
      jwt.verify(token, process.env.JWT_SECRET!);

      // Valid token → already logged in
      // Login page nahi kholne dena
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      // Invalid / expired token
      // Login page open rehne do
      return NextResponse.next();
    }
  }

  // Protected pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token present hai → verify karo
  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    // Valid token → request allow
    return NextResponse.next();
  } catch {
    // Invalid / expired token
    const response = NextResponse.redirect(new URL("/login", request.url));

    // Invalid cookie bhi remove kar do
    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * API routes, Next.js internal files aur static images ko
     * proxy se exclude kar rahe hain.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
