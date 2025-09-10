'use client';

import ProductCard from '@/components/ProductCard';
import { categoryDetails } from '@/data/categoryDetails';
import { fetchProducts, Product } from '@/lib/products';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoryPage({ params }: { params: { slug: string } }) {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {

        async function fetch() {
            const productsData = await Promise.resolve(fetchProducts());
            setProducts(productsData);
        }

        fetch();
        
    }, []);

    const categoryProducts = products.filter(p => p.category?.toLowerCase() === params.slug);
    const details = categoryDetails[params.slug as keyof typeof categoryDetails];

    if (!details || categoryProducts.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-200 hover:text-white mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Link>

                    <h1 className="text-4xl font-bold mb-4">{details.name}</h1>
                    <p className="text-xl text-blue-100 mb-6">{details.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {details.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Produits {details.name}</h2>
                    <p className="text-gray-600">{categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''} disponible{categoryProducts.length > 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}