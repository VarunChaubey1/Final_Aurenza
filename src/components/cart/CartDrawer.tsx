import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Check, Sparkles, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createShopifyCheckout } from '../../services/shopifyCheckout';

interface CartDrawerProps {
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateShop }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalQuantity,
    subtotal,
    discountCode,
    applyDiscountCode,
    discountAmount,
    finalTotal,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    openCheckout,
  } = useCart();
  const { user, openAuthModal } = useAuth();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromptMessage] = useState<{ success?: boolean; text: string } | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyDiscountCode(inputCode);
    setPromptMessage({ success: res.success, text: res.message });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      openAuthModal('login');
    } else {
      openCheckout();
    }
  };

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F4] dark:bg-[#1B2320] shadow-2xl flex flex-col justify-between border-l border-[#2F5D50]/20 text-[#1F1F1F] dark:text-[#F3F4F6]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#2F5D50]/10 flex items-center justify-between bg-white dark:bg-[#121816]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#2F5D50] dark:text-[#D6A34A]" />
              <h2 className="text-xl font-serif font-bold uppercase tracking-wider">
                Your Cart ({totalQuantity})
              </h2>
            </div>
            <button
              id="btn-close-cart"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#1F1F1F] dark:text-white hover:text-[#2F5D50] transition-colors rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#2F5D50]/5 dark:bg-[#2C3834] px-6 py-3 border-b border-[#2F5D50]/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#2F5D50] dark:text-[#D6A34A]">
                <Truck className="w-4 h-4" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    🎉 Congratulations! You unlocked FREE Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2F5D50] dark:bg-[#D6A34A] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-20 h-20 rounded-full bg-[#2F5D50]/5 flex items-center justify-center text-[#2F5D50]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-serif font-semibold">Your cart is empty</h3>
                <p className="text-xs text-[#6B7280] max-w-xs">
                  Discover our dermatologist-formulated Vitamin C, Glutathione, and Rosemary active solutions.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateShop();
                  }}
                  className="bg-[#2F5D50] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f] transition-all"
                >
                  Explore Best Sellers
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = parseFloat(item.selectedVariant.price.amount);
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#121816] p-4 rounded-2xl border border-[#2F5D50]/10 flex gap-4 items-center relative"
                  >
                    <img
                      src={item.product.featuredImage.url}
                      alt={item.product.title}
                      className="w-18 h-18 object-cover rounded-xl bg-[#FFF9F4]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold truncate text-[#1F1F1F] dark:text-[#F3F4F6]">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-[#D6A34A] font-medium">
                        {item.selectedVariant.title}
                      </p>
                      <div className="text-sm font-bold text-[#2F5D50] dark:text-[#E5B35C] mt-1">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#2F5D50]/20 rounded-lg bg-[#FFF9F4] dark:bg-[#1B2320]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#2F5D50]/10 bg-white dark:bg-[#121816] space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. AURENZA10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 bg-[#FFF9F4] dark:bg-[#1B2320] border border-[#2F5D50]/20 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:border-[#2F5D50]"
                />
                <button
                  type="submit"
                  className="bg-[#2F5D50] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f]"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-xs p-2 rounded-lg ${
                    promoMessage.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountCode})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B7280]">
                  <span>Shipping</span>
                  <span>
                    {amountNeededForFreeShipping === 0 ? (
                      <strong className="text-emerald-700 uppercase">FREE</strong>
                    ) : (
                      '₹99'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2F5D50] dark:text-[#E5B35C] pt-2 border-t border-[#2F5D50]/10">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="btn-cart-checkout"
                onClick={handleCheckout}
                disabled={isRedirecting}
                className="w-full bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#c4923b] shadow-lg transition-all disabled:opacity-75"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1F1F1F]" />
                    <span>Redirecting to Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Express Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#6B7280] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2F5D50]" />
                  256-Bit SSL Encryption
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A34A]" />
                  COD Verified
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
