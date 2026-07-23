import React from 'react';
import { Truck, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div id="announcement-bar" className="bg-[#2F5D50] text-[#FFF9F4] py-2 px-4 text-xs font-medium tracking-[0.15em] uppercase border-b border-[#2F5D50]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#D6A34A]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Made in India • Clinically Backed</span>
        </div>

        <div className="flex-1 text-center flex items-center justify-center gap-6 sm:gap-10">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#D6A34A]" />
            Free Shipping on Orders Over ₹999
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6A34A]" />
            COD Available Nationwide
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A34A]" />
            Dermatologically Tested
          </span>
        </div>

        <div className="hidden lg:block text-[#FFF9F4]/80 text-[11px] lowercase tracking-normal">
          Use Code <strong className="text-[#D6A34A] uppercase font-bold tracking-widest">AURENZA10</strong> for 10% OFF
        </div>
      </div>
    </div>
  );
};
