import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forget-password', '/reset-password', '/privacy-policy'];

    // Get the token from cookies
    const token = request.cookies.get('accessToken');
    console.log("token", token)

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
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)'],
};


