import { CartItem } from '../types';
import { shopifyFetch, shouldUseMockData, getShopifyConfig } from './shopify';
import { CART_CREATE_MUTATION } from '../graphql/queries';

export interface ShopifyCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  cartId?: string;
  error?: string;
}

function toVariantGid(id: string): string {
  return id.startsWith('gid://shopify/ProductVariant/') ? id : `gid://shopify/ProductVariant/${id}`;
}

/**
 * Creates a Shopify Cart via the Storefront API and returns its checkoutUrl.
 * Payment (Razorpay, COD, UPI, etc.) is handled entirely by Shopify's hosted
 * checkout, configured in Shopify Admin → Settings → Payments.
 */
export async function createShopifyCheckout(
  cartItems: CartItem[],
  options: { discountCode?: string; email?: string } = {}
): Promise<ShopifyCheckoutResponse> {
  if (cartItems.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  if (shouldUseMockData()) {
    return {
      success: false,
      error: 'Checkout is unavailable in mock mode. Configure VITE_SHOPIFY_* env vars.',
    };
  }

  const { configured } = getShopifyConfig();
  if (!configured) {
    return { success: false, error: 'Store is not connected to Shopify yet.' };
  }

  const input: Record<string, unknown> = {
    lines: cartItems.map(item => ({
      merchandiseId: toVariantGid(item.variantId),
      quantity: item.quantity,
    })),
  };
  if (options.discountCode) input.discountCodes = [options.discountCode];
  if (options.email) input.buyerIdentity = { email: options.email, countryCode: 'IN' };

  try {
    const data = await shopifyFetch<any>({
      query: CART_CREATE_MUTATION,
      variables: { input },
    });

    const result = data?.cartCreate;
    if (result?.userErrors?.length) {
      return { success: false, error: result.userErrors[0].message };
    }
    if (result?.cart?.checkoutUrl) {
      return { success: true, checkoutUrl: result.cart.checkoutUrl, cartId: result.cart.id };
    }
    return { success: false, error: 'Shopify did not return a checkout URL.' };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Could not start checkout. Please try again.',
    };
  }
}
