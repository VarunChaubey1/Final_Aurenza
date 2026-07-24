import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from '../data/mockProducts';
import { Product, Collection, ShopifyImage, ProductVariant } from '../types';
import { PRODUCTS_GRAPHQL_QUERY, PRODUCT_BY_HANDLE_QUERY, COLLECTIONS_QUERY } from '../graphql/queries';

export function getStoredShopifyCredentials() {
  const domain =
    (typeof window !== 'undefined' ? localStorage.getItem('aurenza_shopify_domain') : null) ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    '2ckvdk-eq.myshopify.com';
  const token =
    (typeof window !== 'undefined' ? localStorage.getItem('aurenza_shopify_token') : null) ||
    process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
    '441155a370abc67d0d0729b8b01b700d';
  return { domain, token };
}

export const BACKUP_SHOPIFY_TOKEN = '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';

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
  const tokensToTry = [customToken || creds.token, BACKUP_SHOPIFY_TOKEN].filter(
    (t, i, arr) => t && arr.indexOf(t) === i
  );

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
    node.title.toLowerCase().includes('hair')
  ) {
    category = 'Hair Care';
  }

  let subcategory: any = 'Face Serum';
  const lowerTitle = node.title.toLowerCase();
  if (lowerTitle.includes('wash') || lowerTitle.includes('cleanser')) subcategory = 'Face Wash';
  else if (lowerTitle.includes('serum') && category === 'Skin Care') subcategory = 'Face Serum';
  else if (lowerTitle.includes('sunscreen') || lowerTitle.includes('spf')) subcategory = 'Sunscreen';
  else if (lowerTitle.includes('moisturizer') || lowerTitle.includes('cream')) subcategory = 'Moisturizer';
  else if (lowerTitle.includes('shampoo')) subcategory = 'Shampoo';
  else if (lowerTitle.includes('oil')) subcategory = 'Hair Oil';

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
          p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, '').includes(catLower)
      );
    }

    return { products: filtered, isLiveShopify: true };
  }

  return { products: [], isLiveShopify: false };
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

export async function getCollections(): Promise<Collection[]> {
  return MOCK_COLLECTIONS;
}

