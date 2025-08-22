import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip authentication for login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Get the admin token from cookies
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify the token
      const decoded = verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      // Check if user has admin role
      if (decoded && typeof decoded === "object" && decoded.role === "ADMIN") {
        return NextResponse.next();
      } else {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
