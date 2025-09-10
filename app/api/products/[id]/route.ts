import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query("SELECT * FROM products WHERE id = $1", [
            params.id,
        ]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(result.rows[0]);
        
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
