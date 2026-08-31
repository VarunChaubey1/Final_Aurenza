import React from 'react';
import { MOCK_TESTIMONIALS } from '../../data/mockProducts';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials-section" className="py-20 bg-[#FFF9F4] dark:bg-[#121816] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-[0.25em]">
            Real Results
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
            Customer Stories
          </h2>
          <p className="text-xs sm:text-sm text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60">
            Over 50,000 verified buyers trust Aurenza for daily active skin and scalp care.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-[#1B2320] rounded-3xl p-8 border border-[#2F5D50]/10 shadow-lg flex flex-col justify-between relative"
            >
              <Quote className="w-10 h-10 text-[#D6A34A]/20 absolute top-6 right-6" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-[#D6A34A] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D6A34A]" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-[#1F1F1F]/80 dark:text-[#F3F4F6]/80 leading-relaxed font-light mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              <div>
                {/* Product Tag */}
                <div className="bg-[#2F5D50]/5 dark:bg-[#2C3834] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#2F5D50] dark:text-[#D6A34A] mb-4">
                  Favorite: {t.favoriteProduct}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#2F5D50]/10">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#D6A34A]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1F1F1F] dark:text-[#F3F4F6] flex items-center gap-1.5">
                      <span>{t.author}, {t.age}</span>
                      {t.verifiedBuyer && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-label="Verified Buyer" role="img" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#6B7280]">{t.location}</div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
