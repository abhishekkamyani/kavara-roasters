import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Optimistic route protection. Pages and Server Actions re-check the session
// themselves (see lib/dal.ts); this only keeps people out of the wrong portal.
export default auth((request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user;
  const home = user?.role === "ADMIN" ? "/admin/orders" : "/dashboard";

  if (pathname === "/login") {
    return user
      ? NextResponse.redirect(new URL(home, request.nextUrl))
      : NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const inAdmin = pathname.startsWith("/admin");
  if (inAdmin !== (user.role === "ADMIN")) {
    return NextResponse.redirect(new URL(home, request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
