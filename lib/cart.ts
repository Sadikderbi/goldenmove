export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: number;
  color?: string;
}

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const existingItem = cart.find(
    (cartItem) => 
      cartItem.id === item.id && 
      cartItem.size === item.size && 
      cartItem.color === item.color
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const updateCartItem = (itemId: number, size: number | undefined, color: string | undefined, newQuantity: number) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (item) => item.id === itemId && item.size === size && item.color === color
  );
  
  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }
};

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const getCartCount = (): number => {
  return getCart().reduce((total, item) => total + item.quantity, 0);
};