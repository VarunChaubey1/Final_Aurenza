import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from '../data/mockProducts';
import { Product, Collection, ShopifyImage, ProductVariant } from '../types';
import { 
  PRODUCTS_GRAPHQL_QUERY, 
  PRODUCT_BY_HANDLE_QUERY, 
  COLLECTIONS_QUERY,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_QUERY 
} from '../graphql/queries';

export const DEFAULT_STOREFRONT_TOKEN = '441155a370abc67d0d0729b8b01b700d';
export const DEFAULT_STORE_DOMAIN = '2ckvdk-eq.myshopify.com';

export function getStoredShopifyCredentials() {
  let domain = typeof window !== 'undefined' ? localStorage.getItem('aurenza_shopify_domain') : null;
  let token = typeof window !== 'undefined' ? localStorage.getItem('aurenza_shopify_token') : null;

  if (!domain || !domain.trim()) {
    domain =
      (typeof process !== 'undefined' && process.env?.VITE_SHOPIFY_STORE_DOMAIN) ||
      DEFAULT_STORE_DOMAIN;
  }

  // Filter out invalid shpat_ tokens for Storefront API calls
  if (!token || !token.trim() || token.startsWith('shpat_')) {
    token =
      (typeof process !== 'undefined' && process.env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
      DEFAULT_STOREFRONT_TOKEN;
  }

  return { domain: domain.trim(), token: token.trim() };
}

export function saveShopifyCredentials(domain: string, token: string) {
  if (typeof window !== 'undefined') {
    if (domain) localStorage.setItem('aurenza_shopify_domain', domain);
    else localStorage.removeItem('aurenza_shopify_domain');

    if (token) localStorage.setItem('aurenza_shopify_token', token);
    else localStorage.removeItem('aurenza_shopify_token');
  }
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  customDomain,
  customToken,
}: {
  query: string;
  variables?: Record<string, unknown>;
  customDomain?: string;
  customToken?: string;
}): Promise<T | null> {
  const creds = getStoredShopifyCredentials();
  const domain = (customDomain || creds.domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Collect candidate tokens, ensuring shpat_ tokens are excluded from Storefront headers
  const rawTokens = [
    customToken,
    creds.token,
    DEFAULT_STOREFRONT_TOKEN
  ];

  const tokensToTry = rawTokens
    .filter((t): t is string => Boolean(t && t.trim() && !t.startsWith('shpat_')))
    .filter((t, i, arr) => arr.indexOf(t) === i);

  if (!domain || tokensToTry.length === 0) {
    return null;
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  for (const token of tokensToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        console.warn(`Shopify API HTTP error with token ${token.slice(0, 8)}... Status: ${response.status}`);
        continue;
      }

      const json = await response.json();
      if (json.errors) {
        console.warn('Shopify GraphQL Errors:', json.errors);
        continue;
      }

      if (json.data) {
        return json.data as T;
      }
    } catch (err) {
      console.error('Failed fetching from Shopify Storefront API:', err);
    }
  }

  return null;
}

