import { NextResponse } from "next/server";

const LOGGED_IN_COOKIE = "watchshop_logged_in";
const RESTRICTED_WHEN_LOGGED_IN = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log("[middleware] pathname:", pathname);

  const isRestricted = RESTRICTED_WHEN_LOGGED_IN.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const loggedIn = request.cookies.get(LOGGED_IN_COOKIE)?.value === "1";

  if (isRestricted && loggedIn) {
    console.log("[middleware] redirecting logged-in user to /account");
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/login/:path*", "/register", "/register/:path*"],
};
