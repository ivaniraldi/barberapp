// src/middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user is trying to access the /admin route
  if (pathname.startsWith('/admin')) {
    // --- AUTHENTICATION LOGIC ---
    // In a real application, you would check for a valid session cookie, token, etc.
    // For this example, we'll assume no authentication check for simplicity.
    // If you implemented session/token checks, you'd do it here.
    // Example (placeholder):
    // const sessionToken = request.cookies.get('session-token')?.value;
    // const isAuthenticated = await verifyToken(sessionToken); // Replace with your auth verification
    //
    // if (!isAuthenticated) {
    //   // Redirect to login page if not authenticated
    //   const loginUrl = new URL('/login', request.url)
    //   loginUrl.searchParams.set('redirectedFrom', pathname) // Optional: pass original path
    //   return NextResponse.redirect(loginUrl)
    // }
    // --- END AUTHENTICATION LOGIC ---

    // If authenticated (or no check needed for now), allow access
    return NextResponse.next()
  }

  // Allow other requests to pass through
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
      /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (allow access to login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    '/admin/:path*', // Specifically match admin routes
    ],
}
