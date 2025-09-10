import { Heart, Eye, ShoppingCart, Star, AlertCircle, Truck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';

interface Product {
	id: number;
	name: string;
	price: number;
	oldPrice?: number;
	images: string[];
	isNew?: boolean;
	category?: string;
	description?: string;
	rating?: number;
	reviewCount?: number;
	stock?: number;
	fastDelivery?: boolean;
}

interface ProductCardProps {
	product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
	
	const [isWishlisted, setIsWishlisted] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);

	const discountPercentage = product.oldPrice
		? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
		: 0;

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsAddingToCart(true);
		
		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.images[0],
			quantity: 1
		});
		
		setTimeout(() => {
			setIsAddingToCart(false);
		}, 800);
	};

	const toggleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsWishlisted(!isWishlisted);
	};

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800">
			{product.isNew && (
				<div className="absolute top-3 left-3 z-10 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
					Nouveau
				</div>
			)}

			<button
				onClick={toggleWishlist}
				className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 hover:bg-white hover:scale-110 dark:bg-gray-800/90 dark:hover:bg-gray-800"
			>
				<Heart
					className={`w-4 h-4 transition-colors ${isWishlisted
						? 'fill-red-500 text-red-500'
						: 'text-gray-400 hover:text-red-500'
						}`}
				/>
			</button>

			<Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
				<img
					src={product.images[0]}
					alt={product.name}
					className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
				/>

				<div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20">
					<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
						<div className="flex gap-2">
							<Link href={`/product/${product.id}`}>
								<button className="rounded-full bg-white p-3 shadow-lg transition-transform hover:scale-110">
									<Eye className="w-5 h-5 text-gray-700" />
								</button>
							</Link>
							<button className="rounded-full bg-white p-3 shadow-lg transition-transform hover:scale-110">
								<ShoppingCart className="w-5 h-5 text-gray-700" />
							</button>
						</div>
					</div>
				</div>

				{product.stock !== undefined && (
					<div className="absolute bottom-2 left-2">
						<div className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
							: product.stock > 0
								? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
								: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
							}`}>
							{product.stock > 0 ? `${product.stock} en stock` : 'Coming soon'}
						</div>
					</div>
				)}
			</Link>

			<div className="p-5">
				<Link href={`/product/${product.id}`} className="group">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{product.name}
					</h3>
				</Link>

				<p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
					{product.description}
				</p>

				{product.rating && (
					<div className="flex items-center gap-2 mb-3">
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${i < Math.floor(product.rating!)
										? 'fill-yellow-400 text-yellow-400'
										: 'text-gray-300'
										}`}
								/>
							))}
						</div>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							({product.reviewCount || 0})
						</span>
					</div>
				)}

				<div className="flex items-center gap-2 mb-4">
					<span className="text-2xl font-bold text-gray-900 dark:text-white">
						${product.price}
					</span>
					{product.oldPrice && (
						<>
							<span className="text-lg font-medium text-gray-500 line-through">
								${product.oldPrice}
							</span>
							{discountPercentage > 0 && (
								<div className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
									-{discountPercentage}%
								</div>
							)}
						</>
					)}
				</div>

				<button
					onClick={handleAddToCart}
					disabled={isAddingToCart || (product.stock !== undefined && product.stock === 0)}
					className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${product.stock === 0
						? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
						: isAddingToCart
							? 'bg-green-500 text-white'
							: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg'
						}`}
				>
					{isAddingToCart ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Ajout...
						</>
					) : product.stock === 0 ? (
						<>
							<AlertCircle className="w-4 h-4" />
							coming soon
						</>
					) : (
						<>
							<ShoppingCart className="w-4 h-4" />
							Ajouter au panier
						</>
					)}
				</button>

				{product.fastDelivery && (
					<div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
						<Truck className="w-4 h-4" />
						<span>Livraison rapide disponible</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCard;