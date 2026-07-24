import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  Star,
  ShoppingBag,
  Zap,
  Check,
  Heart,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MessageSquarePlus,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: () => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBackToShop,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart, openCheckout } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.featuredImage.url);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'ingredients' | 'benefits' | 'directions' | 'reviews'>('ingredients');

  // Customer Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const priceNum = parseFloat(selectedVariant.price.amount);
  const comparePriceNum = selectedVariant.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    openCheckout();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewContent) return;

    const reviewObj = {
      id: `rev_${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Visible results!',
      content: newReviewContent,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true,
    };

    setLocalReviews([reviewObj, ...localReviews]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setNewReviewAuthor('');
      setNewReviewTitle('');
      setNewReviewContent('');
    }, 2000);
  };

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div id="product-detail-page" className="py-10 bg-[#FFF9F4] dark:bg-[#121816] transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop Catalog
        </button>

        {/* Main Product Layout: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white dark:bg-[#1B2320] p-6 sm:p-12 rounded-3xl border border-[#2F5D50]/15 shadow-xl">
          
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF9F4] dark:bg-[#121816] border border-[#2F5D50]/10 shadow-inner group">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out cursor-zoom-in"
              />

              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-[#1F1F1F] dark:text-white hover:text-red-500 shadow-md transition-all"
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img.url
                        ? 'border-[#2F5D50] dark:border-[#D6A34A] scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Clinical Guarantee Badges */}
            <div className="pt-6 border-t border-[#2F5D50]/10 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A]">
              <div className="p-3 bg-[#2F5D50]/5 dark:bg-[#2C3834] rounded-2xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5" />
                <span>Derm Tested</span>
              </div>
              <div className="p-3 bg-[#2F5D50]/5 dark:bg-[#2C3834] rounded-2xl flex flex-col items-center gap-1">
                <Truck className="w-5 h-5" />
                <span>Fast Express COD</span>
              </div>
              <div className="p-3 bg-[#2F5D50]/5 dark:bg-[#2C3834] rounded-2xl flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>

          {/* Right: Info, Price, Actions, Accordions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[#D6A34A] mb-2">
                <span>{product.subcategory}</span>
                <div className="flex items-center gap-1 text-[#D6A34A]">
                  <Star className="w-4 h-4 fill-[#D6A34A]" />
                  <span>{typeof product.rating === 'number' ? Number(product.rating).toFixed(1) : product.rating}</span>
                  <span className="text-[#6B7280]">({localReviews.length + product.reviewsCount} Reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1F1F] dark:text-[#F3F4F6] leading-tight mb-3">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-[#2F5D50] dark:text-[#E5B35C]">
                  ₹{priceNum.toLocaleString('en-IN')}
                </span>
                {comparePriceNum && (
                  <span className="text-base text-[#6B7280] line-through">
                    ₹{comparePriceNum.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-sm text-[#1F1F1F]/80 dark:text-[#F3F4F6]/80 leading-relaxed font-light mb-6">
                {product.description}
              </p>

              {/* Dermatologist Note */}
              {product.dermatologistNote && (
                <div className="bg-[#2F5D50]/5 dark:bg-[#2C3834] p-4 rounded-2xl border border-[#2F5D50]/15 mb-6 text-xs text-[#2F5D50] dark:text-[#D6A34A]">
                  <strong className="block font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D6A34A]" />
                    Dermatologist Verification Note:
                  </strong>
                  "{product.dermatologistNote}"
                </div>
              )}
            </div>

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] block">
                  Select Size / Packaging:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all ${
                        selectedVariant.id === v.id
                          ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                          : 'border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#121816] text-[#1F1F1F] dark:text-[#F3F4F6]'
                      }`}
                    >
                      <div>{v.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">₹{parseFloat(v.price.amount).toLocaleString('en-IN')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6]">
                Quantity:
              </label>
              <div className="flex items-center border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#121816] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 font-bold text-base hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 font-bold text-base hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="btn-pdp-add-cart"
                onClick={handleAddToCart}
                className={`py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  added ? 'bg-emerald-700 text-white' : 'bg-[#2F5D50] dark:bg-[#4A8172] text-white hover:bg-[#1a382f]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart</span>
                  </>
                )}
              </button>

              <button
                id="btn-pdp-buy-now"
                onClick={handleBuyNow}
                className="bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#c4923b] shadow-lg transition-all"
              >
                <Zap className="w-4 h-4 fill-[#1F1F1F]" />
                <span>Express Buy Now</span>
              </button>
            </div>

            {/* Accordion Sections: Ingredients, Benefits, Directions, Reviews */}
            <div className="pt-6 border-t border-[#2F5D50]/15 space-y-3">
              
              {/* Accordion 1: Key Actives & Ingredients */}
              <div className="border border-[#2F5D50]/15 rounded-2xl overflow-hidden bg-[#FFF9F4] dark:bg-[#121816]">
                <button
                  onClick={() => setOpenSection(openSection === 'ingredients' ? ('' as any) : 'ingredients')}
                  className="w-full p-4 text-left font-serif font-bold text-base flex items-center justify-between text-[#2F5D50] dark:text-[#F3F4F6]"
                >
                  <span>✨ Ingredients & Key Actives</span>
                  {openSection === 'ingredients' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'ingredients' && (
                  <div className="p-4 pt-0 text-xs space-y-3 border-t border-[#2F5D50]/10">
                    <div>
                      <strong className="text-[#D6A34A] block mb-1 uppercase font-bold">Key Active Ingredients:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        {product.ingredients.keyActives.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="block mb-1 font-bold text-[#1F1F1F] dark:text-[#F3F4F6]">Full INCI List:</strong>
                      <p className="text-[#6B7280] leading-relaxed">{product.ingredients.fullList}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Clinical Benefits */}
              <div className="border border-[#2F5D50]/15 rounded-2xl overflow-hidden bg-[#FFF9F4] dark:bg-[#121816]">
                <button
                  onClick={() => setOpenSection(openSection === 'benefits' ? ('' as any) : 'benefits')}
                  className="w-full p-4 text-left font-serif font-bold text-base flex items-center justify-between text-[#2F5D50] dark:text-[#F3F4F6]"
                >
                  <span>🌿 Clinical Benefits & Results</span>
                  {openSection === 'benefits' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'benefits' && (
                  <div className="p-4 pt-0 text-xs space-y-2 border-t border-[#2F5D50]/10">
                    {product.benefits.map((ben, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: How to Apply */}
              <div className="border border-[#2F5D50]/15 rounded-2xl overflow-hidden bg-[#FFF9F4] dark:bg-[#121816]">
                <button
                  onClick={() => setOpenSection(openSection === 'directions' ? ('' as any) : 'directions')}
                  className="w-full p-4 text-left font-serif font-bold text-base flex items-center justify-between text-[#2F5D50] dark:text-[#F3F4F6]"
                >
                  <span>💧 How To Use / Directions</span>
                  {openSection === 'directions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'directions' && (
                  <div className="p-4 pt-0 text-xs text-[#1F1F1F]/80 dark:text-[#F3F4F6]/80 leading-relaxed border-t border-[#2F5D50]/10">
                    {product.directions}
                  </div>
                )}
              </div>

              {/* Accordion 4: Customer Reviews */}
              <div className="border border-[#2F5D50]/15 rounded-2xl overflow-hidden bg-[#FFF9F4] dark:bg-[#121816]">
                <button
                  onClick={() => setOpenSection(openSection === 'reviews' ? ('' as any) : 'reviews')}
                  className="w-full p-4 text-left font-serif font-bold text-base flex items-center justify-between text-[#2F5D50] dark:text-[#F3F4F6]"
                >
                  <span>⭐ Verified Customer Reviews ({localReviews.length})</span>
                  {openSection === 'reviews' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSection === 'reviews' && (
                  <div className="p-4 pt-0 space-y-4 border-t border-[#2F5D50]/10">
                    
                    {/* Add Review Button */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280]">Average Rating: <strong>{typeof product.rating === 'number' ? Number(product.rating).toFixed(1) : product.rating} / 5</strong></span>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-xs bg-[#2F5D50] text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        Write A Review
                      </button>
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleAddReview} className="bg-white dark:bg-[#1B2320] p-4 rounded-2xl border border-[#2F5D50]/20 space-y-3">
                        <h5 className="font-bold text-xs uppercase text-[#2F5D50]">Share Your Experience</h5>
                        {reviewSubmitted ? (
                          <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl">
                            Thank you! Your review has been submitted.
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={newReviewAuthor}
                                onChange={(e) => setNewReviewAuthor(e.target.value)}
                                className="bg-[#FFF9F4] dark:bg-[#121816] p-2 rounded-xl text-xs border border-gray-300"
                              />
                              <select
                                value={newReviewRating}
                                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                                className="bg-[#FFF9F4] dark:bg-[#121816] p-2 rounded-xl text-xs border border-gray-300 font-bold"
                              >
                                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              placeholder="Review Headline"
                              value={newReviewTitle}
                              onChange={(e) => setNewReviewTitle(e.target.value)}
                              className="w-full bg-[#FFF9F4] dark:bg-[#121816] p-2 rounded-xl text-xs border border-gray-300"
                            />
                            <textarea
                              required
                              placeholder="Write your thoughts..."
                              rows={2}
                              value={newReviewContent}
                              onChange={(e) => setNewReviewContent(e.target.value)}
                              className="w-full bg-[#FFF9F4] dark:bg-[#121816] p-2 rounded-xl text-xs border border-gray-300"
                            />
                            <button
                              type="submit"
                              className="w-full bg-[#D6A34A] text-[#1F1F1F] py-2.5 rounded-xl font-bold uppercase text-xs"
                            >
                              Post Review
                            </button>
                          </>
                        )}
                      </form>
                    )}

                    {/* Review Item List */}
                    <div className="space-y-3">
                      {localReviews.length === 0 ? (
                        <p className="text-xs text-[#6B7280]">No reviews written yet. Be the first!</p>
                      ) : (
                        localReviews.map((rev) => (
                          <div key={rev.id} className="bg-white dark:bg-[#1B2320] p-3.5 rounded-xl border border-[#2F5D50]/10 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex text-[#D6A34A]">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-[#D6A34A]" />
                                ))}
                              </div>
                              <span className="text-[10px] text-[#6B7280]">{rev.date}</span>
                            </div>
                            <div className="font-bold text-[#1F1F1F] dark:text-[#F3F4F6]">{rev.title}</div>
                            <p className="text-[#6B7280]">{rev.content}</p>
                            <div className="text-[10px] text-emerald-700 font-bold">
                              ✓ {rev.author} (Verified Buyer)
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6] mb-8">
              Complete Your Regimen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={onQuickView}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
