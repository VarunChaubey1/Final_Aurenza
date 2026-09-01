import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface UIContextType {
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  /** Navigate to a product page and scroll to top. */
  goToProduct: (product: Product) => void;
  /** Navigate to the shop with optional filters. */
  goToShop: (filters?: { category?: string; subcategory?: string; ingredient?: string }) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function shopPath(filters?: { category?: string; subcategory?: string; ingredient?: string }): string {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters?.subcategory && filters.subcategory !== 'All') params.set('sub', filters.subcategory);
  if (filters?.ingredient && filters.ingredient !== 'All') params.set('ingredient', filters.ingredient);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : '/shop';
}

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const goToProduct = (product: Product) => {
    setQuickViewProduct(null);
    setIsSearchOpen(false);
    setIsQuizOpen(false);
    navigate(`/product/${product.handle}`);
  };

  const goToShop: UIContextType['goToShop'] = filters => navigate(shopPath(filters));

  return (
    <UIContext.Provider
      value={{ quickViewProduct, setQuickViewProduct, isSearchOpen, setIsSearchOpen, isQuizOpen, setIsQuizOpen, goToProduct, goToShop }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
};
