import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist, openProductPage } = useShop();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!quickViewProduct) return null;

  const selectedVariant = quickViewProduct.variants[selectedVariantIndex] || quickViewProduct.variants[0];
  const isLiked = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Overlay Backdrop */}
      <div className="absolute inset-0" onClick={() => setQuickViewProduct(null)} />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-[#FFF9F4] dark:bg-[#121816] rounded-[32px] overflow-hidden shadow-2xl border border-[#E8DFD8] dark:border-[#2C3834] z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column - Product Images */}
        <div className="p-6 bg-white dark:bg-[#1B2320] flex flex-col justify-between">
          <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[#FFF9F4] dark:bg-[#121816] mb-4">
            <img
              src={quickViewProduct.images[selectedImageIndex]?.url || quickViewProduct.featuredImage.url}
              alt={quickViewProduct.title}
              className="w-full h-full object-cover object-center"
            />
            {quickViewProduct.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#2F5D50] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D6A34A]" /> Best Seller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx ? 'border-[#2F5D50] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info & Actions */}
        <div className="p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6A34A] bg-[#D6A34A]/10 px-3 py-1 rounded-full">
                {quickViewProduct.subcategory}
              </span>
              <div className="flex items-center gap-1 text-[#D6A34A]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                  {quickViewProduct.rating}
                </span>
                <span className="text-xs text-gray-400">({quickViewProduct.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F] dark:text-white mb-2">
              {quickViewProduct.title}
            </h2>

            <div className="text-2xl font-serif font-bold text-[#2F5D50] dark:text-[#D6A34A] mb-4">
              ₹{parseFloat(selectedVariant.price.amount).toLocaleString('en-IN')}
              {selectedVariant.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through font-sans ml-2">
                  ₹{parseFloat(selectedVariant.compareAtPrice.amount).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Key Actives Pill List */}
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                Key Botanical Actives
              </span>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.ingredients.keyActives.map((act, i) => (
                  <span
                    key={i}
                    className="bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] text-[11px] font-semibold px-3 py-1 rounded-full"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Variant Selector */}
            {quickViewProduct.variants.length > 1 && (
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
                  Select Size
                </span>
                <div className="flex gap-3">
                  {quickViewProduct.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        selectedVariantIndex === i
                          ? 'border-[#2F5D50] bg-[#2F5D50] text-white'
                          : 'border-[#E8DFD8] dark:border-[#2C3834] text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E8DFD8] dark:border-[#2C3834] rounded-full px-3 py-2 bg-white dark:bg-[#1B2320]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-gray-500 font-bold hover:text-black"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-gray-500 font-bold hover:text-black"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(quickViewProduct, selectedVariant, quantity);
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-[#2F5D50] hover:bg-[#1f4238] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Add To Cart
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3.5 rounded-full border border-[#E8DFD8] dark:border-[#2C3834] transition-all ${
                  isLiked ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                const handle = quickViewProduct.handle;
                setQuickViewProduct(null);
                openProductPage(handle);
              }}
              className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] hover:underline flex items-center justify-center gap-1 py-1"
            >
              <span>View Full Clinical Details & Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
