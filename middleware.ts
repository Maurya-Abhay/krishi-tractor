import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!login|terms|privacy|support|api/auth|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|apple-touch-icon.png).*)",
  ],
};
