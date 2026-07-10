import NextAuth from 'next-auth';
import authConfig from '../auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

// ----------------------------------------------------------------------

/**
 * Gate galeri referensi /components (living docs untuk programmer & AI).
 *
 * Selalu tampil saat `yarn dev`; di build production hanya tampil bila
 * NEXT_PUBLIC_SHOW_COMPONENTS=true. Deploy client tidak men-set flag →
 * seluruh /components/* di-rewrite ke route yang tidak ada → 404.
 *
 * Penegakan HARUS di middleware: halaman galeri di-prerender statis, jadi
 * notFound() di layout segmen tidak menggate HTML yang sudah jadi.
 */
const SHOW_COMPONENTS =
  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_COMPONENTS === 'true';

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;

  // 1. Check components living docs gate
  if (nextUrl.pathname.startsWith('/components')) {
    if (!SHOW_COMPONENTS) {
      return NextResponse.rewrite(new URL('/__components-disabled', request.url));
    }
  }

  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/editor');
  const isHomeRoute = nextUrl.pathname === '/';
  const isLoginRoute = nextUrl.pathname === '/login';

  // 2. Redirect logic
  if (isLoggedIn) {
    if (isHomeRoute || isLoginRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
