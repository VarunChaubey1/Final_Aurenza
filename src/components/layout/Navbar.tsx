import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  onNavigateCategory: (cat: string, subcat?: string) => void;
  activeView: string;
  setActiveView: (view: 'home' | 'shop' | 'product-detail' | 'about' | 'ingredients') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenQuiz,
  onNavigateCategory,
  activeView,
  setActiveView,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { totalQuantity, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (view: 'home' | 'shop' | 'product-detail' | 'about' | 'ingredients', category?: string) => {
    setActiveView(view);
    if (category) {
      onNavigateCategory(category);
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#FFF9F4]/90 dark:bg-[#121816]/90 backdrop-blur-md border-b border-[#2F5D50]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#1F1F1F] dark:text-[#F3F4F6] hover:text-[#2F5D50] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-9 h-9 rounded-full bg-[#2F5D50] dark:bg-[#4A8172] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm">
            A
          </div>
          <span className="text-2xl sm:text-3xl font-serif tracking-[0.2em] uppercase font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
            Aurenza
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#1F1F1F]/80 dark:text-[#F3F4F6]/80">
          <button
            id="nav-home"
            onClick={() => handleNavClick('home')}
            className={`hover:text-[#D6A34A] transition-colors relative py-2 ${
              activeView === 'home' ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold' : ''
            }`}
          >
            Home
          </button>

          <button
            id="nav-shop-all"
            onClick={() => handleNavClick('shop')}
            className={`hover:text-[#D6A34A] transition-colors relative py-2 ${
              activeView === 'shop' ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold' : ''
            }`}
          >
            Shop All
          </button>

          {/* Skin Care Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('skincare')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              id="nav-skincare"
              onClick={() => handleNavClick('shop', 'Skin Care')}
              className="hover:text-[#D6A34A] transition-colors py-2 flex items-center gap-1"
            >
              Skin Care
            </button>

            {activeDropdown === 'skincare' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#1B2320] shadow-xl rounded-xl border border-[#2F5D50]/10 p-3 space-y-1.5 z-50">
                <button
                  onClick={() => {
                    onNavigateCategory('Skin Care', 'Face Serum');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Face Serums
                </button>
                <button
                  onClick={() => {
                    onNavigateCategory('Skin Care', 'Face Wash');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Cleansers & Face Wash
                </button>
                <button
                  onClick={() => {
                    onNavigateCategory('Skin Care', 'Sunscreen');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Sunscreens (SPF 50)
                </button>
                <button
                  onClick={() => {
                    onNavigateCategory('Skin Care', 'Moisturizer');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Moisturizers
                </button>
              </div>
            )}
          </div>

          {/* Hair Care Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('haircare')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              id="nav-haircare"
              onClick={() => handleNavClick('shop', 'Hair Care')}
              className="hover:text-[#D6A34A] transition-colors py-2 flex items-center gap-1"
            >
              Hair Care
            </button>

            {activeDropdown === 'haircare' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#1B2320] shadow-xl rounded-xl border border-[#2F5D50]/10 p-3 space-y-1.5 z-50">
                <button
                  onClick={() => {
                    onNavigateCategory('Hair Care', 'Hair Oil');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Rosemary Hair Oils
                </button>
                <button
                  onClick={() => {
                    onNavigateCategory('Hair Care', 'Shampoo');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Keratin Shampoos
                </button>
                <button
                  onClick={() => {
                    onNavigateCategory('Hair Care', 'Hair Serum');
                    setActiveView('shop');
                  }}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834] rounded-lg transition-colors text-[#1F1F1F] dark:text-[#F3F4F6]"
                >
                  Leave-On Hair Serums
                </button>
              </div>
            )}
          </div>

          <button
            id="nav-ingredients"
            onClick={() => handleNavClick('ingredients')}
            className={`hover:text-[#D6A34A] transition-colors py-2 ${
              activeView === 'ingredients' ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold' : ''
            }`}
          >
            Ingredients
          </button>

          <button
            id="nav-about"
            onClick={() => handleNavClick('about')}
            className={`hover:text-[#D6A34A] transition-colors py-2 ${
              activeView === 'about' ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold' : ''
            }`}
          >
            Our Story
          </button>

          <button
            id="nav-routine-quiz"
            onClick={onOpenQuiz}
            className="text-[#D6A34A] border border-[#D6A34A]/40 hover:bg-[#D6A34A]/10 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Routine Quiz
          </button>
        </nav>

        {/* Right Icon Tools */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger */}
          <button
            id="btn-search-trigger"
            onClick={onOpenSearch}
            className="p-2 text-[#1F1F1F] dark:text-[#F3F4F6] hover:text-[#2F5D50] dark:hover:text-[#D6A34A] transition-colors"
            title="Search Products & Actives"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-dark-mode-toggle"
            onClick={onToggleDarkMode}
            className="p-2 text-[#1F1F1F] dark:text-[#F3F4F6] hover:text-[#2F5D50] dark:hover:text-[#D6A34A] transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-[#D6A34A]" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist Button */}
          <button
            id="btn-wishlist-trigger"
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-[#1F1F1F] dark:text-[#F3F4F6] hover:text-[#2F5D50] dark:hover:text-[#D6A34A] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D6A34A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            id="btn-cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#2F5D50] dark:bg-[#4A8172] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 hover:bg-[#1a382f] transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span>({totalQuantity})</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden border-t border-[#2F5D50]/10 bg-[#FFF9F4] dark:bg-[#1B2320] px-6 py-6 space-y-4">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider ${
              activeView === 'home' ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold' : 'text-[#1F1F1F] dark:text-[#F3F4F6]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]"
          >
            Shop All Products
          </button>
          <button
            onClick={() => {
              onNavigateCategory('Skin Care');
              setActiveView('shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]"
          >
            Skin Care Collection
          </button>
          <button
            onClick={() => {
              onNavigateCategory('Hair Care');
              setActiveView('shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]"
          >
            Hair Care Collection
          </button>
          <button
            onClick={() => handleNavClick('ingredients')}
            className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]"
          >
            Key Ingredients Spotlight
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]"
          >
            About Aurenza
          </button>

          <div className="pt-4 border-t border-[#2F5D50]/10 space-y-3">
            <button
              onClick={() => {
                onToggleDarkMode();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#2C3834] text-xs font-bold text-[#1F1F1F] dark:text-[#F3F4F6] transition-colors"
            >
              <span className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-4 h-4 text-[#D6A34A]" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#D6A34A]">
                {isDarkMode ? 'Active' : 'Active'}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenQuiz();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#D6A34A] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Take 60-Sec Routine Quiz
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
