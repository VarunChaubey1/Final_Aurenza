import React from 'react';
import { ArrowRight, Star, Sparkles, Shield, Droplets } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface HeroProps {
  onShopNow: () => void;
  onExploreCollection: () => void;
  featuredProduct: Product;
  onSelectProduct: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onExploreCollection,
  featuredProduct,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#FFF9F4] dark:bg-[#121816] transition-colors pt-8 pb-16 lg:py-20 border-b border-[#2F5D50]/10">
      
      {/* Delicate background blur elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2F5D50]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D6A34A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Main Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5D50]/5 dark:bg-[#2C3834] border border-[#2F5D50]/15">
              <Sparkles className="w-4 h-4 text-[#D6A34A]" />
              <span className="text-xs font-serif italic text-[#2F5D50] dark:text-[#D6A34A] tracking-wider font-semibold">
                Elegance in Science • Pure Active Formulations
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-serif font-medium leading-[1.08] text-[#2F5D50] dark:text-[#F3F4F6] tracking-tight">
              Radiance <br />
              <span className="italic font-normal text-[#D6A34A] font-serif">Redefined.</span>
            </h1>

            {/* Body */}
            <p className="text-base sm:text-lg text-[#1F1F1F]/70 dark:text-[#F3F4F6]/80 max-w-lg leading-relaxed font-light">
              Experience clinical-grade D2C skincare infused with high-potency botanicals. Scientifically formulated for maximum efficacy and barrier protection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-hero-shop-now"
                onClick={onShopNow}
                className="bg-[#2F5D50] dark:bg-[#4A8172] text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#1a382f] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Shop Routine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-explore"
                onClick={onExploreCollection}
                className="border border-[#2F5D50] dark:border-[#D6A34A] text-[#2F5D50] dark:text-[#D6A34A] px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#2F5D50]/5 dark:hover:bg-[#2C3834] transition-all"
              >
                Explore Collections
              </button>
            </div>

            {/* Micro-Stats Bar */}
            <div className="pt-8 border-t border-black/5 dark:border-white/10 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="text-2xl sm:text-3xl font-serif text-[#D6A34A] font-bold">98%</div>
                <div className="text-[10px] uppercase tracking-wider text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60 font-bold mt-1">
                  Natural Origin
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif text-[#D6A34A] font-bold">24h</div>
                <div className="text-[10px] uppercase tracking-wider text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60 font-bold mt-1">
                  Barrier Hydration
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif text-[#D6A34A] font-bold">50k+</div>
                <div className="text-[10px] uppercase tracking-wider text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60 font-bold mt-1">
                  Happy Skin Users
                </div>
              </div>
            </div>

          </div>

          {/* Right Product Focus Pane */}
          <div className="lg:col-span-5">
            <div className="bg-[#2F5D50] rounded-[36px] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-8 border border-white/10">
              
              {/* Background gradient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A34A]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Product Container */}
              <div className="bg-white/10 backdrop-blur-md rounded-[28px] p-6 sm:p-8 border border-white/15 flex flex-col items-center text-center">
                
                {/* Image showcase */}
                <div
                  className="w-full h-64 rounded-2xl mb-6 relative overflow-hidden bg-white/5 flex items-center justify-center cursor-pointer group"
                  onClick={() => onSelectProduct(featuredProduct)}
                >
                  <img
                    src={featuredProduct.featuredImage.url}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white uppercase font-bold tracking-wider">
                    Hero Active
                  </span>
                </div>

                {/* Details */}
                <h3
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="font-serif text-2xl font-bold mb-1 hover:text-[#D6A34A] cursor-pointer transition-colors"
                >
                  {featuredProduct.title}
                </h3>
                <div className="text-[#D6A34A] text-xs font-semibold italic mb-3">
                  {featuredProduct.vendor || 'Shopify Store'} • {featuredProduct.category || 'Skincare Routine'}
                </div>

                {/* Star Rating (only when real review data exists) */}
                {typeof featuredProduct.rating === 'number' && (
                  <div className="flex items-center gap-1 mb-4 text-[#D6A34A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(featuredProduct.rating!) ? 'fill-[#D6A34A]' : 'opacity-30'}`} />
                    ))}
                    <span className="text-white/70 text-xs ml-2 font-sans font-bold">
                      ({featuredProduct.rating.toFixed(1)}/5{featuredProduct.reviewsCount ? ` • ${featuredProduct.reviewsCount} Reviews` : ''})
                    </span>
                  </div>
                )}

                {/* Price & Add */}
                <div className="text-3xl font-light tracking-tight mb-6">
                  ₹{parseFloat(featuredProduct.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                </div>

                <button
                  id="btn-hero-add-cart"
                  onClick={() => addToCart(featuredProduct, featuredProduct.variants[0], 1)}
                  className="w-full bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#c4923b] hover:scale-[0.99] transition-all shadow-lg"
                >
                  Add To Cart
                </button>
              </div>

              {/* Bottom Actives Pill Row */}
              <div className="flex items-center justify-between text-white/60 text-xs pt-2">
                <span className="uppercase tracking-widest text-[10px] font-bold text-white/40">
                  Tags / Actives:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] justify-end">
                  {(featuredProduct.tags && featuredProduct.tags.length > 0
                    ? featuredProduct.tags.slice(0, 3)
                    : featuredProduct.ingredients?.keyActives || ['Pure Active Formula']
                  ).map((act, i) => (
                    <span key={i} className="bg-white/10 px-2.5 py-1 rounded-lg text-white font-medium capitalize">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
