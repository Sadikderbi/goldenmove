'use client';

import { useState, useEffect } from 'react';
import { getCart, CartItem, updateCartItem } from '@/lib/cart';
import { X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

interface CartDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
    
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            setCartItems(getCart());
        }
    }, [isOpen]);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Panier ({cartItems.length})</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Votre panier est vide
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="p-4 border-b border-gray-100 flex gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                                {item.size && <p className="text-xs text-gray-500">Taille: {item.size}</p>}
                                {item.color && <p className="text-xs text-gray-500">Couleur: {item.color}</p>}
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-semibold">${item.price}</span>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => {
                                                updateCartItem(item.id, item.size, item.color, item.quantity - 1);
                                                setCartItems(getCart());
                                            }}
                                            className="w-6 h-6 flex items-center justify-center border rounded"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm px-2">{item.quantity}</span>
                                        <button 
                                            onClick={() => {
                                                updateCartItem(item.id, item.size, item.color, item.quantity + 1);
                                                setCartItems(getCart());
                                            }}
                                            className="w-6 h-6 flex items-center justify-center border rounded"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total: ${total.toFixed(2)}</span>
                    </div>
                    <Link 
                        href="/checkout" 
                        onClick={onClose}
                        className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                        Passer commande
                    </Link>
                </div>
            )}
        </div>
    );
}