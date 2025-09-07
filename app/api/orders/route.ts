import { NextRequest, NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { email, firstName, lastName, address, city, postalCode, items, subtotal, shipping, total } = body;
    
    const result = await query(
      `INSERT INTO orders (email, first_name, last_name, address, city, postal_code, items, subtotal, shipping, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [email, firstName, lastName, address, city, postalCode, JSON.stringify(items), subtotal, shipping, total]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}