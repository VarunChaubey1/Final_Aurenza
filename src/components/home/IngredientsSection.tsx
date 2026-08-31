import React, { useState } from 'react';
import { KEY_INGREDIENTS } from '../../data/mockProducts';
import { useNavigate } from 'react-router-dom';
import { shopPath } from '../../context/UIContext';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface IngredientsSectionProps {
  onSelectIngredientFilter?: (ingredientName: string) => void;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  onSelectIngredientFilter,
}) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(KEY_INGREDIENTS[0].id);

  const activeIngredient = KEY_INGREDIENTS.find((i) => i.id === selectedId) || KEY_INGREDIENTS[0];

  const handleFilter = (name: string) => {
    if (onSelectIngredientFilter) {
      onSelectIngredientFilter(name);
    } else {
      navigate(shopPath({ ingredient: name }));
    }
  };

  return (
    <section id="ingredients-spotlight-section" className="py-20 bg-white dark:bg-[#1B2320] transition-colors border-y border-[#2F5D50]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Translucent Science
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
            Key Active Ingredients
          </h2>
          <p className="text-xs sm:text-sm text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70">
            We list precise active concentrations so you know exactly what touches your skin and scalp.
          </p>
        </div>

        {/* Horizontal Scroll / Selector Pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-10 justify-start lg:justify-center">
          {KEY_INGREDIENTS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                selectedId === item.id
                  ? 'bg-[#2F5D50] text-white border-[#2F5D50] shadow-md scale-105'
                  : 'bg-[#FFF9F4] dark:bg-[#121816] text-[#1F1F1F] dark:text-[#F3F4F6] border-[#2F5D50]/15 hover:border-[#2F5D50]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Active Ingredient Spotlight Detail Card */}
        <div className="bg-[#FFF9F4] dark:bg-[#121816] rounded-3xl p-6 sm:p-10 border border-[#2F5D50]/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
          
          {/* Image */}
          <div className="lg:col-span-5 h-72 lg:h-96 rounded-2xl overflow-hidden relative shadow-md">
            <img
              src={activeIngredient.image}
              alt={activeIngredient.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#2F5D50] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {activeIngredient.category}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-widest block mb-1">
                {activeIngredient.tagline}
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
                {activeIngredient.name}
              </h3>
            </div>

            <p className="text-sm text-[#1F1F1F]/80 dark:text-[#F3F4F6]/80 leading-relaxed font-light">
              {activeIngredient.description}
            </p>

            {/* Key Benefits List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-3">
                Clinical Benefits:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeIngredient.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1B2320] p-3 rounded-xl border border-[#2F5D50]/10 flex items-center gap-2 text-xs font-semibold text-[#2F5D50] dark:text-[#E5B35C]"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-[#D6A34A]" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable For */}
            <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <strong>Ideal Target:</strong> {activeIngredient.suitableFor}
            </div>

            {/* Filter Action */}
            <button
              id={`btn-filter-ingredient-${activeIngredient.id}`}
              onClick={() => handleFilter(activeIngredient.name)}
              className="bg-[#2F5D50] dark:bg-[#4A8172] text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[#1a382f] transition-all shadow-md"
            >
              <span>Explore Products Formulated with {activeIngredient.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
