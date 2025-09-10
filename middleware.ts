import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const sessionCookie = request.cookies.get('admin_session');
        
        if (!sessionCookie) {
            // Redirect to login if no session
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        
        try {
            // Basic session validation
            const sessionData = Buffer.from(sessionCookie.value, 'base64').toString();
            const [userId, timestamp] = sessionData.split(':');
            
            // Check if session is expired (24 hours)
            const sessionAge = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (sessionAge > maxAge) {
                const response = NextResponse.redirect(new URL('/admin', request.url));
                response.cookies.delete('admin_session');
                return response;
            }
        } catch (error) {
            // Invalid session format
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};