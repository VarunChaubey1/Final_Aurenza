import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: string, subcategory?: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'cat_serum',
      name: 'Face Serums',
      subcategory: 'Face Serum',
      category: 'Skin Care',
      tagline: 'High-Concentration Active Drops',
      itemCount: 'Vitamin C, Niacinamide & Glutathione',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat_facewash',
      name: 'Face Wash & Cleansers',
      subcategory: 'Face Wash',
      category: 'Skin Care',
      tagline: 'pH 5.5 Balanced Foaming Cleansers',
      itemCount: 'Purifying & Pore Refining',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat_sunscreen',
      name: 'Water Gel Sunscreens',
      subcategory: 'Sunscreen',
      category: 'Skin Care',
      tagline: 'Invisible PA++++ UV Shield',
      itemCount: 'Zero White Cast SPF 50+',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat_hairoil',
      name: 'Rosemary Hair Oils',
      subcategory: 'Hair Oil',
      category: 'Hair Care',
      tagline: 'Root Strengthening Elixirs',
      itemCount: 'Rosemary, Biotin & Onion Seeds',
      image: 'https://images.unsplash.com/photo-1608248597369-23c2d43a6d71?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat_shampoo',
      name: 'Keratin Shampoos',
      subcategory: 'Shampoo',
      category: 'Hair Care',
      tagline: 'Cuticle Repairing Formulations',
      itemCount: 'Anti-Hairfall & Frizz Control',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="shop-by-category-section" className="py-20 bg-[#FFF9F4] dark:bg-[#121816] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
              Curated Regimens
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
              Shop By Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60 max-w-sm mt-3 md:mt-0">
            Targeted active products engineered for specific skin concerns and hair root strengthening.
          </p>
        </div>

        {/* Categories BENTO / GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.category, cat.subcategory)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer h-80 shadow-md border border-[#2F5D50]/10 ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-end text-white">
                <span className="text-[#D6A34A] text-[11px] font-bold uppercase tracking-widest mb-1">
                  {cat.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-1 group-hover:text-[#D6A34A] transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-white/80 mt-2">
                  <span>{cat.itemCount}</span>
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#D6A34A] group-hover:text-[#1F1F1F] transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
