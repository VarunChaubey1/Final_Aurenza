import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Collection } from '../types';
import { getCatalog } from '../services/shopify';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  products: Product[];
  collections: Collection[];
  loadingProducts: boolean;
  /** Set when the catalog could not be loaded from Shopify. */
  catalogError: string | null;
  /** True in development when running on local mock data. */
  isMockCatalog: boolean;
  refreshProducts: () => Promise<void>;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DARK_MODE_KEY = 'aurenza_dark_mode';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isMockCatalog, setIsMockCatalog] = useState(false);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    setCatalogError(null);
    try {
      const result = await getCatalog(50);
      setProducts(result.products);
      setCollections(result.collections);
      setIsMockCatalog(result.isMock);
    } catch (err) {
      console.error('Failed to load catalog:', err);
      setProducts([]);
      setCollections([]);
      setCatalogError(err instanceof Error ? err.message : 'Could not load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Dark mode — single source of truth, persisted.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY);
      if (saved !== null) return saved === 'true';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
    } catch {
      /* ignore */
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success') => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ShopContext.Provider
      value={{
        products,
        collections,
        loadingProducts,
        catalogError,
        isMockCatalog,
        refreshProducts,
        isDarkMode,
        toggleDarkMode,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
