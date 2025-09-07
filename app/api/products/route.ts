import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    isNew?: boolean;
    category?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    stock?: number;
    fastDelivery?: boolean;
}

export async function GET() {
    try {
        
        const result = await query('SELECT * FROM products ORDER BY created_at DESC');
        return NextResponse.json(result.rows);

    } catch (error) {
        return NextResponse.json({ error: 'Database not available. Please set up PostgreSQL.' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, oldPrice, image, isNew, category, description, rating, reviewCount, stock, fastDelivery } = body;

        const result = await query(
            `INSERT INTO products (name, price, old_price, image, is_new, category, description, rating, review_count, stock, fast_delivery)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [name, price, oldPrice, image, isNew, category, description, rating, reviewCount, stock, fastDelivery]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database not available. Please set up PostgreSQL.' }, { status: 500 });
    }
}