import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const QUIZ_DATA = {
  Skin: {
    concernQuestion: "What is your primary skin concern?",
    concerns: [
      "✨ Dullness & Dark Spots",
      "🌿 Acne & Enlarged Pores",
      "☀️ Sun Damage & Tanning",
      "💧 Dehydration & Fine Lines",
      "🍃 Rough Texture & Bumps",
      "🌸 Redness & Barrier Sensitivity",
    ],
    profileQuestion: "What is your skin type?",
    profiles: [
      "Oily / Sebum Heavy",
      "Dry & Flaky Skin",
      "Combination (T-Zone Oily)",
      "Sensitive / Easily Irritated",
    ],
  },
  Hair: {
    concernQuestion: "What is your primary hair & scalp concern?",
    concerns: [
      "🌱 Hair Fall & Hair Thinning",
      "❄️ Dandruff & Scalp Itchiness",
      "🌊 Frizz & Rough Cuticles",
      "💧 Dry, Brittle Ends & Split Ends",
      "🌿 Oily Roots & Heavy Flat Hair",
      "🔥 Heat & Chemical Damage",
    ],
    profileQuestion: "What is your hair & scalp profile?",
    profiles: [
      "Dry & Flaky Scalp",
      "Oily Scalp with Dry Ends",
      "Normal / Balanced Hair",
      "Sensitive & Irritated Scalp",
    ],
  },
  Both: {
    concernQuestion: "What is your combined skin & hair concern?",
    concerns: [
      "✨ Glowing Skin + Hair Growth",
      "🌿 Acne Control + Scalp Detox",
      "💧 Hydrated Skin + Frizz Control",
      "☀️ Sun Repair + Damaged Strands",
      "🌸 Sensitive Skin + Soothed Scalp",
      "💎 Anti-Aging Face + Hair Density",
    ],
    profileQuestion: "What is your overall skin & scalp profile?",
    profiles: [
      "Combination Skin + Normal Scalp",
      "Oily Skin + Oily Scalp",
      "Dry Skin + Dry Scalp",
      "Sensitive Skin + Sensitive Scalp",
    ],
  },
};

