import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow the login page itself
	if (pathname.startsWith("/admin/login")) {
		return NextResponse.next();
	}

	// Protect admin routes
	if (pathname.startsWith("/admin")) {
		const token = request.cookies.get("admin-auth")?.value;
		if (!token) {
			const loginUrl = new URL("/admin/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
}; 