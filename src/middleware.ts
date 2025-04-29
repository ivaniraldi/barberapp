import type { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

// Define supported locales
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'pt', // Set Portuguese as default
  urlMappingStrategy: 'rewrite', // Use path-based routing (e.g., /es/services)
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- AUTHENTICATION LOGIC for /admin ---
  if (pathname.startsWith('/admin') || pathname.startsWith('/en/admin') || pathname.startsWith('/es/admin') || pathname.startsWith('/pt/admin')) {
    // In a real application, you would check for a valid session cookie, token, etc.
    // Example (placeholder):
    // const sessionToken = request.cookies.get('session-token')?.value;
    // const isAuthenticated = await verifyToken(sessionToken); // Replace with your auth verification
    //
    // if (!isAuthenticated) {
    //   // Redirect to login page if not authenticated
    //   const loginUrl = new URL(`/${request.nextUrl.locale || 'pt'}/login`, request.url) // Use detected or default locale (pt)
    //   loginUrl.searchParams.set('redirectedFrom', pathname) // Optional: pass original path
    //   return NextResponse.redirect(loginUrl)
    // }
    // --- END AUTHENTICATION LOGIC ---
  }

  // Apply i18n middleware to handle locale detection and rewriting
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - healthz (health check endpoint) - Added
     * - genkit (genkit internal endpoint) - Added
     */
    '/((?!api|_next/static|_next/image|favicon.ico|healthz|genkit).*)',
    // No need for specific /admin matcher here, as the general matcher covers it
    // and the authentication check is done above based on pathname prefix.
  ],
};