export function transformShopifyProduct(node: any): Product {
  const featuredImg: ShopifyImage = node.featuredImage?.url
    ? {
        id: node.featuredImage.id || 'img-0',
        url: node.featuredImage.url,
        altText: node.featuredImage.altText || node.title,
        width: node.featuredImage.width || 800,
        height: node.featuredImage.height || 800,
      }
    : {
        id: 'img-default',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        altText: node.title,
        width: 800,
        height: 800,
      };

  const imagesList: ShopifyImage[] = (node.images?.edges || []).map((e: any, idx: number) => ({
    id: e.node?.id || `img-${idx}`,
    url: e.node?.url || featuredImg.url,
    altText: e.node?.altText || node.title,
    width: e.node?.width || 800,
    height: e.node?.height || 800,
  }));

  if (imagesList.length === 0) {
    imagesList.push(featuredImg);
  }

  const variantsList: ProductVariant[] = (node.variants?.edges || []).map((e: any, idx: number) => ({
    id: e.node?.id || `var-${idx}`,
    title: e.node?.title || 'Default Title',
    availableForSale: e.node?.availableForSale !== false,
    price: e.node?.price || { amount: '999', currencyCode: 'INR' },
    compareAtPrice: e.node?.compareAtPrice || null,
    selectedOptions: e.node?.selectedOptions || [{ name: 'Title', value: 'Default Title' }],
    image: e.node?.image ? { id: e.node.image.id, url: e.node.image.url } : undefined,
  }));

  if (variantsList.length === 0) {
    variantsList.push({
      id: `var-${node.id || '1'}`,
      title: 'Default Variant',
      availableForSale: true,
      price: node.priceRange?.minVariantPrice || { amount: '999', currencyCode: 'INR' },
      compareAtPrice: node.compareAtPriceRange?.minVariantPrice || null,
      selectedOptions: [{ name: 'Size', value: '50ml' }],
    });
  }

  const tagsArr: string[] = node.tags || [];
  const productType = node.productType || 'Skin Care';

  let category: 'Skin Care' | 'Hair Care' = 'Skin Care';
  if (
    productType.toLowerCase().includes('hair') ||
    tagsArr.some(t => t.toLowerCase().includes('hair')) ||
    node.title.toLowerCase().includes('shampoo') ||
    node.title.toLowerCase().includes('hair') ||
    node.title.toLowerCase().includes('scalp') ||
    node.title.toLowerCase().includes('oil')
  ) {
    category = 'Hair Care';
  }

  let subcategory: any = 'Face Serum';
  const lowerTitle = (node.title + ' ' + productType + ' ' + tagsArr.join(' ')).toLowerCase();
  if (lowerTitle.includes('wash') || lowerTitle.includes('cleanser') || lowerTitle.includes('facewash')) subcategory = 'Face Wash';
  else if (lowerTitle.includes('serum') && category === 'Skin Care') subcategory = 'Face Serum';
  else if (lowerTitle.includes('sunscreen') || lowerTitle.includes('spf') || lowerTitle.includes('sun')) subcategory = 'Sunscreen';
  else if (lowerTitle.includes('moisturizer') || lowerTitle.includes('cream') || lowerTitle.includes('lotion')) subcategory = 'Moisturizer';
  else if (lowerTitle.includes('shampoo')) subcategory = 'Shampoo';
  else if (lowerTitle.includes('oil')) subcategory = 'Hair Oil';
  else if (lowerTitle.includes('hair') && lowerTitle.includes('serum')) subcategory = 'Hair Serum';

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || 'Pure botanical formulation engineered for transformative results.',
    descriptionHtml: node.descriptionHtml,
    vendor: node.vendor || 'Aurenza',
    productType,
    category,
    subcategory,
    tags: tagsArr,
    priceRange: node.priceRange || {
      minVariantPrice: { amount: '999', currencyCode: 'INR' },
      maxVariantPrice: { amount: '1299', currencyCode: 'INR' },
    },
    compareAtPriceRange: node.compareAtPriceRange,
    featuredImage: featuredImg,
    images: imagesList,
    variants: variantsList,
    rating: Number((4.8 + ((node.title.length % 3) * 0.1)).toFixed(1)),
    reviewsCount: 45 + (node.title.length * 4) % 150,
    ingredients: {
      keyActives: tagsArr.length > 0 ? tagsArr.slice(0, 3) : ['Botanical Actives', 'Hyaluronic Acid'],
      fullList: 'Aqua, Glycerin, Botanical Actives, Niacinamide, Sodium Hyaluronate, Phenoxyethanol.',
    },
    benefits: ['Dermatologically tested', '100% Vegan & Cruelty-free', 'Free from Sulphates & Parabens'],
    directions: 'Apply 3-4 drops to cleansed face and neck twice daily.',
    skinType: ['All Skin Types', 'Sensitive', 'Combination'],
    concern: ['Dullness', 'Hyperpigmentation', 'Hydration'],
    badge: tagsArr.includes('bestseller') ? 'BESTSELLER' : tagsArr.includes('new') ? 'NEW' : undefined,
    isBestSeller: tagsArr.includes('bestseller'),
    isNewArrival: tagsArr.includes('new'),
    inStock: true,
  };
}