export const SkinQuizModal: React.FC<SkinQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products } = useShop();

  if (!isOpen) return null;

  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState<'Skin' | 'Hair' | 'Both'>('Skin');
  const [concern, setConcern] = useState<string>(QUIZ_DATA.Skin.concerns[0]);
  const [skinType, setSkinType] = useState<string>(QUIZ_DATA.Skin.profiles[0]);
  const [addedBundle, setAddedBundle] = useState(false);

  const handleSelectTarget = (t: 'Skin' | 'Hair' | 'Both') => {
    setTarget(t);
    setConcern(QUIZ_DATA[t].concerns[0]);
    setSkinType(QUIZ_DATA[t].profiles[0]);
  };

  const getRecommendedProducts = (): Product[] => {
    if (products.length === 0) return [];
    if (target === 'Hair') {
      const hairProds = products.filter((p) => p.category === 'Hair Care');
      return hairProds.length > 0 ? hairProds.slice(0, 2) : products.slice(0, 2);
    }
    if (target === 'Skin') {
      const skinProds = products.filter((p) => p.category === 'Skin Care');
      return skinProds.length > 0 ? skinProds.slice(0, 2) : products.slice(0, 2);
    }
    // For Both: Pick 1 Skin Care + 1 Hair Care
    const skinProd = products.find((p) => p.category === 'Skin Care');
    const hairProd = products.find((p) => p.category === 'Hair Care');
    const combo = [skinProd, hairProd].filter(Boolean) as Product[];
    return combo.length > 0 ? combo : products.slice(0, 2);
  };

  const recommendedList = getRecommendedProducts();

  const handleAddBundle = () => {
    recommendedList.forEach((p) => addToCart(p, p.variants[0], 1));
    setAddedBundle(true);
    setTimeout(() => {
      setAddedBundle(false);
      onClose();
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setTarget('Skin');
    setConcern(QUIZ_DATA.Skin.concerns[0]);
    setSkinType(QUIZ_DATA.Skin.profiles[0]);
  };

  const currentQuizData = QUIZ_DATA[target];

  return (
    <div id="routine-quiz-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F4] dark:bg-[#1B2320] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[#2F5D50]/20 shadow-2xl relative text-[#1F1F1F] dark:text-[#F3F4F6]">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1F1F1F] dark:text-white hover:text-[#2F5D50] rounded-full hover:bg-black/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-[#D6A34A] text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          Aurenza Diagnostic Engine
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6] mb-6">
          60-Second Routine Finder
        </h3>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= i ? 'bg-[#2F5D50] dark:bg-[#D6A34A]' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Target Focus */}
        {step === 1 && (
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-bold">What is your primary care focus?</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['Skin', 'Hair', 'Both'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSelectTarget(t)}
                  className={`p-5 rounded-2xl border text-center font-bold text-sm transition-all ${
                    target === t
                      ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                      : 'border-[#2F5D50]/20 bg-white dark:bg-[#121816] hover:border-[#2F5D50]'
                  }`}
                >
                  {t === 'Skin' ? '✨ Skin Care' : t === 'Hair' ? '🌿 Hair Care' : '🌟 Skin & Hair'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#c4923b]"
            >
              <span>Next Step ({target} Care)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Concern */}
        {step === 2 && (
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-bold">{currentQuizData.concernQuestion}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuizData.concerns.map((c) => (
                <button
                  key={c}
                  onClick={() => setConcern(c)}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs transition-all ${
                    concern === c
                      ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                      : 'border-[#2F5D50]/20 bg-white dark:bg-[#121816] hover:border-[#2F5D50]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-2xl border border-gray-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skin / Scalp Type */}
        {step === 3 && (
          <div className="space-y-6">
            <h4 className="text-lg font-serif font-bold">{currentQuizData.profileQuestion}</h4>
            <div className="grid grid-cols-2 gap-3">
              {currentQuizData.profiles.map((st) => (
                <button
                  key={st}
                  onClick={() => setSkinType(st)}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all ${
                    skinType === st
                      ? 'border-[#2F5D50] bg-[#2F5D50] text-white shadow-md'
                      : 'border-[#2F5D50]/20 bg-white dark:bg-[#121816] hover:border-[#2F5D50]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-4 rounded-2xl border border-gray-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-[#2F5D50] text-white py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <span>Generate My Custom Regimen</span>
                <Sparkles className="w-4 h-4 text-[#D6A34A]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Diagnostic Results */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-[#2C3834] p-4 rounded-2xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                Matched Clinical Regimen ({target} Focus):
              </div>
              <p className="text-xs text-[#1F1F1F] dark:text-[#F3F4F6]">
                Targeting <strong>{concern}</strong> for <strong>{skinType}</strong> profile.
              </p>
            </div>

            <div className="space-y-3">
              {recommendedList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="bg-white dark:bg-[#121816] p-3.5 rounded-2xl border border-[#2F5D50]/15 flex items-center justify-between cursor-pointer hover:border-[#2F5D50]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.featuredImage.url}
                      alt={p.title}
                      className="w-14 h-14 object-cover rounded-xl bg-[#FFF9F4]"
                    />
                    <div>
                      <h5 className="font-serif font-bold text-sm text-[#1F1F1F] dark:text-[#F3F4F6]">
                        {p.title}
                      </h5>
                      <span className="text-[11px] text-[#D6A34A] font-semibold">
                        ₹{parseFloat(p.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#2F5D50] font-bold">View</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-3.5 rounded-2xl border border-gray-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>

              <button
                onClick={handleAddBundle}
                className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  addedBundle ? 'bg-emerald-700 text-white' : 'bg-[#D6A34A] text-[#1F1F1F] hover:bg-[#c4923b]'
                }`}
              >
                {addedBundle ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Regimen Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Add Complete Custom Bundle To Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
