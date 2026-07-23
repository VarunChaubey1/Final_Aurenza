import React from 'react';
import { Leaf, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Leaf,
      title: '98%+ Natural Ingredients',
      description: 'Cold-pressed botanical oils & bio-identical actives carefully preserved without thermal degradation.',
    },
    {
      icon: Heart,
      title: '100% Cruelty Free',
      description: 'Zero animal testing, ethically sourced botanical extracts, and vegan certified clean formulas.',
    },
    {
      icon: ShieldCheck,
      title: 'Dermatologically Tested',
      description: 'Rigorous clinical human patch tests conducted to guarantee safety on sensitive Indian skin types.',
    },
    {
      icon: MapPin,
      title: 'Formulated & Made in India',
      description: 'Tailored specifically for tropical humidity, harsh UV indices, and regional urban pollution.',
    },
  ];

  return (
    <section id="why-choose-us-section" className="py-20 bg-[#2F5D50] text-[#FFF9F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[#D6A34A] text-xs font-semibold uppercase tracking-[0.25em]">
            The Aurenza Standard
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Why Choose Aurenza?
          </h2>
          <p className="text-[#FFF9F4]/70 text-sm leading-relaxed">
            We bridge the gap between traditional botanical wisdom and modern dermatological science to deliver visible results without compromise.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#D6A34A]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#D6A34A]/20 text-[#D6A34A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3 text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#FFF9F4]/70 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
