export { default } from "next-auth/middleware";

export const config = {
  // Protect everything except login, NextAuth's own API routes, and static assets.
  matcher: [
    // allow unauthenticated access to common static and PWA files
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|apple-touch-icon.png).*)",
  ],
};
