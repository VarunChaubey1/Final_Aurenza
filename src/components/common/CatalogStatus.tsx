import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface CatalogStatusProps {
  loading: boolean;
  error: string | null;
}

/** Loading / error / empty states for the product catalog. */
export const CatalogStatus: React.FC<CatalogStatusProps> = ({ loading, error }) => {
  const { refreshProducts } = useShop();

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
        <div className="w-10 h-10 border-4 border-[#2F5D50] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-[#2F5D50] dark:text-[#D6A34A] tracking-wider uppercase">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 px-4">
      <AlertTriangle className="w-10 h-10 text-[#D6A34A]" />
      <h2 className="text-xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
        {error ? "We couldn't load our products" : 'No products available right now'}
      </h2>
      {error && <p className="text-xs text-[#6B7280] max-w-md">{error}</p>}
      <button
        onClick={refreshProducts}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2F5D50] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f]"
      >
        <RefreshCw className="w-4 h-4" /> Try again
      </button>
    </div>
  );
};
