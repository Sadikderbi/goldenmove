import { NextRequest, NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';

export async function GET() {
    try {
        await initDB();
        const result = await query('SELECT name FROM categories ORDER BY name');
        const categories = result.rows.map(row => row.name);
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(['Chaussures', 'Tennis', 'Cyclisme', 'Boxe', 'Surf']);
    }
}

export async function POST(request: NextRequest) {
    try {
        await initDB();
        const { name, description } = await request.json();
        const result = await query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}