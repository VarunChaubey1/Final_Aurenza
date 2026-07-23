import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      showToast('Welcome to the Aurenza VIP Circle! Check your email for 15% OFF.', 'success');
    } else {
      showToast('Please enter a valid email address.', 'warning');
    }
  };

  return (
    <section className="py-20 bg-[#FFF9F4] dark:bg-[#121816] transition-colors relative overflow-hidden border-b border-[#2F5D50]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#2F5D50] text-white rounded-[40px] p-8 sm:p-16 shadow-2xl relative overflow-hidden text-center border border-white/10">
          
          {/* Background Decorative Blur */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6A34A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#D6A34A] text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              The Aurenza VIP Circle
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-tight">
              Unlock 15% Off Your First Botanical Order
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              Subscribe for exclusive clinical skincare research, early access to new batch launches, and personalized dermatologist recommendations.
            </p>

            {subscribed ? (
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#D6A34A] mx-auto" />
                <h3 className="font-serif text-xl font-bold">You're On The VIP List</h3>
                <p className="text-xs text-white/80">
                  Use coupon code <span className="font-bold text-[#D6A34A]">AURENZA15</span> at checkout.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-white text-[#1F1F1F] rounded-full pl-11 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D6A34A]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#D6A34A] hover:bg-[#e0b25d] text-[#1F1F1F] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Claim 15% Off</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-white/60">
              By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
