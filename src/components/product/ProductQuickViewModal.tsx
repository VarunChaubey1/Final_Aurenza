import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetail: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetail,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.featuredImage.url);
  const [added, setAdded] = useState(false);

  const priceNum = parseFloat(selectedVariant.price.amount);
  const comparePriceNum = selectedVariant.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div id="quickview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#FFF9F4] dark:bg-[#1B2320] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#2F5D50]/20 flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-quickview"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-[#1F1F1F] dark:text-white hover:bg-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 bg-white dark:bg-[#121816] flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-[#FFF9F4] dark:bg-[#1B2320]">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img.url
                      ? 'border-[#2F5D50] dark:border-[#D6A34A] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2">
              <span className="font-semibold uppercase tracking-widest text-[#D6A34A]">
                {product.subcategory}
              </span>
              <div className="flex items-center gap-1 text-[#D6A34A] font-bold">
                <Star className="w-4 h-4 fill-[#D6A34A]" />
                <span>{typeof product.rating === 'number' ? Number(product.rating).toFixed(1) : product.rating}</span>
                <span className="text-[#6B7280]">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] dark:text-[#F3F4F6] mb-3 leading-snug">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#2F5D50] dark:text-[#E5B35C]">
                ₹{priceNum.toLocaleString('en-IN')}
              </span>
              {comparePriceNum && (
                <span className="text-sm text-[#6B7280] line-through">
                  ₹{comparePriceNum.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                Taxes Included
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Key Active Ingredients */}
            <div className="mb-6 bg-[#2F5D50]/5 dark:bg-[#2C3834] p-3.5 rounded-2xl border border-[#2F5D50]/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] block mb-2">
                Key High-Potency Actives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.keyActives.map((active, i) => (
                  <span
                    key={i}
                    className="bg-white dark:bg-[#1B2320] text-[#1F1F1F] dark:text-[#F3F4F6] text-xs px-2.5 py-1 rounded-lg border border-[#2F5D50]/10 shadow-2xs font-medium"
                  >
                    ✨ {active}
                  </span>
                ))}
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-2">
                  Select Size / Pack:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        selectedVariant.id === variant.id
                          ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                          : 'border-[#2F5D50]/20 bg-white dark:bg-[#1B2320] text-[#1F1F1F] dark:text-[#F3F4F6] hover:border-[#2F5D50]'
                      }`}
                    >
                      <div>{variant.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">₹{parseFloat(variant.price.amount).toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#2F5D50]/20 bg-white dark:bg-[#1B2320] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-base font-bold text-[#1F1F1F] dark:text-[#F3F4F6] hover:bg-[#FFF9F4] rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-base font-bold text-[#1F1F1F] dark:text-[#F3F4F6] hover:bg-[#FFF9F4] rounded-r-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions & Buttons */}
          <div className="space-y-3 pt-2">
            <button
              id="btn-quickview-add-to-cart"
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#2F5D50] dark:bg-[#4A8172] text-white hover:bg-[#1a382f]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ₹{(priceNum * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <button
              id="btn-view-full-details"
              onClick={() => {
                onClose();
                onViewFullDetail(product);
              }}
              className="w-full border border-[#2F5D50] dark:border-[#D6A34A] text-[#2F5D50] dark:text-[#D6A34A] py-3 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#2F5D50]/5 flex items-center justify-center gap-2 transition-all"
            >
              <span>View Full Clinical Details & Reviews</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
