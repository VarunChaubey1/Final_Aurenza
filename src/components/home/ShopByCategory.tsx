import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ShopByCategory: React.FC = () => {
  const { openCategoryPage, products } = useShop();

  const categories = [
    {
      title: 'Face Serum',
      subtitle: 'Targeted High-Potency Actives',
      defaultImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      categoryQuery: 'Face Serum',
      badge: 'High Potency Actives'
    },
    {
      title: 'Face Wash',
      subtitle: 'Low-pH Barrier Cleansers',
      defaultImage: 'https://images.unsplash.com/photo-1556228722-d1193828e40b?auto=format&fit=crop&q=80&w=800',
      categoryQuery: 'Face Wash',
      badge: 'Gentle Cleansers'
    },
    {
      title: 'Sunscreen',
      subtitle: 'Zero White Cast Protection',
      defaultImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      categoryQuery: 'Sunscreen',
      badge: 'Broad Spectrum'
    },
    {
      title: 'Hair Shampoo',
      subtitle: 'Restructuring Scalp Care',
      defaultImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
      categoryQuery: 'Shampoo',
      badge: 'Scalp & Root Care'
    },
    {
      title: 'Hair Oil',
      subtitle: 'Micro-Circulation Elixirs',
      defaultImage: 'https://images.unsplash.com/photo-1608248597369-23c2d43a6d71?auto=format&fit=crop&q=80&w=800',
      categoryQuery: 'Hair Oil',
      badge: 'Nourishing Elixirs'
    }
  ];

  // Helper to find a matching live Shopify product image for a category query
  const getCategoryImage = (catQuery: string, defaultImg: string) => {
    const match = products.find(p => 
      p.title.toLowerCase().includes(catQuery.toLowerCase()) || 
      p.subcategory.toLowerCase().includes(catQuery.toLowerCase()) ||
      p.productType.toLowerCase().includes(catQuery.toLowerCase())
    );
    return match?.featuredImage?.url || defaultImg;
  };

  return (
    <section className="py-20 bg-[#FFF9F4] dark:bg-[#121816] transition-colors border-b border-[#2F5D50]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D6A34A] block mb-2">
              Curated Regimens
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F5D50] dark:text-white">
              Shop By Category
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-4 md:mt-0 leading-relaxed">
            Target your specific skin and hair concerns with our scientifically formulated botanical regimens.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => openCategoryPage(cat.categoryQuery)}
              className="group relative h-96 rounded-[32px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-[#E8DFD8] dark:border-[#2C3834] flex flex-col justify-end p-6"
            >
              {/* Background Image */}
              <img
                src={getCategoryImage(cat.categoryQuery, cat.defaultImage)}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black/95" />

              {/* Top Badge */}
              <span className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                {cat.badge}
              </span>

              {/* Category Content */}
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#D6A34A] font-bold">
                  {cat.subtitle}
                </p>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#D6A34A] transition-colors">
                  {cat.title}
                </h3>
                <div className="pt-2 flex items-center gap-2 text-xs text-white/80 font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                  <span>Explore Lineup</span>
                  <ArrowRight className="w-4 h-4 text-[#D6A34A] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
