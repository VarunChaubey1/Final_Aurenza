import React from 'react';
import { ShieldCheck, Leaf, Heart, Award, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FFF9F4] dark:bg-[#121816] transition-colors py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D6A34A] block">
            Botanical Precision
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2F5D50] dark:text-white">
            The Science of Aurenza
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            Founded on the principle that luxury skincare should deliver verifiable clinical results, Aurenza unites cold-pressed Indian botanicals with 99.8% pure active molecules.
          </p>
        </div>

        {/* Brand Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white dark:bg-[#1B2320] p-8 sm:p-12 rounded-[40px] border border-[#E8DFD8] dark:border-[#2C3834] shadow-xl">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-[#2F5D50] dark:text-white">
              Formulated For Tropical Climate Defense
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Standard global skincare formulas are often engineered for cold dry climates and leave heavy sticky residues on tropical Indian skin.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              At Aurenza, our team of dermatologists and cosmetic chemists engineered water-light micro-emulsion delivery systems that absorb in under 60 seconds while providing 24-hour antioxidant protection against UV photo-damage and urban pollution.
            </p>
          </div>

          <div className="aspect-square rounded-[32px] overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
              alt="Aurenza Laboratory Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Clinical Standards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834]">
            <ShieldCheck className="w-8 h-8 text-[#2F5D50] dark:text-[#D6A34A] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-[#1F1F1F] dark:text-white mb-2">ISO & GMP Certified</h3>
            <p className="text-xs text-gray-500">Formulated in ISO-22716 cleanrooms adhering to strict pharmaceutical safety protocols.</p>
          </div>

          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834]">
            <Leaf className="w-8 h-8 text-[#2F5D50] dark:text-[#D6A34A] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-[#1F1F1F] dark:text-white mb-2">Zero Toxins</h3>
            <p className="text-xs text-gray-500">100% free from parabens, sulfates, phthalates, synthetic dyes, and formaldehyde releasers.</p>
          </div>

          <div className="bg-white dark:bg-[#1B2320] p-8 rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834]">
            <Heart className="w-8 h-8 text-[#2F5D50] dark:text-[#D6A34A] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-[#1F1F1F] dark:text-white mb-2">Ethical Sourcing</h3>
            <p className="text-xs text-gray-500">Direct trade partnerships with sustainable organic botanical farms across South India.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
