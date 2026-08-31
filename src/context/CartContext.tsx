import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { createShopifyCheckout } from '../services/shopifyCheckout';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  subtotal: number;
  /** Discount code to send to Shopify checkout (validated by Shopify, not locally). */
  discountCode: string;
  setDiscountCode: (code: string) => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  /** Creates a Shopify cart and redirects to hosted checkout. Returns an error message on failure. */
  checkout: () => Promise<string | null>;
  isCheckingOut: boolean;
}

const FREE_SHIPPING_THRESHOLD = 999;
const CART_KEY = 'aurenza_cart';
const DISCOUNT_KEY = 'aurenza_discount_code';

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(i => i?.variantId && i?.product && i?.selectedVariant) : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCodeState] = useState(() => localStorage.getItem(DISCOUNT_KEY) || '');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const setDiscountCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    setDiscountCodeState(clean);
    if (clean) localStorage.setItem(DISCOUNT_KEY, clean);
    else localStorage.removeItem(DISCOUNT_KEY);
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const selectedVariant = variant || product.variants[0];
    if (!selectedVariant) return;
    const lineId = `${product.id}-${selectedVariant.id}`;

    setCart(prev => {
      const idx = prev.findIndex(item => item.id === lineId);
      if (idx > -1) {
        return prev.map((item, i) => (i === idx ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prev, { id: lineId, variantId: selectedVariant.id, product, selectedVariant, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (lineId: string) => setCart(prev => prev.filter(item => item.id !== lineId));

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(lineId);
    setCart(prev => prev.map(item => (item.id === lineId ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCart([]);

  const checkout = useCallback(async (): Promise<string | null> => {
    setIsCheckingOut(true);
    try {
      const res = await createShopifyCheckout(cart, {
        discountCode: discountCode || undefined,
        email: user?.email,
      });
      if (!res.success || !res.checkoutUrl) {
        return res.error || 'Could not start checkout.';
      }
      // Shopify checkout cannot run inside an iframe (X-Frame-Options).
      if (window.self !== window.top) window.open(res.checkoutUrl, '_blank', 'noopener');
      else window.location.assign(res.checkoutUrl);
      return null;
    } finally {
      setIsCheckingOut(false);
    }
  }, [cart, discountCode, user?.email]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.selectedVariant.price.amount) * item.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalQuantity,
        subtotal,
        discountCode,
        setDiscountCode,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        checkout,
        isCheckingOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
