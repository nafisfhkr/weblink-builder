import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedPath = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/editor');

  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
