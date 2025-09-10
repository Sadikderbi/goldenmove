'use client';

import { addToCart } from '@/lib/cart';
import { fetchProductById, Product } from '@/lib/products';
import ProductNotFound from '@/components/ProductNotFound';
import { Heart, ShoppingCart, Star, Truck, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Alert from '@/components/Alert';
import bcrypt from 'bcryptjs';

interface ProductPageProps {
    params: { id: string };
}

export default function ProductDetailPage({ params }: ProductPageProps) {

    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [product, setProduct] = useState<Product>({} as Product);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        setLoading(true);

        async function fetch() {
            const product = await Promise.resolve(fetchProductById(params.id));
            setProduct(product);
        }

        fetch();
        setLoading(false);

    }, []);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

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
            image: product.images[0],
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined
        });

        setTimeout(() => {
            setIsAddingToCart(false);
        }, 500);
    };

    const handleCheckout = () => {

        if (!selectedSize || !selectedColor) {
            setError(true);
            return;
        }

        handleAddToCart();
        // Redirect to checkout page after adding to cart
        window.location.href = '/checkout';
    };

    if (loading) {

        return <div className="flex justify-center items-center h-96">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>;
    }

    if (!product && !loading) {
        return <ProductNotFound />;
    }


    if (!product.images || !product.sizes || !product.colors) {
        return "";
    }

    const discountPercentage = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Galerie d'images */}
                <div className="space-y-4">
                    {/* Image principale */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg group cursor-zoom-in">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />



                        {/* Navigation buttons */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
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

                    {product.category === 'Chaussures' && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Taille</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: number) => (
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
                                {error && !selectedSize && (
                                    <Alert variant="error" message="Veuillez sélectionner une taille" />
                                )}
                            </div>
                        </div>
                    )}


                    {product.category === 'Chaussures' && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">Couleur</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color: any) => (
                                    <button
                                        key={color.name}

                                        onClick={() => setSelectedColor(color)}
                                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${selectedColor === color
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-sm">{color}</span>
                                    </button>
                                ))}
                                {error && !selectedColor && (
                                    <Alert variant="error" message="Veuillez sélectionner une couleur" />
                                )}
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
                            onClick={handleCheckout}
                            className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center"
                        >
                            <ShoppingCart className="w-5 h-5 inline mr-2" />
                            Commander maintenant
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
            {/* Onglets de contenu */}
            <div className="mt-16">
                {/* Navigation des onglets */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'description', label: 'Description' },
                            { id: 'specifications', label: 'Caractéristiques' },
                            { id: 'reviews', label: `Avis (${product.reviewCount})` }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contenu des onglets */}
                <div className="py-8">
                    {activeTab === 'description' && (
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {product.description}
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                                Fonctionnalités principales
                            </h3>
                            {/*
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{product.features.map((feature, index) => (
										<div key={index} className="flex items-center gap-3">
											<Check className="w-5 h-5 text-green-500 flex-shrink-0" />
											<span className="text-gray-700 dark:text-gray-300">{feature}</span>
										</div>
									))}
								</div>
                                */}
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/*
								{Object.entries(product.specifications).map(([key, value]) => (
									<div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-4">
										<dt className="font-semibold text-gray-900 dark:text-white mb-1">
											{key}
										</dt>
										<dd className="text-gray-600 dark:text-gray-300">
											{value}
										</dd>
									</div>
								))}
                                */}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            {/* Résumé des avis */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {product.rating}
                                            </span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-6 h-6 ${i < Math.floor(product.rating ? product.rating : 0)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Basé sur {product.reviewCount} avis
                                        </p>
                                    </div>

                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Écrire un avis
                                    </button>
                                </div>

                                {/* Barres de notation */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div key={stars} className="flex items-center gap-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                                                {stars} ⭐
                                            </span>
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${Math.random() * 60 + 20}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                                {Math.floor(Math.random() * 50 + 10)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Liste des avis */}
                            <div className="space-y-6">
                                {/*
									{(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
										<div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
														<span className="text-gray-700 dark:text-gray-300 font-semibold">
															{review.author.charAt(0)}
														</span>
													</div>
													<div>
														<div className="flex items-center gap-2">
															<span className="font-semibold text-gray-900 dark:text-white">
																{review.author}
															</span>
															{review.verified && (
																<span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium dark:bg-green-900 dark:text-green-200">
																	Achat vérifié
																</span>
															)}
														</div>
														<div className="flex items-center gap-2 mt-1">
															<div className="flex items-center">
																{[...Array(5)].map((_, i) => (
																	<Star
																		key={i}
																		className={`w-4 h-4 ${i < review.rating
																			? 'fill-yellow-400 text-yellow-400'
																			: 'text-gray-300'
																			}`}
																	/>
																))}
															</div>
															<span className="text-sm text-gray-600 dark:text-gray-400">
																{review.date}
															</span>
														</div>
													</div>
												</div>
											</div>

											<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
												{review.title}
											</h4>
											<p className="text-gray-600 dark:text-gray-300 mb-4">
												{review.comment}
											</p>

											<div className="flex items-center gap-4">
												<button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
													<ThumbsUp className="w-4 h-4" />
													<span className="text-sm">Utile ({review.helpful})</span>
												</button>
												<button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
													<MessageCircle className="w-4 h-4" />
													<span className="text-sm">Répondre</span>
												</button>
											</div>
										</div>
									))}
                                    */}
                            </div>



                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}