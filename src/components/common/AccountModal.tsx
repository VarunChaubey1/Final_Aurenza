import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AccountModal: React.FC = () => {
  const { isAccountOpen, setIsAccountOpen, showToast } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isAccountOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      showToast(`Welcome back to Aurenza Luxe, ${name || email.split('@')[0]}!`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsAccountOpen(false)} />

      <div className="relative w-full max-w-md bg-[#FFF9F4] dark:bg-[#121816] rounded-[32px] p-8 shadow-2xl border border-[#E8DFD8] dark:border-[#2C3834] z-10">
        
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoggedIn ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#2F5D50] text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#D6A34A]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F1F1F] dark:text-white">
              Aurenza VIP Account Active
            </h3>
            <p className="text-xs text-gray-500">
              Welcome {email}. You earn 1.5x Glow Rewards Points on all purchases.
            </p>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setIsAccountOpen(false);
              }}
              className="w-full bg-[#2F5D50] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1F1F1F] dark:text-white">
                {mode === 'login' ? 'Sign In to Aurenza' : 'Create VIP Account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Access order history, skin diagnostic tracking, and birthday discounts.
              </p>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Radhika Roy"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-[#1B2320] text-xs rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-[#1B2320] text-xs rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white dark:bg-[#1B2320] text-xs rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2F5D50] hover:bg-[#1f4238] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-[#2F5D50] dark:text-[#D6A34A] font-bold hover:underline"
              >
                {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Sign In'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
