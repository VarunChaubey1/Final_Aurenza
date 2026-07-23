import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  openCheckout: () => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  subtotal: number;
  discountCode: string;
  discountPercentage: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  discountAmount: number;
  finalTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const FREE_SHIPPING_THRESHOLD = 999;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurenza_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurenza_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const selectedVariant = variant || product.variants[0];
    const lineId = `${product.id}-${selectedVariant.id}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === lineId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: lineId,
            variantId: selectedVariant.id,
            product,
            selectedVariant,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (lineId: string) => {
    setCart(prev => prev.filter(item => item.id !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === lineId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AURENZA10' || cleanCode === 'FIRST10' || cleanCode === 'GLOW10') {
      setDiscountCode(cleanCode);
      setDiscountPercentage(10);
      return { success: true, message: '10% discount applied successfully!' };
    } else if (cleanCode === 'LUXE20') {
      setDiscountCode(cleanCode);
      setDiscountPercentage(20);
      return { success: true, message: 'VIP 20% discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "AURENZA10"' };
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const priceNum = parseFloat(item.selectedVariant.price.amount);
    return sum + priceNum * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercentage) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalQuantity,
        subtotal,
        discountCode,
        discountPercentage,
        applyDiscountCode,
        discountAmount,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
