import { NextRequest, NextResponse } from "next/server";

export default function middleware(req, res) {
  const pathname = req.nextUrl.pathname;
  let cookies = req.cookies.get("token");
  const protectedPath =
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/profile");
  if (protectedPath && (!cookies || cookies === null)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/buyer",
    "/buyer/(.*)",
    "/seller",
    "/seller/(.*)",
    "/profile",
  ],
};
