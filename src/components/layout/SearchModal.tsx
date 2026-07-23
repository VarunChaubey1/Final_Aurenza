import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.ingredients.keyActives.some((i) => i.toLowerCase().includes(q)) ||
        p.concern.some((c) => c.toLowerCase().includes(q))
    );
  }, [query, products]);

  const popularSearches = ['Vitamin C', 'Glutathione', 'Sunscreen', 'Rosemary Oil', 'Niacinamide', 'Anti-Hairfall'];

  return (
    <div id="search-modal-overlay" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FFF9F4] dark:bg-[#1B2320] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#2F5D50]/20 relative text-[#1F1F1F] dark:text-[#F3F4F6]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2F5D50]/15">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2F5D50] dark:text-[#D6A34A]">
            <Search className="w-4 h-4" />
            Instant Search Engine
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#1F1F1F] dark:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="relative mt-4">
          <input
            type="text"
            autoFocus
            placeholder="Type ingredient (e.g. Vitamin C, Rosemary) or concern..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#121816] pl-12 pr-4 py-4 rounded-2xl text-sm font-semibold border border-[#2F5D50]/20 focus:outline-none focus:border-[#2F5D50]"
          />
          <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
              Popular Clinical Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-white dark:bg-[#121816] px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#2F5D50]/10 hover:border-[#2F5D50] transition-colors"
                >
                  ✨ {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="mt-6 max-h-80 overflow-y-auto space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-6">
                No active formulas matched "{query}". Try searching for "Serum", "Oil", or "Sunscreen".
              </p>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="bg-white dark:bg-[#121816] p-3 rounded-2xl border border-[#2F5D50]/10 flex items-center justify-between cursor-pointer hover:border-[#2F5D50] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.featuredImage.url}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-xl bg-[#FFF9F4]"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1F1F1F] dark:text-[#F3F4F6]">
                        {product.title}
                      </h4>
                      <span className="text-[11px] text-[#D6A34A] font-semibold">
                        ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#2F5D50]" />
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
