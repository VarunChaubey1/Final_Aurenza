import React, { useState, useEffect } from 'react';
import { X, LogOut, Package, MapPin, Mail, Phone, Lock, CheckCircle, User as UserIcon, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inputCls =
  'w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 dark:border-[#2F5D50]/30 rounded-xl text-xs focus:ring-2 focus:ring-[#2F5D50] focus:outline-none';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, authTab, closeAuthModal, login, signup, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    if (authTab === 'signup') setMode('signup');
    if (authTab === 'login') setMode('login');
  }, [authTab, isAuthModalOpen]);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAuthModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    if (mode === 'signup') {
      if (!name.trim()) return setErrorMsg('Please enter your name.');
      if (password.length < 8) return setErrorMsg('Password must be at least 8 characters.');
    }

    setIsSubmitting(true);
    try {
      const res =
        mode === 'login'
          ? await login(email, password)
          : await signup({ name, email, phone: phone || undefined, password });
      if (res.success) {
        setSuccessMsg(res.message || 'Success!');
        setPassword('');
        setTimeout(() => {
          setSuccessMsg('');
          closeAuthModal();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true" aria-label={user ? 'My account' : 'Sign in'}>
      <div 
        id="auth-modal-container"
        className="bg-white dark:bg-[#18201D] text-[#1F1F1F] dark:text-[#F3F4F6] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#2F5D50]/10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2F5D50]/10 flex items-center justify-between bg-[#FFF9F4] dark:bg-[#121816]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2F5D50] text-white flex items-center justify-center font-bold font-serif shadow-sm">
              A
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2F5D50] dark:text-[#F3F4F6]">
                {user ? 'My Account' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60">
                {user ? `Welcome back, ${user.name}` : 'Your Aurenza account is powered by Shopify'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C3834] transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!user ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Mobile Number (optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="10-digit number" className={inputCls} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    minLength={mode === 'signup' ? 8 : undefined}
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#2F5D50] hover:bg-[#1e3e35] disabled:opacity-50 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-colors shadow-md"
              >
                {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg(''); }}
                  className="text-[11px] text-[#2F5D50] dark:text-[#D6A34A] font-bold underline"
                >
                  {mode === 'login' ? "New here? Create an account" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          ) : (
            /* Logged-In User Profile View */
            <div className="space-y-6">
              {/* User Identity Card */}
              <div className="p-4 bg-[#FFF9F4] dark:bg-[#121816] rounded-2xl border border-[#2F5D50]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2F5D50] text-white text-lg font-bold flex items-center justify-center font-serif shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2F5D50] dark:text-[#F3F4F6]">{user.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    {user.phone && <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{user.phone}</p>}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 font-semibold border border-red-200 dark:border-red-900/50"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Saved Shipping Address (managed in Shopify checkout) */}
              <div className="space-y-3">
                <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>Default Shipping Address</span>
                </h5>
                {user.address ? (
                  <div className="p-3 bg-gray-50 dark:bg-[#202B27] rounded-xl text-xs space-y-0.5 border border-gray-200 dark:border-gray-800">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.address.street}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.address.city}, {user.address.state} - {user.address.pincode}
                    </p>
                    <p className="text-gray-500 text-[11px]">{user.address.country}</p>
                  </div>
                ) : (
                  <div className="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-500 text-center">
                    No address saved yet — it will be saved automatically at checkout.
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <span>Order History</span>
                </h5>

                {user.orders && user.orders.length > 0 ? (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#2F5D50]/10 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-200">
                          <span>{order.id}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] rounded-full uppercase font-bold">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 flex justify-between">
                          <span>Date: {order.date}</span>
                          {order.statusUrl && (
                            <a href={order.statusUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#2F5D50] dark:text-[#D6A34A] font-semibold hover:underline">
                              Track <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-1.5 space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span className="truncate max-w-[200px] text-gray-700 dark:text-gray-300">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-semibold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-1.5 flex justify-between font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                          <span>Order Total</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-gray-50 dark:bg-[#202B27] rounded-xl text-xs text-gray-500">
                    You have not placed any orders yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

