export interface Product {
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

export const fetchProductById = async (id: string): Promise<Product> => {
    
    try {

        const response = await fetch(`/api/products/${id}`);
        const p = await response.json();
        return {
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : undefined,
            image: p.image,
            isNew: p.is_new,
            category: p.category,
            description: p.description,
            rating: p.rating ? parseFloat(p.rating) : undefined,
            reviewCount: p.review_count,
            stock: p.stock,
            fastDelivery: p.fast_delivery
        };
        
    } catch (error) {
        throw new Error('Product not found');
    }
}; 

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch('/api/products');
        const dbProducts = await response.json();

        return dbProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : undefined,
            image: p.image,
            isNew: p.is_new,
            category: p.category,
            description: p.description,
            rating: p.rating ? parseFloat(p.rating) : undefined,
            reviewCount: p.review_count,
            stock: p.stock,
            fastDelivery: p.fast_delivery
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};