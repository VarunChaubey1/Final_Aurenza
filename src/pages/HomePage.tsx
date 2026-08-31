import React from 'react';
import { useShop } from '../context/ShopContext';
import { useUI } from '../context/UIContext';
import { Hero } from '../components/home/Hero';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { IngredientsSection } from '../components/home/IngredientsSection';
import { Testimonials } from '../components/home/Testimonials';
import { InstagramGallery } from '../components/home/InstagramGallery';
import { CatalogStatus } from '../components/common/CatalogStatus';

export const HomePage: React.FC = () => {
  const { products, loadingProducts, catalogError } = useShop();
  const { setQuickViewProduct, goToProduct, goToShop } = useUI();

  return (
    <>
      {products.length > 0 ? (
        <Hero
          onShopNow={() => goToShop()}
          onExploreCollection={() => document.getElementById('shop-by-category-section')?.scrollIntoView({ behavior: 'smooth' })}
          featuredProduct={products.find(p => p.isBestSeller) || products[0]}
          onSelectProduct={goToProduct}
        />
      ) : (
        <CatalogStatus loading={loadingProducts} error={catalogError} />
      )}

      <FeaturedProducts
        products={products}
        onQuickView={setQuickViewProduct}
        onSelectProduct={goToProduct}
        onViewAll={() => goToShop()}
      />
      <WhyChooseUs />
      <CategoryGrid onSelectCategory={(category, subcategory) => goToShop({ category, subcategory })} />
      <IngredientsSection onSelectIngredientFilter={ingredient => goToShop({ ingredient })} />
      <Testimonials />
      <InstagramGallery />
    </>
  );
};
