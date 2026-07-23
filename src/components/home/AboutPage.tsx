import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

interface AboutPageProps {
  onExploreShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreShop }) => {
  return (
    <div id="about-page" className="py-16 bg-[#FFF9F4] dark:bg-[#121816] transition-colors min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-[0.25em]">
            The Aurenza Genesis
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
            Where Botanical Science Meets Uncompromising Luxury
          </h1>
          <p className="text-base text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 leading-relaxed font-light">
            Founded with a singular vision: to deliver clinical-grade skincare and haircare powered by high-potency bio-actives, free from harsh fillers.
          </p>
        </div>

        {/* Brand Image Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96 border border-[#2F5D50]/15">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80"
            alt="Aurenza Botanical Formulation Lab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 sm:p-12 flex flex-col justify-end text-white">
            <span className="text-[#D6A34A] text-xs font-bold uppercase tracking-widest mb-1">
              Dermatologically Verified
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold max-w-xl">
              Ethically sourced ingredients engineered for tropical humidity and modern stress.
            </h3>
          </div>
        </div>

        {/* Our 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#2F5D50]/10 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2F5D50]/10 text-[#2F5D50] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-[#D6A34A]">
              1. Potent Actives
            </h3>
            <p className="text-xs text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 leading-relaxed font-light">
              We specify exact percentages—15% L-Ascorbic Acid, 10% Niacinamide, 3% Cold-Pressed Rosemary Oil—so you never guess product strength.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#2F5D50]/10 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D6A34A]/10 text-[#D6A34A] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-[#D6A34A]">
              2. Zero Harm Toxins
            </h3>
            <p className="text-xs text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 leading-relaxed font-light">
              100% free from SLS, parabens, phthalates, mineral oils, and synthetic dyes. Non-comedogenic and eye-sting safe.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#2F5D50]/10 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-[#D6A34A]">
              3. Cruelty Free Always
            </h3>
            <p className="text-xs text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 leading-relaxed font-light">
              Tested on human volunteers under strict clinical oversight. We never test on animals, ever.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={onExploreShop}
            className="bg-[#2F5D50] dark:bg-[#4A8172] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#1a382f] shadow-xl transition-all"
          >
            Explore Aurenza Active Formulations
          </button>
        </div>

      </div>
    </div>
  );
};
