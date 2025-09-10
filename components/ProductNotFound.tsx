import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
      <p className="text-gray-600 mb-8">
        Le produit que vous recherchez n'existe pas ou a été supprimé.
      </p>
      <Link 
        href="/products"
        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux produits
      </Link>
    </div>
  );
}