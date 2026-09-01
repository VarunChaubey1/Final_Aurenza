import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, MapPin, Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { shopPath } from '../../context/UIContext';
import { useUI } from '../../context/UIContext';

export const Footer: React.FC = () => {
  const { setIsQuizOpen } = useUI();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F1F1F] text-white pt-16 pb-12 transition-colors border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#D6A34A] mb-2" />
            <span className="font-serif font-bold text-sm">Dermatologically Tested</span>
            <span className="text-[10px] text-gray-400">Clinical grade safety standards</span>
          </div>

          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 text-[#D6A34A] mb-2" />
            <span className="font-serif font-bold text-sm">100% Cruelty Free</span>
            <span className="text-[10px] text-gray-400">Never tested on animals</span>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-[#D6A34A] mb-2" />
            <span className="font-serif font-bold text-sm">No Parabens & Toxins</span>
            <span className="text-[10px] text-gray-400">Pure botanical formulation</span>
          </div>

          <div className="flex flex-col items-center">
            <MapPin className="w-6 h-6 text-[#D6A34A] mb-2" />
            <span className="font-serif font-bold text-sm">Crafted in India</span>
            <span className="text-[10px] text-gray-400">Formulated for Indian skin</span>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="font-serif text-3xl font-medium tracking-[0.25em] uppercase text-white">
              AURENZA
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm">
              Aurenza is a luxury botanical science eCommerce platform engineering high-potency skin and hair treatments powered by pure Vitamin C, L-Glutathione, Niacinamide, and Rosemary essential elixirs.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-800 rounded-full hover:bg-[#D6A34A] hover:text-black transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-800 rounded-full hover:bg-[#D6A34A] hover:text-black transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-800 rounded-full hover:bg-[#D6A34A] hover:text-black transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D6A34A] uppercase tracking-wider">
              Skin Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to={shopPath({ subcategory: 'Face Serum' })} className="hover:text-white transition-colors">
                  Vitamin C Serums
                </Link>
              </li>
              <li>
                <Link to={shopPath({ subcategory: 'Face Wash' })} className="hover:text-white transition-colors">
                  Cica Cleansers
                </Link>
              </li>
              <li>
                <Link to={shopPath({ subcategory: 'Sunscreen' })} className="hover:text-white transition-colors">
                  SPF 50+ Sunscreen
                </Link>
              </li>
              <li>
                <Link to={shopPath({ subcategory: 'Moisturizer' })} className="hover:text-white transition-colors">
                  Glutathione Creams
                </Link>
              </li>
            </ul>
          </div>

          {/* Hair Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D6A34A] uppercase tracking-wider">
              Hair Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to={shopPath({ subcategory: 'Hair Oil' })} className="hover:text-white transition-colors">
                  Rosemary Hair Oil
                </Link>
              </li>
              <li>
                <Link to={shopPath({ subcategory: 'Shampoo' })} className="hover:text-white transition-colors">
                  Keratin Shampoo
                </Link>
              </li>
              <li>
                <Link to={shopPath({ subcategory: 'Hair Serum' })} className="hover:text-white transition-colors">
                  Heat Protectant Serum
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D6A34A] uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Science
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="hover:text-white transition-colors">
                  Ingredients Index
                </Link>
              </li>
              <li>
                <a href="mailto:support@aurenzabeauty.com" className="hover:text-white transition-colors">
                  Contact & Support
                </a>
              </li>
              <li>
                <button onClick={() => setIsQuizOpen(true)} className="hover:text-white transition-colors">
                  Skin Diagnostics
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D6A34A] uppercase tracking-wider">
              Support
            </h4>
            <div className="text-xs text-gray-400 space-y-2">
              <p>Email: care@aurenza.com</p>
              <p>Helpline: +91 1800 287 369</p>
              <p>Mon - Sat (9am - 7pm IST)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 font-semibold uppercase tracking-wider gap-4">
          <div>
            &copy; {new Date().getFullYear()} AURENZA BOTANICAL SCIENCE PVT LTD. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
            <span>SHIPPING & RETURNS</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 bg-gray-800 text-white rounded-full hover:bg-[#D6A34A] hover:text-black transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
