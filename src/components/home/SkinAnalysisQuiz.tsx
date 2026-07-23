import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

export const SkinAnalysisQuiz: React.FC = () => {
  const { openProductPage, addToCart, products } = useShop();

  const [step, setStep] = useState<number>(1);
  const [targetArea, setTargetArea] = useState<'Skin' | 'Hair' | 'Both'>('Skin');
  const [skinType, setSkinType] = useState<string>('Combination');
  const [concern, setConcern] = useState<string>('Dark Spots');
  const [texture, setTexture] = useState<string>('Light Serum');
  const [results, setResults] = useState<Product[] | null>(null);

  const handleCalculate = () => {
    let matched = products.filter(p => {
      if (targetArea === 'Skin' && p.category !== 'Skin Care') return false;
      if (targetArea === 'Hair' && p.category !== 'Hair Care') return false;
      return true;
    });

    if (matched.length === 0) matched = products;

    setResults(matched.slice(0, 3));
    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <section className="py-20 bg-white dark:bg-[#121816] transition-colors border-b border-[#2F5D50]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#FFF9F4] dark:bg-[#1B2320] rounded-[40px] p-8 sm:p-12 border border-[#E8DFD8] dark:border-[#2C3834] shadow-xl relative">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] text-[10px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D6A34A]" />
              AI Skin & Scalp Diagnostic
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2F5D50] dark:text-white">
              Discover Your Custom Regimen
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Answer 4 quick clinical questions to build your personalized botanical active routine.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mb-8 max-w-md mx-auto">
            <div
              className="bg-[#2F5D50] dark:bg-[#D6A34A] h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Step 1: Target Area */}
          {step === 1 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-white">
                1. What is your primary focus area today?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {(['Skin', 'Hair', 'Both'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setTargetArea(option);
                      setStep(2);
                    }}
                    className={`p-6 rounded-3xl border-2 font-bold uppercase text-xs tracking-wider transition-all ${
                      targetArea === option
                        ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                        : 'border-[#E8DFD8] dark:border-[#2C3834] bg-white dark:bg-[#121816] text-gray-800 dark:text-gray-200 hover:border-[#2F5D50]'
                    }`}
                  >
                    {option === 'Skin' ? '✨ Skin Care' : option === 'Hair' ? '🌿 Hair & Scalp' : '💎 Complete Ritual'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skin Type */}
          {step === 2 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-white">
                2. How would you describe your skin/scalp type?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                {['Oily / Sebum Heavy', 'Dry / Tight', 'Combination', 'Sensitive / Reactive'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setSkinType(type);
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                      skinType === type
                        ? 'border-[#2F5D50] bg-[#2F5D50] text-white'
                        : 'border-[#E8DFD8] dark:border-[#2C3834] bg-white dark:bg-[#121816] text-gray-800 dark:text-gray-200 hover:border-[#2F5D50]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-gray-400 underline pt-2">Back</button>
            </div>
          )}

          {/* Step 3: Concern */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-white">
                3. What is your #1 concern to address?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                {['Dark Spots & Pigmentation', 'Hair Loss & Thinning', 'Acne & Enlarged Pores', 'Dullness & Lack of Glow', 'Dryness & Flakiness', 'Fine Lines & Aging'].map(conc => (
                  <button
                    key={conc}
                    onClick={() => {
                      setConcern(conc);
                      setStep(4);
                    }}
                    className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                      concern === conc
                        ? 'border-[#2F5D50] bg-[#2F5D50] text-white'
                        : 'border-[#E8DFD8] dark:border-[#2C3834] bg-white dark:bg-[#121816] text-gray-800 dark:text-gray-200 hover:border-[#2F5D50]'
                    }`}
                  >
                    {conc}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-gray-400 underline pt-2">Back</button>
            </div>
          )}

          {/* Step 4: Texture */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h3 className="font-serif text-xl font-bold text-[#1F1F1F] dark:text-white">
                4. What texture do you prefer?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {['Fast Absorbing Water Serum', 'Rich Velvet Cream', 'Non-Sticky Hair Oil'].map(tex => (
                  <button
                    key={tex}
                    onClick={() => {
                      setTexture(tex);
                      handleCalculate();
                    }}
                    className="p-4 rounded-2xl border-2 border-[#E8DFD8] dark:border-[#2C3834] bg-white dark:bg-[#121816] hover:border-[#2F5D50] text-xs font-bold transition-all"
                  >
                    {tex}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="text-xs text-gray-400 underline pt-2">Back</button>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && results && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <span className="text-xs font-bold text-[#D6A34A] uppercase tracking-widest block mb-1">
                  Custom Diagnostics Complete
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2F5D50] dark:text-white">
                  Your Personalized Prescribed Regimen
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tailored for {skinType} skin targeting {concern}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {results.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-[#121816] rounded-3xl p-5 border border-[#E8DFD8] dark:border-[#2C3834] flex flex-col justify-between"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                      <img src={prod.featuredImage.url} alt={prod.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#D6A34A]">
                        {prod.subcategory}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1F1F1F] dark:text-white line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-[#2F5D50] dark:text-[#D6A34A] font-bold mt-1">
                        ₹{parseFloat(prod.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openProductPage(prod.handle)}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold py-2 rounded-xl"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(prod)}
                        className="bg-[#2F5D50] text-white p-2 rounded-xl"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic Quiz
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
