import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CategoryGrid } from './components/home/CategoryGrid';
import { IngredientsSection } from './components/home/IngredientsSection';
import { Testimonials } from './components/home/Testimonials';
import { SkinQuizModal } from './components/home/SkinQuizModal';
import { InstagramGallery } from './components/home/InstagramGallery';
import { ShopCatalogView } from './components/shop/ShopCatalogView';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';
import { SearchModal } from './components/layout/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { AboutPage } from './components/home/AboutPage';
import { Product } from './types';

export function AppContent() {
  const { products } = useShop();
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product-detail' | 'about' | 'ingredients'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('All');
  const [filterIngredient, setFilterIngredient] = useState<string>('All');

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('aurenza_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Sync Dark Mode class on html tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('aurenza_dark_mode', String(isDarkMode));
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const handleNavigateCategory = (cat: string, subcat?: string) => {
    setFilterCategory(cat);
    setFilterSubcategory(subcat || 'All');
    setFilterIngredient('All');
  };

  const handleSelectIngredientFilter = (ingredientName: string) => {
    setFilterIngredient(ingredientName);
    setFilterCategory('All');
    setFilterSubcategory('All');
    setActiveView('shop');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFF9F4] dark:bg-[#121816] text-[#1F1F1F] dark:text-[#F3F4F6] transition-colors duration-300">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onNavigateCategory={handleNavigateCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* 3. Hero Section */}
            {products.length > 0 ? (
              <Hero
                onShopNow={() => {
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreCollection={() => {
                  const el = document.getElementById('shop-by-category-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                featuredProduct={products[0]}
                onSelectProduct={handleSelectProduct}
              />
            ) : (
              <div className="py-20 text-center bg-[#FFF9F4] dark:bg-[#121816] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#2F5D50] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-[#2F5D50] dark:text-[#D6A34A] tracking-wider uppercase">Loading Aurenza Collection...</p>
              </div>
            )}

            {/* 4. Featured Best Sellers Grid */}
            <FeaturedProducts
              products={products}
              onQuickView={(p) => setQuickViewProduct(p)}
              onSelectProduct={handleSelectProduct}
              onViewAll={() => {
                setActiveView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 5. Why Choose Aurenza Pillars */}
            <WhyChooseUs />

            {/* 7. Shop By Category Bento */}
            <CategoryGrid
              onSelectCategory={(cat, subcat) => {
                handleNavigateCategory(cat, subcat);
                setActiveView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 8. Ingredients Spotlight */}
            <IngredientsSection
              onSelectIngredientFilter={handleSelectIngredientFilter}
            />

            {/* 9. Customer Testimonials */}
            <Testimonials />

            {/* 10. Instagram Community Gallery */}
            <InstagramGallery />
          </>
        )}

        {/* Catalog Shop View */}
        {activeView === 'shop' && (
          <ShopCatalogView
            products={products}
            initialCategory={filterCategory}
            initialSubcategory={filterSubcategory}
            initialIngredient={filterIngredient}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Product Detail Page View */}
        {activeView === 'product-detail' && (selectedProduct || products[0]) && (
          <ProductDetailPage
            product={selectedProduct || products[0]}
            allProducts={products}
            onBackToShop={() => setActiveView('shop')}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* About / Our Story View */}
        {activeView === 'about' && (
          <AboutPage
            onExploreShop={() => {
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Standalone Ingredients Spotlight View */}
        {activeView === 'ingredients' && (
          <div className="py-12">
            <IngredientsSection
              onSelectIngredientFilter={handleSelectIngredientFilter}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateCategory={handleNavigateCategory}
        setActiveView={setActiveView}
      />

      {/* Modals & Slide-Over Drawers */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetail={handleSelectProduct}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      <SkinQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <CartDrawer
        onNavigateShop={() => {
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <WishlistDrawer
        onNavigateShop={() => {
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProduct={handleSelectProduct}
      />

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
            <NotificationToast />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ShopProvider>
  );
}
