import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forget-password', '/reset-password', '/privacy-policy'];

    if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

    const token = request.cookies.get('accessToken');

    // ✅ Skip redirect for non-token pages that don't exist (e.g. /plansa)
    if (!token && !pathname.includes('.')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)'],
};
