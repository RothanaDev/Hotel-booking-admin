import { NextResponse } from "next/server";

export function proxy(request: any) {
  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = request.cookies.get("is_logged_in")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard",
    "/booking",
    "/room",
    "/service",
    "/payment",
    "/inventory",
    "/room-types",
    "/roomcalendar",
    "/housekeepingtask",
    "/maintenanceticket",
    "/users",
    "/roles",
    "/settings"
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !accessToken && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};