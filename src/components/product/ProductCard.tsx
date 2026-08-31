import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = product.compareAtPriceRange?.minVariantPrice.amount
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.variants[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPct = comparePrice
    ? Math.round(((comparePrice - minPrice) / comparePrice) * 100)
    : null;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer bg-white dark:bg-[#1B2320] rounded-3xl p-4 border border-[#2F5D50]/10 dark:border-[#2C3834] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Badges & Wishlist */}
      <div className="relative w-full aspect-square bg-[#FFF9F4] dark:bg-[#121816] rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
        
        {/* Product Image */}
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#2F5D50] text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#D6A34A] text-[#1F1F1F] px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
              New Drop
            </span>
          )}
          {discountPct && discountPct > 0 && (
            <span className="bg-red-700 text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-[#1F1F1F] dark:text-white hover:text-red-500 transition-all z-10 shadow-sm"
          title="Add to Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          <button
            id={`btn-quickview-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white/90 text-[#1F1F1F] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white shadow-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">
            <span className="font-medium uppercase tracking-wider text-[11px] text-[#D6A34A]">
              {product.subcategory}
            </span>
            {typeof product.rating === 'number' && (
              <div className="flex items-center gap-1 text-[#D6A34A] font-semibold text-[11px]">
                <Star className="w-3.5 h-3.5 fill-[#D6A34A]" />
                <span>{product.rating.toFixed(1)}</span>
                {product.reviewsCount ? <span className="text-[#6B7280] dark:text-[#9CA3AF]">({product.reviewsCount})</span> : null}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-[#1F1F1F] dark:text-[#F3F4F6] line-clamp-2 leading-snug group-hover:text-[#2F5D50] dark:group-hover:text-[#D6A34A] transition-colors">
            {product.title}
          </h3>

          {/* Key Ingredients Actives Pill preview */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.ingredients.keyActives.slice(0, 2).map((active, idx) => (
              <span
                key={idx}
                className="bg-[#2F5D50]/5 dark:bg-[#2C3834] text-[#2F5D50] dark:text-[#E5B35C] text-[10px] px-2 py-0.5 rounded-md font-medium"
              >
                {active}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-[#2F5D50]/10 dark:border-[#2C3834] flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#2F5D50] dark:text-[#E5B35C]">
              ₹{minPrice.toLocaleString('en-IN')}
            </span>
            {comparePrice && (
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#2F5D50] dark:bg-[#4A8172] text-white hover:bg-[#1a382f]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
