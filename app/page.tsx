'use client';

import ProductCard from '@/components/ProductCard';
import { fetchCategorys, Category } from '@/lib/categories';
import { fetchProducts } from '@/lib/products';
import { randomInt } from 'crypto';
import { ArrowRight, Trophy, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';

export default function Home() {

    const [categories, setCategories] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(),
                fetchCategorys()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        };
        loadData();
    }, []);

    const featuredProducts = products.slice(0, 4);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Golden Move
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Votre partenaire pour tous vos équipements sportifs
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Découvrir nos produits
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Qualité Premium</h3>
                            <p className="text-gray-600">Équipements de marques reconnues pour des performances optimales</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
                            <p className="text-gray-600">Livraison express disponible pour vos commandes urgentes</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Garantie Satisfait</h3>
                            <p className="text-gray-600">Retour gratuit sous 30 jours si vous n'êtes pas satisfait</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Catégories</h2>
                        <p className="text-gray-600">Explorez nos équipements par sport</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {categories.map((category) => (
                            <Link 
                                href={`/category/${category.toLocaleLowerCase()}`} 
                                className="group"
                                key={category}
                            >
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                                        {category[0]}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Produits Vedettes</h2>
                        <p className="text-gray-600">Découvrez notre sélection des meilleurs équipements sportifs</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/products"
                            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Voir tous les produits
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}