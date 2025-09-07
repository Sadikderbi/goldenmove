'use client';

import { addToCart } from '@/lib/cart';
import { fetchProductById, Product } from '@/lib/products';
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProductPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params } : ProductPageProps) {

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [product, setProduct] = useState<Product>({} as Product);

    useEffect(() => {

        async function fetch() {
            const productData = await Promise.resolve(fetchProductById(params.id));
            setProduct(productData);
        }

        fetch();

    }, []);

    const handleAddToCart = () => {
        if (product.category === 'Chaussures' && (!selectedSize || !selectedColor)) {
            alert('Veuillez sélectionner une taille et une couleur');
            return;
        }

        setIsAddingToCart(true);

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined
        });

        setTimeout(() => {
            setIsAddingToCart(false);
            alert('Produit ajouté au panier!');
        }, 500);
    };



    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Retour aux produits
                </Link>
            </div>
        );
    }

    const discountPercentage = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                href="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux produits
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-6">
                    {product.isNew && (
                        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Nouveau
                        </span>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                    <p className="text-gray-600 text-lg">{product.description}</p>

                    {product.rating && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating!)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {product.rating} ({product.reviewCount} avis)
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-gray-900">
                            ${product.price}
                        </span>
                        {product.oldPrice && (
                            <>
                                <span className="text-2xl text-gray-500 line-through">
                                    ${product.oldPrice}
                                </span>
                                {discountPercentage > 0 && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {product.stock !== undefined && (
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {product.stock > 0 ? `${product.stock} en stock` : 'Coming soon'}
                        </div>
                    )}

                    {/* Sizes for shoes */}
                    {product.category === 'Chaussures' && (product as any).sizes && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Taille</h3>
                            <div className="flex flex-wrap gap-2">
                                {(product as any).sizes.map((size: number) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Colors for shoes */}
                    {product.category === 'Chaussures' && (product as any).colors && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Couleur</h3>
                            <div className="flex flex-wrap gap-3">
                                {(product as any).colors.map((color: any) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${selectedColor === color.name
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <span className="text-sm">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-2 hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-2 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAddingToCart}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${product.stock === 0 || isAddingToCart
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5 inline mr-2" />
                            {isAddingToCart ? 'Ajout...' : 'Ajouter au panier'}
                        </button>

                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`p-3 rounded-lg border transition-colors ${isWishlisted
                                ? 'border-red-500 bg-red-50 text-red-500'
                                : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-200">
                        {product.fastDelivery && (
                            <div className="flex items-center gap-3 text-green-600">
                                <Truck className="w-5 h-5" />
                                <span>Livraison rapide disponible</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600">
                            <Shield className="w-5 h-5" />
                            <span>Garantie satisfait ou remboursé 30 jours</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}