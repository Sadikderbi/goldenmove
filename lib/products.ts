export interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    images: string[];
    colors?: string[];
    sizes?: number[];
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
        

        const prod : Product = {
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : undefined,
            images: p.images,
            colors: p.colors,
            sizes: p.sizes,
            isNew: p.is_new,
            category: p.category,
            description: p.description,
            rating: p.rating ? parseFloat(p.rating) : undefined,
            reviewCount: p.review_count,
            stock: p.stock,
            fastDelivery: p.fast_delivery
        };

        return prod;
        
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
            images: p.images || [p.image],
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