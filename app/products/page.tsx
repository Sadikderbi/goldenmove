'use client';

import ProductCard from '@/components/ProductCard';
import { fetchCategorys, Category } from '@/lib/categories';
import { fetchProducts, Product } from '@/lib/products';
import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductsPage() {

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(),
                fetchCategorys()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setLoading(false);
        };
        loadData();
    }, []);
    
    const allCategories = ['all', ...categories];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h1>

                <div className="flex items-center gap-4 mb-6">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {category === 'all' ? 'Tous' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
                </div>
            )}
        </div>
    );
}