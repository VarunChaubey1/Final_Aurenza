export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
  sku?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verifiedPurchase: boolean;
  skinType?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType: string;
  category: 'Skin Care' | 'Hair Care';
  subcategory: 'Face Wash' | 'Face Serum' | 'Sunscreen' | 'Moisturizer' | 'Shampoo' | 'Hair Oil' | 'Hair Serum';
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage;
  images: ShopifyImage[];
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  ingredients: {
    keyActives: string[];
    fullList: string;
  };
  benefits: string[];
  directions: string;
  skinType: string[];
  concern: string[];
  dermatologistNote?: string;
  badge?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ShopifyImage;
  productsCount: number;
}

export interface CartItem {
  id: string; // Line item ID
  variantId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  subtotalAmount: ShopifyMoney;
  totalTaxAmount?: ShopifyMoney;
  discountCode?: string;
  discountAmount?: ShopifyMoney;
}

export interface IngredientSpotlight {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  category: 'Skin Active' | 'Hair Botanical';
  suitableFor: string;
  image: string;
  recommendedProductHandles: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  age: number;
  location: string;
  rating: number;
  verifiedBuyer: boolean;
  image: string;
  beforeAfterImage?: string;
  comment: string;
  favoriteProduct: string;
}

export interface FilterState {
  category: string;
  subcategory: string;
  concern: string;
  skinType: string;
  keyIngredient: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'featured' | 'price-low-high' | 'price-high-low' | 'rating' | 'newest';
  inStockOnly: boolean;
}

export interface QuizState {
  step: number;
  targetArea: 'Skin' | 'Hair' | 'Both';
  skinType: string;
  primaryConcern: string[];
  sensitivity: string;
  preferredTexture: string;
  sunExposure: string;
}
