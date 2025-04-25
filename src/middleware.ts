import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forget-password', '/reset-password', '/privacy-policy'];

    const token = request.cookies.get('accessToken');

    // ✅ Skip redirect if it looks like a non-existent page (e.g. /plansa)
    const isPublicOrStatic = PUBLIC_PATHS.includes(pathname) || pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/api');
    const isProbably404 = !isPublicOrStatic && !token;

    if (isProbably404) {
        return NextResponse.next();
    }

    if (!token && !isPublicOrStatic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
