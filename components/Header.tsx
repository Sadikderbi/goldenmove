'use client';

import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCartCount } from '@/lib/cart';
import CartDropdown from './CartDropdown';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(getCartCount());
            if (isCartOpen) setIsCartOpen(false); // Close cart when updated
        };
        updateCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('storage', handleCartUpdate);
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('storage', handleCartUpdate);
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">GM</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">ghadi nbdloh</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</Link>
                        <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Produits</Link>
                        <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">Catégories</Link>
                    </nav>

                    <div className="flex items-center space-x-4">

                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Link href="/admin" >
                                <User className="w-5 h-5" />
                            </Link>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                                )}
                            </button>
                            <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                        </div>
                        <button
                            className="md:hidden p-2 text-gray-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 py-2">Accueil</Link>
                            <Link href="/products" className="text-gray-700 hover:text-blue-600 py-2">Produits</Link>
                            <Link href="/categories" className="text-gray-700 hover:text-blue-600 py-2">Catégories</Link>
                            <Link href="/about" className="text-gray-700 hover:text-blue-600 py-2">À propos</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;