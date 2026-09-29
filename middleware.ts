import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './lib/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    const url = request.nextUrl.clone();
    // `/` must land on `/en`, not `/en/` — the trailing slash cost a second
    // redirect hop (Next normalises it away with its own 308).
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

    // Permanent: the root is the most-linked URL, and a 307 tells search
    // engines to keep treating `/` as the page to index instead of `/en`.
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, assets)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
};
