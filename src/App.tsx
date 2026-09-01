import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { SkinQuizModal } from './components/home/SkinQuizModal';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { IngredientsSection } from './components/home/IngredientsSection';
import { AboutPage } from './components/home/AboutPage';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';

/** Scroll to top on route change (except in-page hash links). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function Layout() {
  const { products, isMockCatalog } = useShop();
  const { quickViewProduct, setQuickViewProduct, isSearchOpen, setIsSearchOpen, isQuizOpen, setIsQuizOpen, goToProduct, goToShop } = useUI();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFF9F4] dark:bg-[#121816] text-[#1F1F1F] dark:text-[#F3F4F6] transition-colors duration-300">
      {isMockCatalog && (
        <div className="bg-amber-100 text-amber-900 text-center text-[11px] font-bold py-1 uppercase tracking-wider">
          Development mode — showing sample products (Shopify not configured)
        </div>
      )}
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} onOpenQuiz={() => setIsQuizOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:handle" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage onExploreShop={() => goToShop()} />} />
          <Route
            path="/ingredients"
            element={
              <div className="py-12">
                <IngredientsSection onSelectIngredientFilter={ingredient => goToShop({ ingredient })} />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Modals & drawers */}
      <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onViewFullDetail={goToProduct} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} onSelectProduct={goToProduct} />
      <SkinQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} onSelectProduct={goToProduct} />
      <CartDrawer onNavigateShop={() => goToShop()} />
      <WishlistDrawer onNavigateShop={() => goToShop()} onSelectProduct={goToProduct} />
      <AuthModal />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ShopProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <UIProvider>
                <Layout />
              </UIProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}
