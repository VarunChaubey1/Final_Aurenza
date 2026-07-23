import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductGrid } from '../product/ProductGrid';

export const BestSellers: React.FC = () => {
  const { products } = useShop();

  const bestSellers = products.filter(p => p.isBestSeller || p.badge === 'BESTSELLER');
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  return (
    <section className="bg-white dark:bg-[#121816] py-16 border-b border-[#2F5D50]/10">
      <ProductGrid
        products={displayProducts}
        title="Iconic Best Sellers"
        subtitle="Customer Favorites & Top-Rated Shopify Lineup"
      />
    </section>
  );
};
