import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const initDB = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            old_price DECIMAL(10,2),
            image VARCHAR(500) NOT NULL,
            is_new BOOLEAN DEFAULT false,
            category VARCHAR(100),
            description TEXT,
            rating DECIMAL(2,1),
            review_count INTEGER DEFAULT 0,
            stock INTEGER DEFAULT 0,
            fast_delivery BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
  `);

    await query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            items JSONB NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            shipping DECIMAL(10,2) NOT NULL,
            total DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
  `);
  
    await query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    await query(`
        INSERT INTO categories (name, description) VALUES 
        ('Chaussures', 'Chaussures de sport haute performance'),
        ('Tennis', 'Équipements de tennis professionnels'),
        ('Cyclisme', 'Vélos et accessoires de cyclisme'),
        ('Boxe', 'Équipements de boxe et arts martiaux'),
        ('Surf', 'Planches et accessoires de surf')
        ON CONFLICT (name) DO NOTHING
    `);
};