'use client';

import { useState, useEffect } from 'react';
import { getCart, CartItem } from '@/lib/cart';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [formData, setFormData] = useState({
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.phone,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    items: cartItems,
                    subtotal,
                    shipping,
                    total
                })
            });
            
            if (response.ok) {
                alert('Commande confirmée! Merci pour votre achat.');
                localStorage.removeItem('cart');
                window.location.href = '/';
            } else {
                alert('Erreur lors de la commande. Veuillez réessayer.');
            }
        } catch (error) {
            alert('Erreur lors de la commande. Veuillez réessayer.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Continuer vos achats
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Commande</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Order Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
                            <input
                                type="tel"
                                placeholder="Numéro de téléphone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Adresse"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-4"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <input
                                    type="text"
                                    placeholder="Ville"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Code postal"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Confirmer la commande - ${total.toFixed(2)}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Résumé de commande</h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-3">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        {item.size && <p className="text-sm text-gray-500">Taille: {item.size}</p>}
                                        {item.color && <p className="text-sm text-gray-500">Couleur: {item.color}</p>}
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm text-gray-500">Qté: {item.quantity}</span>
                                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Livraison</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}