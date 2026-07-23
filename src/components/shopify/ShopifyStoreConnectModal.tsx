import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Store, CheckCircle, RefreshCw, Key, Globe, AlertCircle, ShoppingBag, ExternalLink } from 'lucide-react';

interface ShopifyStoreConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopifyStoreConnectModal: React.FC<ShopifyStoreConnectModalProps> = ({ isOpen, onClose }) => {
  const {
    shopifyDomain,
    shopifyToken,
    updateShopifyCredentials,
    isLiveShopify,
    loadingProducts,
    products,
    refreshProducts,
    showToast,
  } = useShop();

  const [domainInput, setDomainInput] = useState(shopifyDomain || '');
  const [tokenInput, setTokenInput] = useState(shopifyToken || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const cleanDomain = domainInput.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanToken = tokenInput.trim();

    if (!cleanDomain || !cleanToken) {
      setErrorMessage('Please provide both your Shopify Store Domain and Storefront Access Token.');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateShopifyCredentials(cleanDomain, cleanToken);
      showToast('Shopify Store credentials connected!', 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to Shopify store. Please check domain and access token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    setDomainInput('');
    setTokenInput('');
    await updateShopifyCredentials('', '');
    showToast('Switched to default demo catalog.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121816] rounded-3xl shadow-2xl border border-[#2F5D50]/10 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-[#2F5D50] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#D6A34A]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Shopify Store Sync</h3>
              <p className="text-xs text-white/80">Fetch live products & checkout directly from your store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connection Status Banner */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {isLiveShopify ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold">Live Store Connected</p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Currently syncing <strong>{products.length} products</strong> directly from <strong>{shopifyDomain}</strong> via Storefront API.
                </p>
                <button
                  onClick={() => refreshProducts()}
                  disabled={loadingProducts}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
                  <span>Sync Products Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Connect Your Shopify Store</p>
                <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                  Enter your Shopify store domain and Storefront Access Token below to load your exact live catalog, collections, and variants into this storefront.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Shopify Store Domain</span>
              </label>
              <input
                type="text"
                placeholder="yourstore.myshopify.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1B2320] text-sm focus:ring-2 focus:ring-[#2F5D50] outline-none transition-all"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Your store&apos;s <code>.myshopify.com</code> address (e.g. <code>mybrand.myshopify.com</code>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F5D50] dark:text-[#D6A34A] mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Storefront Access Token</span>
              </label>
              <input
                type="password"
                placeholder="shpat_xxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1B2320] text-sm focus:ring-2 focus:ring-[#2F5D50] outline-none transition-all"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Found in Shopify Admin &gt; Settings &gt; Apps and sales channels &gt; Storefront API
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {isLiveShopify ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-bold uppercase hover:bg-red-50 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-gray-500 text-xs font-bold uppercase hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2F5D50] hover:bg-[#254b40] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Connect Store</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Guide */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 space-y-1">
            <p className="font-bold text-gray-700 dark:text-gray-300">How to get Storefront Token in 1 minute:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open Shopify Admin &gt; Headless / Storefront API App</li>
              <li>Create a Storefront API token with read permissions for Products & Checkout</li>
              <li>Paste the token here and click Connect Store!</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};
