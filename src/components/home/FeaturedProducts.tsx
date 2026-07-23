import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onQuickView,
  onSelectProduct,
  onViewAll,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Skin Care' | 'Hair Care' | 'Best Sellers'>('All');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Skin Care') return p.category === 'Skin Care';
    if (activeTab === 'Hair Care') return p.category === 'Hair Care';
    if (activeTab === 'Best Sellers') return p.isBestSeller;
    return true;
  });

  return (
    <section id="featured-products-section" className="py-16 sm:py-24 bg-[#FFF9F4] dark:bg-[#121816] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#D6A34A] text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-4 h-4" />
              High-Potency Active Drops
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
              Clinical Best Sellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#1B2320] p-1.5 rounded-2xl border border-[#2F5D50]/10 shadow-xs">
            {(['All', 'Skin Care', 'Hair Care', 'Best Sellers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-[#2F5D50] dark:bg-[#4A8172] text-white shadow-sm'
                    : 'text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 hover:text-[#2F5D50] hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        {/* View All CTAs */}
        <div className="mt-14 text-center">
          <button
            id="btn-view-full-catalog"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 border-2 border-[#2F5D50] dark:border-[#D6A34A] text-[#2F5D50] dark:text-[#D6A34A] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#2F5D50] hover:text-white dark:hover:bg-[#D6A34A] dark:hover:text-[#1F1F1F] transition-all shadow-md"
          >
            <span>Explore Complete Botanical Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
