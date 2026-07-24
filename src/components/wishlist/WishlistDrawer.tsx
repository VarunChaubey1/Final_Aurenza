import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface WishlistDrawerProps {
  onNavigateShop: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onNavigateShop, onSelectProduct }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div id="wishlist-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F4] dark:bg-[#1B2320] shadow-2xl flex flex-col justify-between border-l border-[#2F5D50]/20 text-[#1F1F1F] dark:text-[#F3F4F6]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#2F5D50]/10 flex items-center justify-between bg-white dark:bg-[#121816]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2F5D50]/10 dark:bg-[#2C3834] rounded-full text-[#2F5D50] dark:text-[#D6A34A]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold uppercase tracking-wider">
                  Your Wishlist ({wishlistCount})
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {wishlistCount === 0 ? 'No items saved yet' : `${wishlistCount} saved item${wishlistCount > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <button
              id="btn-close-wishlist"
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-[#1F1F1F] dark:text-white hover:text-[#2F5D50] transition-colors rounded-full hover:bg-black/5"
              aria-label="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-[#2F5D50]/10 dark:bg-[#2C3834] flex items-center justify-center text-[#2F5D50] dark:text-[#D6A34A] animate-pulse">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-[#1F1F1F] dark:text-white">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-xs mx-auto leading-relaxed">
                    You haven't saved any items to your wishlist yet. Browse our collection and tap the heart icon on products you love!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onNavigateShop();
                  }}
                  className="mt-4 bg-[#2F5D50] dark:bg-[#4A8172] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 bg-white dark:bg-[#121816] rounded-2xl border border-[#2F5D50]/10 shadow-sm flex gap-3.5 items-center hover:shadow-md transition-all group"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2C3834] flex-shrink-0 cursor-pointer relative"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        if (onSelectProduct) onSelectProduct(product);
                      }}
                    >
                      <img
                        src={product.featuredImage?.url || product.images?.[0] || 'https://images.unsplash.com/photo-1608248597260-84381e4695b7?auto=format&fit=crop&q=80&w=400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#D6A34A]">
                        {product.category}
                      </p>
                      <h4
                        className="text-xs font-bold text-[#1F1F1F] dark:text-white truncate cursor-pointer hover:text-[#2F5D50] dark:hover:text-[#D6A34A] transition-colors"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          if (onSelectProduct) onSelectProduct(product);
                        }}
                      >
                        {product.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                          ₹{(product.price?.amount ? Number(product.price.amount) : product.price || 0).toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-[10px] text-[#9CA3AF] line-through">
                            ₹{(product.compareAtPrice?.amount ? Number(product.compareAtPrice.amount) : product.compareAtPrice || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {product.rating && (
                        <div className="flex items-center gap-1 text-[#D6A34A] mt-1 text-[10px]">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        className="p-2 bg-[#2F5D50] dark:bg-[#4A8172] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#1a382f] transition-all flex items-center gap-1 shadow-sm"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 border-t border-[#2F5D50]/10 bg-white dark:bg-[#121816] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280] dark:text-[#9CA3AF]">
                  Total Saved Products:
                </span>
                <span className="font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                  {wishlist.length} Item{wishlist.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearWishlist}
                  className="w-full py-2.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onNavigateShop();
                  }}
                  className="w-full bg-[#2F5D50] dark:bg-[#4A8172] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f] transition-all"
                >
                  Shop More
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
