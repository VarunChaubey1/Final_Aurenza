import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Cart, Collection } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { getProducts, getCollections, getStoredShopifyCredentials, saveShopifyCredentials } from '../services/shopify';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  // Navigation View
  activeView: 'home' | 'shop' | 'product' | 'collection' | 'ingredients' | 'about' | 'contact' | 'quiz';
  setActiveView: (view: 'home' | 'shop' | 'product' | 'collection' | 'ingredients' | 'about' | 'contact' | 'quiz') => void;
  selectedProductHandle: string | null;
  setSelectedProductHandle: (handle: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  
  // Shopify Products & Integration
  products: Product[];
  collections: Collection[];
  loadingProducts: boolean;
  isLiveShopify: boolean;
  shopifyDomain: string;
  shopifyToken: string;
  updateShopifyCredentials: (domain: string, token: string) => Promise<void>;
  refreshProducts: () => Promise<void>;

  // Cart
  cart: Cart;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (lineItemId: string, quantity: number) => void;
  removeFromCart: (lineItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;

  // Wishlist
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Account
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;

  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Helper Navigation
  openProductPage: (handle: string) => void;
  openCategoryPage: (category: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product' | 'collection' | 'ingredients' | 'about' | 'contact' | 'quiz'>('home');
  const [selectedProductHandle, setSelectedProductHandle] = useState<string | null>('vitamin-c-radiance-serum');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Products & Live Shopify State
  const initialCreds = getStoredShopifyCredentials();
  const [shopifyDomain, setShopifyDomain] = useState<string>(initialCreds.domain);
  const [shopifyToken, setShopifyToken] = useState<string>(initialCreds.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [isLiveShopify, setIsLiveShopify] = useState<boolean>(false);

  const fetchShopifyProducts = async (domain = shopifyDomain, token = shopifyToken) => {
    setLoadingProducts(true);
    try {
      const [prodResult, colsResult] = await Promise.all([
        getProducts({
          first: 50,
          customDomain: domain,
          customToken: token,
        }),
        getCollections(domain, token)
      ]);

      setProducts(prodResult.products);
      setCollections(colsResult);
      setIsLiveShopify(prodResult.isLiveShopify);
    } catch (err) {
      console.error('Error fetching Shopify products/collections:', err);
      setProducts([]);
      setIsLiveShopify(false);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchShopifyProducts();
  }, []);

  const updateShopifyCredentials = async (domain: string, token: string) => {
    saveShopifyCredentials(domain, token);
    setShopifyDomain(domain);
    setShopifyToken(token);
    await fetchShopifyProducts(domain, token);
  };

  const refreshProducts = async () => {
    await fetchShopifyProducts();
  };

  // Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Wishlist persisted in localStorage if available
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aurenza_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aurenza_wishlist_ids', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Cart State persisted in localStorage
  const [cartLines, setCartLines] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurenza_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [discountCode, setDiscountCode] = useState<string | undefined>(undefined);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('aurenza_cart', JSON.stringify(cartLines));
    } catch (e) {
      console.error(e);
    }
  }, [cartLines]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Toast System
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Calculations
  const rawSubtotal = cartLines.reduce((acc, item) => {
    const p = parseFloat(item.selectedVariant.price.amount) || 0;
    return acc + p * item.quantity;
  }, 0);

  const discountAmountVal = (rawSubtotal * discountPercent) / 100;
  const finalSubtotal = Math.max(0, rawSubtotal - discountAmountVal);

  const cart: Cart = {
    id: 'cart-12345',
    checkoutUrl: 'https://checkout.shopify.com/aurenza/mock',
    totalQuantity: cartLines.reduce((acc, i) => acc + i.quantity, 0),
    lines: cartLines,
    subtotalAmount: {
      amount: finalSubtotal.toFixed(0),
      currencyCode: 'INR'
    },
    discountCode,
    discountAmount: discountAmountVal > 0 ? { amount: discountAmountVal.toFixed(0), currencyCode: 'INR' } : undefined
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const targetVariant = variant || product.variants[0];
    const existingIndex = cartLines.findIndex(
      item => item.product.id === product.id && item.selectedVariant.id === targetVariant.id
    );

    if (existingIndex > -1) {
      const updated = [...cartLines];
      updated[existingIndex].quantity += quantity;
      setCartLines(updated);
    } else {
      const newItem: CartItem = {
        id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        variantId: targetVariant.id,
        product,
        selectedVariant: targetVariant,
        quantity
      };
      setCartLines(prev => [...prev, newItem]);
    }

    showToast(`Added ${product.title} to your cart`, 'success');
    setIsCartOpen(true);
  };

  const updateCartQuantity = (lineItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineItemId);
      return;
    }
    setCartLines(prev =>
      prev.map(line => (line.id === lineItemId ? { ...line, quantity } : line))
    );
  };

  const removeFromCart = (lineItemId: string) => {
    setCartLines(prev => prev.filter(line => line.id !== lineItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartLines([]);
  };

  const applyPromoCode = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'AURENZA10' || trimmed === 'WELCOME10') {
      setDiscountCode(trimmed);
      setDiscountPercent(10);
      showToast('Promo code applied: 10% OFF!', 'success');
      return true;
    } else if (trimmed === 'GLOW20') {
      setDiscountCode(trimmed);
      setDiscountPercent(20);
      showToast('VIP promo applied: 20% OFF!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try AURENZA10', 'warning');
      return false;
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openProductPage = (handle: string) => {
    setSelectedProductHandle(handle);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategoryPage = (category: string) => {
    setSelectedCategory(category);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProductHandle,
        setSelectedProductHandle,
        selectedCategory,
        setSelectedCategory,
        products,
        collections,
        loadingProducts,
        isLiveShopify,
        shopifyDomain,
        shopifyToken,
        updateShopifyCredentials,
        refreshProducts,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isAccountOpen,
        setIsAccountOpen,
        isDarkMode,
        toggleDarkMode,
        toasts,
        showToast,
        removeToast,
        openProductPage,
        openCategoryPage
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
