import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, LogOut, Package, MapPin, Mail, Phone, Lock, Sparkles, CheckCircle, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, authTab, closeAuthModal, login, signup, loginWithMobileOtp, sendWhatsappOtp, logout, updateUserAddress } = useAuth();
  const [authMode, setAuthMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');

  // WhatsApp OTP states
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Email states (Secondary fallback)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // General feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpStep('phone');
    setOtpInput('');
  }, [authTab, user, isAuthModalOpen]);

  useEffect(() => {
    if (user?.address) {
      setStreet(user.address.street || '');
      setCity(user.address.city || '');
      setState(user.address.state || '');
      setPincode(user.address.pincode || '');
    }
  }, [user]);

  if (!isAuthModalOpen) return null;

  // Step 1: Send WhatsApp OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await sendWhatsappOtp(mobileNumber);
      if (res.success) {
        setOtpStep('otp');
        setOtpInput(''); // Empty for real user input
        setSuccessMsg(res.message || 'WhatsApp OTP sent!');
      } else {
        setErrorMsg(res.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setErrorMsg('Unable to send WhatsApp OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify WhatsApp OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) {
      setErrorMsg('Please enter the OTP sent to your WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await loginWithMobileOtp(mobileNumber, otpInput, fullName);
      if (res.success) {
        setSuccessMsg('Phone verified successfully! Welcome to Aurenza.');
        setTimeout(() => {
          setSuccessMsg('');
          closeAuthModal();
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email fallback submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg(res.message || 'Logged in!');
        setTimeout(() => {
          setSuccessMsg('');
          closeAuthModal();
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserAddress({
      street,
      city,
      state,
      pincode,
      country: 'India'
    });
    setIsEditingAddress(false);
    setSuccessMsg('Address updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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
                {user ? 'My Account' : 'Express WhatsApp Login'}
              </h3>
              <p className="text-[11px] text-[#1F1F1F]/60 dark:text-[#F3F4F6]/60">
                {user ? `Welcome back, ${user.name}` : 'No Passwords · Fast & 100% Secure'}
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
            <>
              {authMode === 'whatsapp' ? (
                /* WHATSAPP OTP AUTHENTICATION FLOW */
                <div className="space-y-4 pt-1">
                  {otpStep === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                          Full Name (Optional)
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ananya Sharma"
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 dark:border-[#2F5D50]/30 rounded-xl text-xs focus:ring-2 focus:ring-[#2F5D50] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                          Mobile Number (WhatsApp)
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 flex items-center gap-1 text-xs font-bold text-gray-500">
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            maxLength={10}
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="98765 43210"
                            className="w-full pl-12 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 dark:border-[#2F5D50]/30 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2F5D50] focus:outline-none"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          We'll send a 6-digit verification code to your WhatsApp.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP via WhatsApp'}</span>
                      </button>
                    </form>
                  ) : (
                    /* STEP 2: VERIFY OTP */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                            OTP sent to +91 {mobileNumber.slice(-10)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpStep('phone')}
                          className="text-[11px] font-bold text-[#2F5D50] dark:text-[#D6A34A] underline"
                        >
                          Edit
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Enter 6-Digit WhatsApp OTP
                          </label>
                        </div>
                        <div className="relative">
                          <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="• • • • • •"
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 dark:border-[#2F5D50]/30 rounded-xl text-sm font-mono font-bold tracking-widest text-center focus:ring-2 focus:ring-[#2F5D50] focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-[#2F5D50] hover:bg-[#1e3e35] disabled:opacity-50 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-colors shadow-md"
                      >
                        {isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Continue'}
                      </button>
                    </form>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode('email')}
                      className="text-[11px] text-gray-500 hover:text-[#2F5D50] dark:hover:text-[#D6A34A] underline"
                    >
                      Or login using Email & Password
                    </button>
                  </div>
                </div>
              ) : (
                /* EMAIL/PASSWORD ALTERNATIVE */
                <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2F5D50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#202B27] border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2F5D50]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#2F5D50] hover:bg-[#1e3e35] text-white font-bold rounded-xl text-xs uppercase"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In with Email'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('whatsapp')}
                      className="text-[11px] text-[#2F5D50] dark:text-[#D6A34A] font-bold underline"
                    >
                      ← Switch to WhatsApp OTP Login
                    </button>
                  </div>
                </form>
              )}
            </>
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

              {/* Saved Shipping Address Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Saved Shipping Address</span>
                  </h5>
                  {!isEditingAddress && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-[#2F5D50] dark:text-[#D6A34A] underline font-semibold hover:opacity-80"
                    >
                      {user.address ? 'Edit' : '+ Add Address'}
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-2.5 p-3.5 bg-gray-50 dark:bg-[#202B27] rounded-xl border border-gray-200 dark:border-[#2F5D50]/30 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-0.5">Street Address</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="House no., Building, Street"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-[#18201D] border border-gray-300 dark:border-gray-700 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-0.5">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Mumbai"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#18201D] border border-gray-300 dark:border-gray-700 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-0.5">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Maharashtra"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#18201D] border border-gray-300 dark:border-gray-700 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-0.5">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="400001"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-[#18201D] border border-gray-300 dark:border-gray-700 rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-[#2F5D50] text-white font-bold rounded-lg text-xs"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : user.address ? (
                  <div className="p-3 bg-gray-50 dark:bg-[#202B27] rounded-xl text-xs space-y-0.5 border border-gray-200 dark:border-gray-800">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.address.street}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.address.city}, {user.address.state} - {user.address.pincode}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-[11px]">{user.address.country}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-dashed border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-500 text-center">
                    No default shipping address saved.
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
                          <span>Method: {order.paymentMethod}</span>
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
                          <span>Total Amount Paid</span>
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

