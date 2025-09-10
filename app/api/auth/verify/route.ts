import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('admin_session');
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'No session' }, { status: 401 });
        }
        
        // Decode session
        const sessionData = Buffer.from(sessionCookie.value, 'base64').toString();
        const [userId, timestamp] = sessionData.split(':');
        
        // Check if session is expired
        const sessionAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge > maxAge) {
            return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }
        
        // Verify user still exists
        const result = await query(
            'SELECT id, email FROM admin_users WHERE id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }
        
        return NextResponse.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}