'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Save, Lock, ShoppingBag, Tag } from 'lucide-react';

interface Product {
    id?: number;
    name: string;
    price: number;
    old_price?: number;
    image: string;
    is_new?: boolean;
    category?: string;
    description?: string;
    rating?: number;
    review_count?: number;
    stock?: number;
    fast_delivery?: boolean;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState({ name: '', description: '' });
    const [formData, setFormData] = useState<Product>({
        name: '',
        price: 0,
        image: '',
        category: '',
        description: '',
        stock: 0
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Mot de passe incorrect');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="text-center mb-6">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                        <p className="text-gray-600">Entrez le mot de passe pour accéder</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchOrders();
            fetchCategories();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data.map((name: string) => ({ name })));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            if (response.ok) {
                await fetchCategories();
                setShowCategoryForm(false);
                setCategoryData({ name: '', description: '' });
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    price: formData.price,
                    oldPrice: formData.old_price,
                    image: formData.image,
                    isNew: formData.is_new,
                    category: formData.category,
                    description: formData.description,
                    rating: formData.rating,
                    reviewCount: formData.review_count,
                    stock: formData.stock,
                    fastDelivery: formData.fast_delivery
                })
            });

            if (response.ok) {
                await fetchProducts();
                setShowForm(false);
                setFormData({ name: '', price: 0, image: '', category: '', description: '', stock: 0 });
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-gray-600">Gérer Golden Move</p>
                    </div>
                    {activeTab === 'products' && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter Produit
                        </button>
                    )}
                    {activeTab === 'categories' && (
                        <button
                            onClick={() => setShowCategoryForm(!showCategoryForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter Catégorie
                        </button>
                    )}
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        Produits
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Commandes
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        <Tag className="w-4 h-4" />
                        Catégories
                    </button>
                </div>

                {activeTab === 'categories' && showCategoryForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Nouvelle Catégorie</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom de la catégorie"
                                value={categoryData.name}
                                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={categoryData.description}
                                onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                rows={3}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'products' && showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Nouveau Produit</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nom du produit"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Prix"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ancien prix (optionnel)"
                                value={formData.old_price || ''}
                                onChange={(e) => setFormData({ ...formData, old_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                                <input
                                    type="text"
                                    placeholder="Chemin de l'image (ex: /images/products/mon-produit.jpg)"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" onError={(e) => e.currentTarget.src = '/images/products/placeholder.jpg'} />
                                )}
                            </div>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">Sélectionner catégorie</option>
                                <option value="Chaussures">Chaussures</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Cyclisme">Cyclisme</option>
                                <option value="Boxe">Boxe</option>
                                <option value="Surf">Surf</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                                rows={3}
                            />
                            <div className="flex items-center gap-4 md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_new || false}
                                        onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                                    />
                                    Nouveau produit
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.fast_delivery || false}
                                        onChange={(e) => setFormData({ ...formData, fast_delivery: e.target.checked })}
                                    />
                                    Livraison rapide
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 md:col-span-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Produits ({products.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Aucun produit trouvé</td>
                                        </tr>
                                    )}
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        {product.is_new && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Nouveau</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Commandes ({orders.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.first_name} {order.last_name}</div>
                                                    <div className="text-sm text-gray-500">{order.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">${order.total}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{console.log(order.items.length)}{order.items.length} articles</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Catégories ({categories.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categories.map((category, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{category.description || 'Aucune description'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}