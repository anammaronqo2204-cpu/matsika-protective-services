import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";

/**
 * Guards the staff portal at the edge.
 *
 * - /admin (and any future sub-route) requires a session cookie; without one
 *   the visitor is redirected straight to /admin/login, so an unauthenticated
 *   person never sees portal chrome.
 * - Visiting /admin/login while already signed in bounces to the dashboard.
 * - Every /admin response carries noindex headers so the portal can never be
 *   surfaced by a search engine even though it is reachable by direct URL.
 *
 * Note: this is a routing convenience only. Every /api/admin/* handler still
 * verifies and re-validates the signed session server-side.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!hasSession && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return withNoIndex(NextResponse.redirect(url));
  }

  if (hasSession && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return withNoIndex(NextResponse.redirect(url));
  }

  return withNoIndex(NextResponse.next());
}

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
