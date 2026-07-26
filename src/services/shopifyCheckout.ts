import { CartItem } from '../types';

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface ShopifyCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  cartId?: string;
  error?: string;
}

/**
 * Creates a Shopify Cart via Storefront GraphQL API and returns the checkoutUrl.
 * Redirecting the user to `checkoutUrl` allows them to complete payment on Shopify's native checkout.
 */
export async function createShopifyCheckout(
  cartItems: CartItem[],
  customDomain?: string,
  customToken?: string,
  discountCode?: string
): Promise<ShopifyCheckoutResponse> {
  const domain = (customDomain || process.env.VITE_SHOPIFY_STORE_DOMAIN || '2ckvdk-eq.myshopify.com').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const rawTokens = [
    customToken,
    process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    process.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    '441155a370abc67d0d0729b8b01b700d'
  ];

  const tokensToTry = rawTokens
    .filter((t): t is string => Boolean(t && t.trim() && !t.startsWith('shpat_')))
    .filter((t, i, arr) => arr.indexOf(t) === i);

  if (cartItems.length === 0) {
    return { success: false, error: 'Cart is empty' };
  }

  // Format line items for Shopify Storefront API cartCreate
  const lines = cartItems.map(item => ({
    merchandiseId: item.variantId.startsWith('gid://shopify/ProductVariant/') 
      ? item.variantId 
      : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
  }));

  // Direct checkout URL construction fallback if store domain is provided
  let directCartPermalink = `https://${domain}/cart/${cartItems.map(i => `${i.variantId.replace(/[^0-9]/g, '')}:${i.quantity}`).join(',')}`;
  if (discountCode) {
    directCartPermalink += `?discount=${encodeURIComponent(discountCode)}`;
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  for (const token of tokensToTry) {
    try {
      const inputObj: any = { lines };
      if (discountCode) {
        inputObj.discountCodes = [discountCode];
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: CART_CREATE_MUTATION,
          variables: {
            input: inputObj,
          },
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        continue;
      }

      const cartData = data.data?.cartCreate;
      if (cartData?.userErrors && cartData.userErrors.length > 0) {
        continue;
      }

      if (cartData?.cart?.checkoutUrl) {
        let checkoutUrl = cartData.cart.checkoutUrl;
        if (discountCode && !checkoutUrl.includes('discount=')) {
          checkoutUrl += (checkoutUrl.includes('?') ? '&' : '?') + `discount=${encodeURIComponent(discountCode)}`;
        }
        return {
          success: true,
          checkoutUrl,
          cartId: cartData.cart.id,
        };
      }
    } catch (err) {
      console.warn('Error creating Shopify cart via Storefront GraphQL:', err);
    }
  }

  // Fallback to Shopify cart permalink directly
  return {
    success: true,
    checkoutUrl: directCartPermalink,
  };
}
