import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useUI } from '../../context/UIContext';

export const InstagramGallery: React.FC = () => {
  const { products } = useShop();
  const { goToProduct } = useUI();

  const posts = products.slice(0, 4).map((prod, index) => ({
    id: prod.id,
    image: prod.featuredImage?.url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    likes: `${(1.8 + index * 0.7).toFixed(1)}k`,
    tag: `#${prod.title.replace(/[^a-zA-Z0-9]/g, '')}`,
    product: prod,
  }));

  return (
    <section id="instagram-gallery-section" className="py-20 bg-white dark:bg-[#1B2320] transition-colors border-t border-[#2F5D50]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-[0.2em] mb-2 block flex items-center gap-1.5">
              <Instagram className="w-4 h-4" />
              Follow @aurenzaluxe
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
              #AurenzaCommunity
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] hover:underline"
          >
            Join 120,000+ Glow Seekers on Instagram &rarr;
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => goToProduct(post.product)}
              className="group relative rounded-3xl overflow-hidden aspect-square shadow-sm bg-[#FFF9F4] dark:bg-[#121816] cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.tag}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                <Instagram className="w-7 h-7 mb-2 text-[#D6A34A]" />
                <span className="text-xs font-bold mb-1 line-clamp-1">{post.tag}</span>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-white" />
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
