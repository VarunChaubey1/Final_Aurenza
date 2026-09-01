import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from '../data/mockProducts';
import { Product, Collection, ShopifyImage, ProductVariant } from '../types';
import {
  PRODUCTS_GRAPHQL_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_QUERY,
} from '../graphql/queries';

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-07';

function normalizeDomain(domain: string): string {
  return domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function getShopifyConfig(): { domain: string; token: string; configured: boolean } {
  const domain = normalizeDomain(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '');
  const token = (import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();

  // Admin API tokens (shpat_...) must never be used from the browser.
  const isStorefrontToken = token.length > 0 && !token.startsWith('shpat_');

  if (token.startsWith('shpat_')) {
    console.error(
      'VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN looks like an Admin API token (shpat_...). ' +
        'Use a Storefront API access token instead and rotate the admin token immediately.'
    );
  }

  return { domain, token, configured: Boolean(domain) && isStorefrontToken };
}

/** True when we should use local mock data (dev only, no credentials). */
export function shouldUseMockData(): boolean {
  return import.meta.env.DEV && !getShopifyConfig().configured;
}

/* ------------------------------------------------------------------ */
/* Low-level fetch                                                     */
/* ------------------------------------------------------------------ */

export class ShopifyError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = 'ShopifyError';
  }
}

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const { domain, token, configured } = getShopifyConfig();
  if (!configured) {
    throw new ShopifyError('Shopify Storefront API is not configured (check VITE_SHOPIFY_* env vars).');
  }

  const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new ShopifyError(`Shopify API responded with HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new ShopifyError(json.errors[0]?.message || 'Shopify GraphQL error', json.errors);
  }
  return json.data as T;
}

/* ------------------------------------------------------------------ */
/* Transformers                                                        */
/* ------------------------------------------------------------------ */

type Metafield = { namespace: string; key: string; value: string } | null;

function metafieldMap(node: any): Record<string, string> {
  const out: Record<string, string> = {};
  for (const mf of (node.metafields || []) as Metafield[]) {
    if (mf?.value) out[`${mf.namespace}.${mf.key}`] = mf.value;
  }
  return out;
}

function parseList(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    /* not JSON — treat as comma/newline separated */
  }
  return raw.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
}

function parseRating(raw?: string): number | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    const v = parseFloat(parsed?.value ?? parsed);
    return Number.isFinite(v) ? v : undefined;
  } catch {
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : undefined;
  }
}

const FALLBACK_IMAGE: ShopifyImage = {
  id: 'img-default',
  url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
  altText: 'Product image coming soon',
  width: 800,
  height: 800,
};

export function transformShopifyProduct(node: any): Product {
  const meta = metafieldMap(node);

  const featuredImg: ShopifyImage = node.featuredImage?.url
    ? {
        id: node.featuredImage.id || 'img-0',
        url: node.featuredImage.url,
        altText: node.featuredImage.altText || node.title,
        width: node.featuredImage.width || 800,
        height: node.featuredImage.height || 800,
      }
    : { ...FALLBACK_IMAGE, altText: node.title };

  const imagesList: ShopifyImage[] = (node.images?.edges || []).map((e: any, idx: number) => ({
    id: e.node?.id || `img-${idx}`,
    url: e.node?.url || featuredImg.url,
    altText: e.node?.altText || node.title,
    width: e.node?.width || 800,
    height: e.node?.height || 800,
  }));
  if (imagesList.length === 0) imagesList.push(featuredImg);

  const variantsList: ProductVariant[] = (node.variants?.edges || []).map((e: any, idx: number) => ({
    id: e.node?.id || `var-${idx}`,
    title: e.node?.title || 'Default Title',
    availableForSale: e.node?.availableForSale !== false,
    price: e.node?.price || node.priceRange?.minVariantPrice || { amount: '0', currencyCode: 'INR' },
    compareAtPrice: e.node?.compareAtPrice || null,
    selectedOptions: e.node?.selectedOptions || [{ name: 'Title', value: 'Default Title' }],
    image: e.node?.image ? { id: e.node.image.id, url: e.node.image.url } : undefined,
  }));

  const tagsArr: string[] = node.tags || [];
  const productType: string = node.productType || 'Skin Care';
  const lowerAll = `${node.title} ${productType} ${tagsArr.join(' ')}`.toLowerCase();

  const category: Product['category'] =
    /hair|shampoo|scalp/.test(lowerAll) ? 'Hair Care' : 'Skin Care';

  let subcategory: Product['subcategory'] = category === 'Hair Care' ? 'Hair Serum' : 'Face Serum';
  if (/wash|cleanser/.test(lowerAll)) subcategory = 'Face Wash';
  else if (/sunscreen|spf/.test(lowerAll)) subcategory = 'Sunscreen';
  else if (/moisturi[sz]er|cream|lotion/.test(lowerAll)) subcategory = 'Moisturizer';
  else if (/shampoo/.test(lowerAll)) subcategory = 'Shampoo';
  else if (category === 'Hair Care' && /oil/.test(lowerAll)) subcategory = 'Hair Oil';
  else if (category === 'Hair Care' && /serum/.test(lowerAll)) subcategory = 'Hair Serum';

  const inStock = variantsList.some(v => v.availableForSale);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml,
    vendor: node.vendor || 'Aurenza',
    productType,
    category,
    subcategory,
    tags: tagsArr,
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
    featuredImage: featuredImg,
    images: imagesList,
    variants: variantsList,
    // Only real review data (from Shopify "reviews" metafields) is shown.
    rating: parseRating(meta['reviews.rating']),
    reviewsCount: meta['reviews.rating_count'] ? parseInt(meta['reviews.rating_count'], 10) : undefined,
    ingredients: {
      keyActives: parseList(meta['custom.key_actives']),
      fullList: meta['custom.full_ingredients'] || '',
    },
    benefits: parseList(meta['custom.benefits']),
    directions: meta['custom.directions'] || '',
    skinType: parseList(meta['custom.skin_type']),
    concern: parseList(meta['custom.concern']),
    dermatologistNote: meta['custom.dermatologist_note'],
    badge: tagsArr.includes('bestseller') ? 'BESTSELLER' : tagsArr.includes('new') ? 'NEW' : undefined,
    isBestSeller: tagsArr.includes('bestseller'),
    isNewArrival: tagsArr.includes('new'),
    inStock,
  };
}

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export interface CatalogResult {
  products: Product[];
  collections: Collection[];
  /** true when served from local mock data (dev without credentials) */
  isMock: boolean;
}

export async function getCatalog(first = 50): Promise<CatalogResult> {
  if (shouldUseMockData()) {
    console.warn('[Aurenza] Shopify not configured — using mock catalog (development only).');
    return { products: MOCK_PRODUCTS, collections: MOCK_COLLECTIONS, isMock: true };
  }

  const [prodData, colData] = await Promise.all([
    shopifyFetch<any>({ query: PRODUCTS_GRAPHQL_QUERY, variables: { first } }),
    shopifyFetch<any>({ query: COLLECTIONS_QUERY, variables: { first: 20 } }),
  ]);

  const products: Product[] = (prodData?.products?.edges || []).map((e: any) =>
    transformShopifyProduct(e.node)
  );

  const collections: Collection[] = (colData?.collections?.edges || []).map((e: any) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    description: e.node.description || '',
    image: e.node.image
      ? { id: e.node.image.id || 'col-img', url: e.node.image.url, altText: e.node.image.altText || e.node.title }
      : undefined,
    productsCount: e.node.products?.edges?.length || 0,
  }));

  return { products, collections, isMock: false };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (shouldUseMockData()) {
    return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  }
  const data = await shopifyFetch<any>({ query: PRODUCT_BY_HANDLE_QUERY, variables: { handle } });
  return data?.productByHandle ? transformShopifyProduct(data.productByHandle) : null;
}

/* ------------------------------------------------------------------ */
/* Customer accounts                                                   */
/* ------------------------------------------------------------------ */

export interface CustomerResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

function firstUserError(errs: any[] | undefined): string | undefined {
  return errs && errs.length > 0 ? errs[0].message : undefined;
}

export async function createShopifyCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<CustomerResult<{ id: string }>> {
  let phone: string | undefined;
  if (input.phone) {
    const digits = input.phone.replace(/\D/g, '');
    if (digits.length >= 10) phone = input.phone.startsWith('+') ? input.phone : `+91${digits.slice(-10)}`;
  }

  try {
    const data = await shopifyFetch<any>({
      query: CUSTOMER_CREATE_MUTATION,
      variables: {
        input: {
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          phone,
        },
      },
    });
    const err = firstUserError(data?.customerCreate?.customerUserErrors);
    if (err) return { success: false, message: err };
    if (data?.customerCreate?.customer) return { success: true, data: data.customerCreate.customer };
    return { success: false, message: 'Could not create account.' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Could not create account.' };
  }
}

export async function loginShopifyCustomer(
  email: string,
  password: string
): Promise<CustomerResult<{ accessToken: string; expiresAt: string }>> {
  try {
    const data = await shopifyFetch<any>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      variables: { input: { email, password } },
    });
    const err = firstUserError(data?.customerAccessTokenCreate?.customerUserErrors);
    if (err) return { success: false, message: err };
    const tokenObj = data?.customerAccessTokenCreate?.customerAccessToken;
    if (tokenObj?.accessToken) return { success: true, data: tokenObj };
    return { success: false, message: 'Invalid email or password.' };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Login failed.' };
  }
}

export async function getShopifyCustomerDetails(accessToken: string): Promise<any | null> {
  try {
    const data = await shopifyFetch<any>({
      query: CUSTOMER_QUERY,
      variables: { customerAccessToken: accessToken },
    });
    return data?.customer || null;
  } catch (e) {
    console.error('Failed fetching customer from Shopify:', e);
    return null;
  }
}
