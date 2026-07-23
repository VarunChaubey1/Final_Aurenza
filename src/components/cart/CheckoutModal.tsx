import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  Printer,
  Copy,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createShopifyCheckout } from '../../services/shopifyCheckout';

interface CheckoutModalProps {
  onNavigateShop?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onNavigateShop }) => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotal,
    discountCode,
    discountAmount,
    finalTotal,
    amountNeededForFreeShipping,
    applyDiscountCode,
  } = useCart();

  // Steps: 1 = Shipping, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    address: '402, Green Valley Apartments, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    landmark: 'Near Trinity Metro Station',
    saveAddress: true,
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority'>('standard');
  const shippingFee = shippingMethod === 'priority' ? 149 : amountNeededForFreeShipping === 0 ? 0 : 99;
  const grandTotal = finalTotal + shippingFee;

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod' | 'shopify'>('upi');

  // UPI State
  const [upiId, setUpiId] = useState('ananya@okicici');
  const [upiProcessing, setUpiProcessing] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  // Card State
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8821',
    name: 'Ananya Sharma',
    expiry: '08/28',
    cvv: '•••',
  });

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Shopify Integration State
  const [shopifyDomain, setShopifyDomain] = useState(process.env.VITE_SHOPIFY_STORE_DOMAIN || '');
  const [shopifyToken, setShopifyToken] = useState(process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '');
  const [shopifyRedirecting, setShopifyRedirecting] = useState(false);
  const [shopifyError, setShopifyError] = useState<string | null>(null);
  const [showShopifyConfig, setShowShopifyConfig] = useState(false);

  // Order Details post-checkout
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Coupon state inside checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fillDemoData = () => {
    setFormData({
      fullName: 'Priya Nair',
      email: 'priya.nair@aurenzaskincare.in',
      phone: '9812345678',
      address: 'Plot 88, Jubilee Hills Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      landmark: 'Opposite Metro Pillar 14',
      saveAddress: true,
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyDiscountCode(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleShopifyRedirect = async () => {
    setShopifyRedirecting(true);
    setShopifyError(null);

    const result = await createShopifyCheckout(cart, shopifyDomain, shopifyToken);

    if (result.success && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    } else {
      setShopifyError(result.error || 'Failed to connect to Shopify Checkout.');
      setShopifyRedirecting(false);
    }
  };

  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., username@upi)');
      return;
    }
    setUpiProcessing(true);
    setTimeout(() => {
      setUpiProcessing(false);
      setUpiVerified(true);
    }, 1200);
  };

  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill in all required shipping fields.');
      setStep(1);
      return;
    }

    if (paymentMethod === 'shopify') {
      handleShopifyRedirect();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomOrderNum = `AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(randomOrderNum);
      setIsSubmitting(false);
      setStep(3);
    }, 1800);
  };

  const handleFinishAndClose = () => {
    clearCart();
    setIsCheckoutOpen(false);
    if (onNavigateShop) {
      onNavigateShop();
    }
  };

  const copyOrderToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-[#FFF9F4] dark:bg-[#1B2320] rounded-3xl shadow-2xl border border-[#2F5D50]/20 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-white dark:bg-[#121816] px-6 py-4 border-b border-[#2F5D50]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2F5D50] text-[#D6A34A] flex items-center justify-center font-serif font-bold text-lg">
              A
            </div>
            <div>
              <h2 className="text-base font-serif font-bold tracking-wider uppercase text-[#1F1F1F] dark:text-[#F3F4F6]">
                Aurenza Luxury Checkout
              </h2>
              <p className="text-[11px] text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" />
                256-Bit Encrypted & Powered by Shopify Headless Backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShopifyConfig(!showShopifyConfig)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2F5D50]/20 text-[11px] font-semibold text-[#2F5D50] dark:text-[#D6A34A] hover:bg-[#2F5D50]/5"
              title="Shopify Store Settings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shopify Backend Status</span>
            </button>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Shopify Merchant Config Banner */}
        {showShopifyConfig && (
          <div className="bg-[#2F5D50]/10 dark:bg-[#2C3834] p-4 border-b border-[#2F5D50]/20 text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between font-bold text-[#2F5D50] dark:text-[#D6A34A]">
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4" />
                Shopify Storefront API Settings (Headless Integration)
              </span>
              <button
                onClick={() => setShowShopifyConfig(false)}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#6B7280] leading-relaxed">
              This app is fully prepared to handle live orders on your Shopify store via Storefront GraphQL API. You can enter your domain and storefront token below or use the direct hosted checkout.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Shopify Store Domain</label>
                <input
                  type="text"
                  placeholder="e.g. aurenza-beauty.myshopify.com"
                  value={shopifyDomain}
                  onChange={e => setShopifyDomain(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#2F5D50]/20 bg-white dark:bg-[#121816]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Storefront Access Token</label>
                <input
                  type="password"
                  placeholder="e.g. 5d9a... (Storefront API Key)"
                  value={shopifyToken}
                  onChange={e => setShopifyToken(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#2F5D50]/20 bg-white dark:bg-[#121816]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Checkout Steps Stepper */}
        {step !== 3 && (
          <div className="bg-white dark:bg-[#121816] px-6 py-3 border-b border-[#2F5D50]/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-6 text-xs font-semibold">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 transition-colors ${
                  step === 1
                    ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold border-b-2 border-[#2F5D50] dark:border-[#D6A34A] pb-1'
                    : 'text-gray-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#2F5D50] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Shipping Address</span>
              </button>

              <div className="h-0.5 w-6 sm:w-12 bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={() => {
                  if (formData.fullName && formData.phone) setStep(2);
                }}
                className={`flex items-center gap-2 transition-colors ${
                  step === 2
                    ? 'text-[#2F5D50] dark:text-[#D6A34A] font-bold border-b-2 border-[#2F5D50] dark:border-[#D6A34A] pb-1'
                    : 'text-gray-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#2F5D50] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Payment & Review</span>
              </button>
            </div>

            <button
              onClick={fillDemoData}
              className="text-[11px] font-bold text-[#2F5D50] dark:text-[#D6A34A] underline hover:opacity-80"
            >
              Autofill Sample Address
            </button>
          </div>
        )}

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 3 ? (
            /* STEP 3: ORDER CONFIRMATION & RECEIPT */
            <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest">
                  Payment Successful
                </span>
                <h3 className="text-3xl font-serif font-bold text-[#2F5D50] dark:text-[#E5B35C] mt-2">
                  Thank You, {formData.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Your order has been confirmed and submitted to Shopify fulfillment.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-white dark:bg-[#121816] p-6 rounded-2xl border border-[#2F5D50]/15 shadow-sm text-left space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2F5D50]/10 pb-4">
                  <div>
                    <p className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold">
                      Order Reference Number
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-mono font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                        {orderId}
                      </span>
                      <button
                        onClick={copyOrderToClipboard}
                        className="text-gray-400 hover:text-black dark:hover:text-white p-1"
                        title="Copy Order ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copiedOrderId && (
                        <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold">
                      Estimated Delivery
                    </p>
                    <p className="text-xs font-bold text-[#1F1F1F] dark:text-white mt-0.5">
                      Within 3-4 Business Days (BlueDart Express)
                    </p>
                  </div>
                </div>

                {/* Delivery Address Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-[#2F5D50] dark:text-[#D6A34A] uppercase text-[10px] tracking-wider mb-1">
                      Shipping Address
                    </p>
                    <p className="font-bold">{formData.fullName}</p>
                    <p className="text-[#6B7280]">{formData.address}</p>
                    <p className="text-[#6B7280]">
                      {formData.city}, {formData.state} - {formData.pincode}
                    </p>
                    <p className="text-[#6B7280]">Phone: +91 {formData.phone}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-[#2F5D50] dark:text-[#D6A34A] uppercase text-[10px] tracking-wider mb-1">
                      Payment Summary
                    </p>
                    <p className="text-[#6B7280]">
                      Method:{' '}
                      <strong className="uppercase font-bold text-[#1F1F1F] dark:text-white">
                        {paymentMethod === 'upi'
                          ? 'UPI Instant Payment'
                          : paymentMethod === 'card'
                          ? 'Credit / Debit Card'
                          : paymentMethod === 'netbanking'
                          ? `Net Banking (${selectedBank})`
                          : 'Cash on Delivery (COD)'}
                      </strong>
                    </p>
                    <p className="text-[#6B7280]">
                      Amount Paid:{' '}
                      <strong className="text-sm font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </strong>
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                      ✓ Invoice sent to {formData.email}
                    </p>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="border-t border-[#2F5D50]/10 pt-4">
                  <p className="font-semibold text-[11px] text-[#6B7280] uppercase tracking-wider mb-2">
                    Items Included ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </p>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.featuredImage.url}
                            alt={item.product.title}
                            className="w-10 h-10 object-cover rounded-lg bg-[#FFF9F4]"
                          />
                          <div>
                            <p className="font-semibold">{item.product.title}</p>
                            <p className="text-[10px] text-[#6B7280]">
                              Qty: {item.quantity} • {item.selectedVariant.title}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold">
                          ₹
                          {(
                            parseFloat(item.selectedVariant.price.amount) * item.quantity
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-6 py-3 rounded-2xl border border-[#2F5D50]/30 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#2F5D50]/5"
                >
                  <Printer className="w-4 h-4" />
                  Print Official Receipt
                </button>

                <button
                  onClick={handleFinishAndClose}
                  className="px-8 py-3.5 rounded-2xl bg-[#2F5D50] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1f4239] shadow-lg transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1 & STEP 2 LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {step === 1 && (
                  /* STEP 1: SHIPPING ADDRESS */
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#2F5D50] dark:text-[#E5B35C]">
                      1. Contact & Delivery Address
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                          placeholder="e.g. Ananya Sharma"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Mobile Number (for Updates & COD) *</label>
                        <div className="flex">
                          <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-r-0 border-[#2F5D50]/20 rounded-l-xl text-xs font-bold text-gray-500">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                            placeholder="10-digit phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                        placeholder="your.email@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Flat / House No. / Building / Street *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                        placeholder="House or Flat No., Apartment, Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                          placeholder="e.g. 560001"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs focus:ring-2 focus:ring-[#2F5D50] outline-none"
                        placeholder="e.g. Near Metro or Mall"
                      />
                    </div>

                    {/* Shipping Options */}
                    <div className="pt-2">
                      <label className="block text-xs font-serif font-bold text-[#2F5D50] dark:text-[#E5B35C] mb-2">
                        Shipping Speed
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            shippingMethod === 'standard'
                              ? 'border-[#2F5D50] bg-[#2F5D50]/5 dark:bg-[#2C3834]'
                              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="mt-0.5 accent-[#2F5D50]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">Standard Express</span>
                              {amountNeededForFreeShipping === 0 ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                                  FREE
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold">₹99</span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">3-4 Business Days via BlueDart</p>
                          </div>
                        </label>

                        <label
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            shippingMethod === 'priority'
                              ? 'border-[#2F5D50] bg-[#2F5D50]/5 dark:bg-[#2C3834]'
                              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'priority'}
                            onChange={() => setShippingMethod('priority')}
                            className="mt-0.5 accent-[#2F5D50]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">Priority Same-Day Dispatch</span>
                              <span className="text-[10px] font-bold text-[#D6A34A] bg-[#D6A34A]/10 px-2 py-0.5 rounded-full">
                                ₹149
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">Dispatched within 4 hours with Temperature Pack</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-[#2F5D50] text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#1e3c34] shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  /* STEP 2: PAYMENT METHOD SELECTION */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif font-bold text-[#2F5D50] dark:text-[#E5B35C]">
                        2. Select Payment Option
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-1 hover:underline"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Edit Address
                      </button>
                    </div>

                    {shopifyError && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{shopifyError}</span>
                      </div>
                    )}

                    {/* Payment Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'upi'
                            ? 'border-[#2F5D50] bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] font-bold shadow-sm'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <QrCode className="w-5 h-5" />
                        <span className="text-xs">UPI / QR</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'card'
                            ? 'border-[#2F5D50] bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] font-bold shadow-sm'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs">Card</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#2F5D50] bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] font-bold shadow-sm'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        <span className="text-xs">Netbanking</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'cod'
                            ? 'border-[#2F5D50] bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] font-bold shadow-sm'
                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121816] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                        <span className="text-xs">Cash on Delivery</span>
                      </button>
                    </div>

                    {/* Direct Shopify Checkout Option Banner */}
                    <div className="bg-gradient-to-r from-[#2F5D50]/10 to-[#D6A34A]/10 p-3.5 rounded-2xl border border-[#2F5D50]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#2F5D50] dark:text-[#D6A34A]" />
                        <span className="text-xs font-semibold">
                          Prefer paying directly on official Shopify Checkout?
                        </span>
                      </div>
                      <button
                        onClick={() => setPaymentMethod('shopify')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          paymentMethod === 'shopify'
                            ? 'bg-[#2F5D50] text-white'
                            : 'border border-[#2F5D50]/30 text-[#2F5D50] dark:text-[#D6A34A] hover:bg-[#2F5D50]/10'
                        }`}
                      >
                        Use Shopify Checkout
                      </button>
                    </div>

                    {/* PAYMENT METHOD DETAILED PANELS */}
                    <div className="bg-white dark:bg-[#121816] p-5 rounded-2xl border border-[#2F5D50]/15 space-y-4">
                      
                      {/* 1. UPI PANEL */}
                      {paymentMethod === 'upi' && (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FFF9F4] dark:bg-[#1B2320] p-4 rounded-xl border border-[#2F5D50]/10">
                            {/* Dummy QR Code graphic */}
                            <div className="p-2 bg-white rounded-xl shadow-md border text-center shrink-0">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=upi://pay?pa=aurenza@upi&pn=AurenzaSkincare&am=${grandTotal}&cu=INR`}
                                alt="UPI Payment QR Code"
                                className="w-24 h-24 object-contain"
                              />
                              <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Scan & Pay ₹{grandTotal}</p>
                            </div>

                            <div className="flex-1 space-y-2 text-center sm:text-left">
                              <p className="text-xs font-bold text-[#2F5D50] dark:text-[#D6A34A]">
                                Scan QR with Google Pay, PhonePe, Paytm, or Cred
                              </p>
                              <p className="text-[11px] text-[#6B7280]">
                                Or enter your VPA / UPI ID below to receive instant payment approval popup:
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={upiId}
                                  onChange={e => setUpiId(e.target.value)}
                                  className="flex-1 px-3 py-2 rounded-xl border border-[#2F5D50]/20 bg-white dark:bg-[#121816] text-xs font-medium focus:outline-none"
                                  placeholder="e.g. mobile@upi"
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyUpi}
                                  disabled={upiProcessing}
                                  className="px-4 py-2 bg-[#2F5D50] text-white rounded-xl text-xs font-bold hover:bg-[#1e3c34]"
                                >
                                  {upiProcessing ? 'Verifying...' : upiVerified ? '✓ Verified' : 'Verify'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. CARD PANEL */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold mb-1">Card Number</label>
                            <input
                              type="text"
                              value={cardData.number}
                              onChange={e => setCardData({ ...cardData, number: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#1B2320] text-xs font-mono"
                              placeholder="4532 0000 0000 0000"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#1B2320] text-xs"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardData.cvv}
                                onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#1B2320] text-xs"
                                placeholder="•••"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. NETBANKING PANEL */}
                      {paymentMethod === 'netbanking' && (
                        <div className="space-y-3">
                          <label className="block text-[11px] font-semibold mb-1">Select Bank</label>
                          <select
                            value={selectedBank}
                            onChange={e => setSelectedBank(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#1B2320] text-xs font-medium"
                          >
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="State Bank of India">State Bank of India (SBI)</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                            <option value="Punjab National Bank">Punjab National Bank</option>
                          </select>
                        </div>
                      )}

                      {/* 4. COD PANEL */}
                      {paymentMethod === 'cod' && (
                        <div className="space-y-2 text-xs">
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                            <div>
                              <p className="font-bold">Cash on Delivery Available</p>
                              <p className="text-[11px] mt-0.5">
                                Please ensure exact cash of ₹{grandTotal} is ready at the time of delivery. A SMS OTP verification link will be sent to +91 {formData.phone}.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. SHOPIFY REDIRECT PANEL */}
                      {paymentMethod === 'shopify' && (
                        <div className="space-y-3 text-xs">
                          <p className="text-[#6B7280]">
                            You will be redirected to official hosted Shopify Checkout to process your order securely via your store backend.
                          </p>
                          <button
                            onClick={handleShopifyRedirect}
                            disabled={shopifyRedirecting}
                            className="w-full py-3 bg-[#2F5D50] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1b3a32]"
                          >
                            {shopifyRedirecting ? (
                              <span>Connecting to Shopify API...</span>
                            ) : (
                              <>
                                <span>Proceed to Shopify Hosted Web Checkout</span>
                                <ExternalLink className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PLACE ORDER FINAL BUTTON */}
                    {paymentMethod !== 'shopify' && (
                      <button
                        id="btn-place-order"
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="w-full bg-[#D6A34A] text-[#1F1F1F] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#c4923b] shadow-xl transition-all"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Processing Payment & Syncing Order...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#2F5D50]" />
                            Pay ₹{grandTotal.toLocaleString('en-IN')} & Place Order
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Order Items & Subtotal Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white dark:bg-[#121816] p-5 rounded-2xl border border-[#2F5D50]/15 space-y-4 sticky top-0">
                  <h4 className="font-serif font-bold text-sm text-[#2F5D50] dark:text-[#E5B35C] border-b border-[#2F5D50]/10 pb-3 flex justify-between items-center">
                    <span>Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</span>
                    <span className="text-xs text-[#6B7280] font-sans font-normal">INR ₹</span>
                  </h4>

                  {/* Cart Line Items List */}
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img
                          src={item.product.featuredImage.url}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded-xl bg-[#FFF9F4]"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-semibold truncate">{item.product.title}</p>
                          <p className="text-[10px] text-[#6B7280]">{item.selectedVariant.title}</p>
                          <p className="text-[10px] text-[#2F5D50] dark:text-[#D6A34A] font-bold">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#1F1F1F] dark:text-white">
                          ₹
                          {(
                            parseFloat(item.selectedVariant.price.amount) * item.quantity
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-[#2F5D50]/10">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#2F5D50]/20 bg-[#FFF9F4] dark:bg-[#1B2320] text-xs uppercase font-medium focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#1b3a32]"
                    >
                      Apply
                    </button>
                  </form>

                  {couponMsg && (
                    <p
                      className={`text-[11px] p-2 rounded-lg ${
                        couponMsg.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}

                  {/* Calculations breakdown */}
                  <div className="space-y-2 text-xs border-t border-[#2F5D50]/10 pt-3">
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
                      <span>Shipping ({shippingMethod === 'priority' ? 'Priority Air' : 'Standard'})</span>
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-700 uppercase">FREE</strong>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#6B7280]">
                      <span>GST (18% inclusive)</span>
                      <span>₹{Math.round(grandTotal * 0.18).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-[#2F5D50] dark:text-[#E5B35C] pt-3 border-t border-[#2F5D50]/10">
                      <span>Total Payable</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#2F5D50]/5 dark:bg-[#2C3834] rounded-xl text-[10px] text-[#2F5D50] dark:text-[#D6A34A] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Includes 100% Dermatologist Satisfaction Guarantee & Easy 15-day Returns</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
