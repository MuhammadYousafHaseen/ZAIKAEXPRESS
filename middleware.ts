import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes
const PUBLIC_ROUTES = ["/", "/signup", "/signin"];
const AUTH_ROUTES = ["/dashboard", "/become-seller"];
const SELLER_ROUTE = "/seller-dashboard";
const ADMIN_ROUTE = "/admin-dashboard";

// Secret from .env
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret });

  // 1. Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Authenticated routes (dashboard, become-seller)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  // 3. Seller dashboard route – require cookie "ownerId"
  if (pathname.startsWith(SELLER_ROUTE)) {
    const ownerId = req.cookies.get("ownerId")?.value;
    if (!ownerId) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  // 4. Admin route – require session + isAdmin === true
  if (pathname.startsWith(ADMIN_ROUTE)) {
    const isAdmin = token?.user?.isAdmin;

    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  // 5. Default: allow
  return NextResponse.next();
}

// ✅ Pages the middleware applies to
export const config = {
  matcher: [
    "/",                      // Homepage
    "/signup",
    "/signin",
    "/dashboard/:path*",      // Authenticated user
    "/become-seller",
    "/seller-dashboard/:path*", // Seller
    "/admin-dashboard/:path*",  // Admin
  ],
};
