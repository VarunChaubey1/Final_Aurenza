import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, FilterState } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSort } from '../components/product/ProductFilterSort';
import { Sparkles } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products } = useShop();

  const [filter, setFilter] = useState<FilterState>({
    category: selectedCategory || 'All',
    subcategory: 'All',
    concern: 'All',
    skinType: 'All',
    keyIngredient: 'All',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    sortBy: 'featured',
    inStockOnly: false
  });

  const [displayProducts, setDisplayProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (selectedCategory) {
      setFilter(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    let result = [...products];

    if (filter.category !== 'All') {
      const catLower = filter.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(
        p =>
          p.category.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.productType.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower))
      );
    }

    if (filter.concern !== 'All') {
      result = result.filter(
        p =>
          p.concern.some(c => c.toLowerCase().includes(filter.concern.toLowerCase())) ||
          p.tags.some(t => t.toLowerCase().includes(filter.concern.toLowerCase()))
      );
    }

    // Price filter
    result = result.filter(p => parseFloat(p.priceRange.minVariantPrice.amount) <= filter.maxPrice);

    // Sorting
    if (filter.sortBy === 'price-low-high') {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
      );
    } else if (filter.sortBy === 'price-high-low') {
      result.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
      );
    } else if (filter.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setDisplayProducts(result);
  }, [filter, products]);

  return (
    <div className="bg-[#FFF9F4] dark:bg-[#121816] transition-colors py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A34A]" />
            Dermatologically Formulated Actives
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2F5D50] dark:text-white">
            {filter.category === 'All' ? 'All Formulations' : filter.category}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            Clinical precision skincare & scalp elixirs crafted with high-purity Vitamin C, L-Glutathione, Niacinamide, and Rosemary.
          </p>
        </div>

        {/* Filter Controls */}
        <ProductFilterSort filter={filter} setFilter={setFilter} totalCount={displayProducts.length} />

        {/* Products Grid */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1B2320] rounded-3xl p-8 border border-[#E8DFD8] dark:border-[#2C3834]">
            <p className="font-serif text-xl text-gray-500">No formulations found matching this filter criteria.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 bg-[#2F5D50] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
            >
              Clear Category Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
