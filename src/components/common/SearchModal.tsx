import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Search, X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openProductPage, addToCart, products } = useShop();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(products.slice(0, 4));
      return;
    }
    const q = query.toLowerCase();
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.ingredients.keyActives.some(act => act.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative w-full max-w-2xl bg-[#FFF9F4] dark:bg-[#121816] rounded-[32px] p-6 shadow-2xl border border-[#E8DFD8] dark:border-[#2C3834] z-10 space-y-6">
        
        {/* Search Header Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search by ingredient (Vitamin C, Glutathione), concern, or product..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-white dark:bg-[#1B2320] text-sm text-[#1F1F1F] dark:text-white rounded-full pl-12 pr-12 py-4 border border-[#E8DFD8] dark:border-[#2C3834] focus:outline-none focus:border-[#2F5D50]"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-4 p-1 text-gray-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6A34A] block mb-3">
            {query ? `Search Results (${results.length})` : 'Popular Active Formulations'}
          </span>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {results.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No matching formulations found for "{query}".</p>
            ) : (
              results.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    openProductPage(prod.handle);
                  }}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-[#1B2320] rounded-2xl border border-[#E8DFD8] dark:border-[#2C3834] hover:shadow-md cursor-pointer transition-all"
                >
                  <img src={prod.featuredImage.url} alt={prod.title} className="w-14 h-14 rounded-xl object-cover" />
                  
                  <div className="flex-1">
                    <span className="text-[9px] uppercase font-bold text-[#D6A34A]">{prod.subcategory}</span>
                    <h4 className="font-serif font-bold text-sm text-[#1F1F1F] dark:text-white">{prod.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{prod.ingredients.keyActives.join(', ')}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-[#2F5D50] dark:text-[#D6A34A]">
                      ₹{parseFloat(prod.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
