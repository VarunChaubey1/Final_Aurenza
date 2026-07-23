import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title, subtitle }) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {subtitle && (
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#D6A34A] block mb-2">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F5D50] dark:text-white">
                {title}
              </h2>
            )}
            <div className="w-12 h-0.5 bg-[#D6A34A] mx-auto mt-4" />
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1B2320] rounded-3xl p-8 border border-[#E8DFD8] dark:border-[#2C3834]">
            <p className="font-serif text-xl text-gray-500">No products match your current search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
