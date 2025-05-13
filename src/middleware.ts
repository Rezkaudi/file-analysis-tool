import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
<<<<<<< HEAD
    const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forget-password', '/reset-password', '/privacy-policy' , '/locales'];
=======
    const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forget-password', '/reset-password', '/privacy-policy', '/payment-success', 'payment-cancel'];
>>>>>>> ff51232be31592d98359ab6a30d44b53049518d3

    // Get the token from cookies
    const token = await request.cookies.get('accessToken');



    // Allow access to home page without authentication
    if (PUBLIC_PATHS.includes(pathname)) {
        if (token && pathname === "/login") {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (!token && pathname === "/") {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    }

    // If no token found, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }


    // Token exists, allow access to protected pages
    return NextResponse.next();
}

// Configure which routes the middleware should protect
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|locales).*)'],
};