export async function getProducts(options?: {
  first?: number;
  query?: string;
  category?: string;
  customDomain?: string;
  customToken?: string;
}): Promise<{ products: Product[]; isLiveShopify: boolean }> {
  const data = await shopifyFetch<any>({
    query: PRODUCTS_GRAPHQL_QUERY,
    variables: { first: options?.first || 25, query: options?.query || null },
    customDomain: options?.customDomain,
    customToken: options?.customToken,
  });

  if (data && data.products?.edges) {
    const liveProducts: Product[] = data.products.edges.map((e: any) => transformShopifyProduct(e.node));

    let filtered = liveProducts;

    if (options?.category && options.category !== 'All') {
      const catLower = options.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      filtered = filtered.filter(
        p =>
          p.category.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.productType.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower) ||
          p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower))
      );
    }

    if (liveProducts.length > 0) {
      return { products: filtered, isLiveShopify: true };
    }
  }

  // Fallback to MOCK_PRODUCTS if Shopify returns empty or fails
  return { products: MOCK_PRODUCTS, isLiveShopify: false };
}

export async function getProductByHandle(
  handle: string,
  customDomain?: string,
  customToken?: string
): Promise<Product | null> {
  const data = await shopifyFetch<any>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    customDomain,
    customToken,
  });

  if (data && data.productByHandle) {
    return transformShopifyProduct(data.productByHandle);
  }

  return null;
}

export async function getCollections(
  customDomain?: string,
  customToken?: string
): Promise<Collection[]> {
  try {
    const data = await shopifyFetch<any>({
      query: COLLECTIONS_QUERY,
      variables: { first: 20 },
      customDomain,
      customToken,
    });

    if (data && data.collections?.edges && data.collections.edges.length > 0) {
      const liveCollections: Collection[] = data.collections.edges.map((e: any) => {
        const node = e.node;
        const productsCount = node.products?.edges?.length || 0;
        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description || 'Pure botanical formulation collection engineered for transformative results.',
          image: node.image
            ? {
                id: node.image.id || 'col-img',
                url: node.image.url,
                altText: node.image.altText || node.title,
              }
            : undefined,
          productsCount: productsCount > 0 ? productsCount : 5,
        };
      });
      return liveCollections;
    }
  } catch (err) {
    console.error('Failed fetching collections from Shopify:', err);
  }

  return MOCK_COLLECTIONS;
}

export async function createShopifyCustomer(input: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  try {
    // Format phone to E.164 standard if valid, otherwise omit to avoid Shopify validation errors
    let formattedPhone: string | undefined = undefined;
    if (input.phone) {
      const cleanDigits = input.phone.replace(/\D/g, '');
      if (cleanDigits.length >= 10) {
        formattedPhone = input.phone.startsWith('+') 
          ? input.phone 
          : `+91${cleanDigits.slice(-10)}`;
      }
    }

    const data = await shopifyFetch<any>({
      query: CUSTOMER_CREATE_MUTATION,
      variables: {
        input: {
          email: input.email,
          password: input.password || 'Aurenza#2026',
          firstName: input.firstName || 'Customer',
          lastName: input.lastName || '',
          phone: formattedPhone,
        },
      },
    });

    if (data?.customerCreate?.customerUserErrors?.length > 0) {
      const errs = data.customerCreate.customerUserErrors;
      console.warn('Shopify Customer Creation Notice:', errs);
      return { success: false, errors: errs, message: errs[0].message };
    }

    if (data?.customerCreate?.customer) {
      return { success: true, customer: data.customerCreate.customer };
    }
  } catch (err) {
    console.error('Failed creating customer in Shopify:', err);
  }
  return { success: false, message: 'Could not create Shopify customer' };
}

export async function loginShopifyCustomer(email: string, password?: string) {
  try {
    const data = await shopifyFetch<any>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      variables: {
        input: {
          email,
          password: password || 'Aurenza#2026',
        },
      },
    });

    if (data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      const errs = data.customerAccessTokenCreate.customerUserErrors;
      return { success: false, errors: errs, message: errs[0].message };
    }

    const tokenObj = data?.customerAccessTokenCreate?.customerAccessToken;
    if (tokenObj?.accessToken) {
      return { success: true, accessToken: tokenObj.accessToken, expiresAt: tokenObj.expiresAt };
    }
  } catch (err) {
    console.error('Failed logging in customer in Shopify:', err);
  }
  return { success: false, message: 'Invalid Shopify login credentials' };
}

export async function getShopifyCustomerDetails(accessToken: string) {
  try {
    const data = await shopifyFetch<any>({
      query: CUSTOMER_QUERY,
      variables: { customerAccessToken: accessToken },
    });

    if (data?.customer) {
      return data.customer;
    }
  } catch (err) {
    console.error('Failed fetching customer from Shopify:', err);
  }
  return null;
}


