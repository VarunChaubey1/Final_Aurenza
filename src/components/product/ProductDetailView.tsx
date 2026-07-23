import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { getProductByHandle, getProducts } from '../../services/shopify';
import { Product } from '../../types';
import { Star, ShieldCheck, Heart, ShoppingBag, Truck, RotateCcw, CheckCircle2, ChevronRight, Sparkles, Droplet, Award } from 'lucide-react';
import { ReviewsSection } from './ReviewsSection';
import { ProductGrid } from './ProductGrid';

export const ProductDetailView: React.FC = () => {
  const { selectedProductHandle, addToCart, isInWishlist, toggleWishlist, openProductPage, setIsCartOpen } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'directions' | 'dermatologist'>('benefits');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      if (selectedProductHandle) {
        const found = await getProductByHandle(selectedProductHandle);
        setProduct(found);
        setActiveImageIndex(0);
        setSelectedVariantIndex(0);

        if (found) {
          const res = await getProducts({ first: 8 });
          const filtered = res.products.filter(p => p.id !== found.id);
          setRelatedProducts(filtered.slice(0, 4));
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [selectedProductHandle]);

  if (loading || !product) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#2F5D50] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading Clinical Formulation...</p>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const isLiked = isInWishlist(product.id);
  const priceNum = parseFloat(selectedVariant.price.amount);
  const compareNum = selectedVariant.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="bg-[#FFF9F4] dark:bg-[#121816] transition-colors py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-medium">
          <button onClick={() => openProductPage('vitamin-c-radiance-serum')} className="hover:text-black dark:hover:text-white">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#2F5D50] dark:text-[#D6A34A] font-bold">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 dark:text-gray-200 line-clamp-1">{product.title}</span>
        </div>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Image Gallery with Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white dark:bg-[#1B2320] rounded-[32px] overflow-hidden border border-[#E8DFD8] dark:border-[#2C3834] shadow-lg group">
              <img
                src={product.images[activeImageIndex]?.url || product.featuredImage.url}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />

              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-[#2F5D50] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A34A]" /> Best Seller
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                  isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 dark:bg-black/50 text-gray-600 dark:text-gray-300'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-[#2F5D50] dark:border-[#D6A34A] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Actions & Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#D6A34A] bg-[#D6A34A]/10 px-3 py-1 rounded-full">
                  {product.subcategory}
                </span>
                <div className="flex items-center gap-1.5 text-[#D6A34A] text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-900 dark:text-white">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F] dark:text-white leading-tight">
                {product.title}
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                Vendor: <span className="text-[#2F5D50] dark:text-[#D6A34A] font-bold">{product.vendor}</span>
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white dark:bg-[#1B2320] rounded-2xl border border-[#E8DFD8] dark:border-[#2C3834] flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                ₹{priceNum.toLocaleString('en-IN')}
              </span>
              {compareNum && (
                <span className="text-base text-gray-400 line-through">
                  ₹{compareNum.toLocaleString('en-IN')}
                </span>
              )}
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full">
                In Stock & Ready to Ship
              </span>
            </div>

            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Size Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-gray-500">
                  Select Size / Volume
                </span>
                <div className="flex gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${
                        selectedVariantIndex === i
                          ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                          : 'border-[#E8DFD8] dark:border-[#2C3834] bg-white dark:bg-[#121816] text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E8DFD8] dark:border-[#2C3834] rounded-full px-4 py-2.5 bg-white dark:bg-[#1B2320]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 font-bold text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-sm text-[#1F1F1F] dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 font-bold text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  className="flex-1 bg-[#2F5D50] hover:bg-[#1f4238] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add To Cart
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#D6A34A] hover:bg-[#e0b25d] text-[#1F1F1F] py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-xl transition-all"
              >
                Instant Express Checkout
              </button>
            </div>

            {/* Guarantees bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#2F5D50]" />
                <span>Express 48h Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#2F5D50]" />
                <span>7-Day Easy Return</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#2F5D50]" />
                <span>256-Bit SSL Payment</span>
              </div>
            </div>

          </div>

        </div>

        {/* Clinical Tabs Section */}
        <div className="bg-white dark:bg-[#1B2320] rounded-[32px] p-8 sm:p-12 border border-[#E8DFD8] dark:border-[#2C3834] shadow-md mb-16">
          <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'benefits'
                  ? 'border-[#2F5D50] text-[#2F5D50] dark:text-[#D6A34A]'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Key Benefits
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'ingredients'
                  ? 'border-[#2F5D50] text-[#2F5D50] dark:text-[#D6A34A]'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Full Ingredients
            </button>
            <button
              onClick={() => setActiveTab('directions')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'directions'
                  ? 'border-[#2F5D50] text-[#2F5D50] dark:text-[#D6A34A]'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              How To Apply
            </button>
            {product.dermatologistNote && (
              <button
                onClick={() => setActiveTab('dermatologist')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'dermatologist'
                    ? 'border-[#2F5D50] text-[#2F5D50] dark:text-[#D6A34A]'
                    : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                Dermatologist Note
              </button>
            )}
          </div>

          {/* Tab Contents */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-white">
                Targeted Clinical Action
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.benefits.map((ben, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-[#FFF9F4] dark:bg-[#121816] rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-[#2F5D50] dark:text-[#D6A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest text-[#D6A34A] mb-3">
                  High-Potency Active Complex
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.keyActives.map((act, i) => (
                    <span
                      key={i}
                      className="bg-[#2F5D50] text-white text-xs font-bold px-4 py-2 rounded-full"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-2">
                  Complete INCI Formula List
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                  {product.ingredients.fullList}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'directions' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-white">
                Application Instructions
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed p-4 bg-[#FFF9F4] dark:bg-[#121816] rounded-2xl">
                {product.directions}
              </p>
            </div>
          )}

          {activeTab === 'dermatologist' && product.dermatologistNote && (
            <div className="p-6 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-2xl border border-[#2F5D50]/20 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A]">
                <Award className="w-4 h-4" /> Dermatologist Formulation Insight
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-200 italic leading-relaxed">
                "{product.dermatologistNote}"
              </p>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <ReviewsSection reviews={product.reviews} rating={product.rating} reviewsCount={product.reviewsCount} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12">
            <ProductGrid
              products={relatedProducts}
              title="Complementary Regimen Actives"
              subtitle="Formulated to Layer Synergistically"
            />
          </div>
        )}

      </div>
    </div>
  );
};
