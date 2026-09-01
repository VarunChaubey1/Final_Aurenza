# Aurenza — Storefront

Headless React storefront for the Aurenza skincare & haircare brand, backed by the
Shopify Storefront API. Products, customer accounts, discounts, taxes, shipping and
payments (Razorpay / COD / UPI) are all handled by Shopify; this app is the UI.

## Stack

React 19 · TypeScript (strict) · Vite 6 · Tailwind CSS v4 · react-router 7 · Shopify Storefront API

## Local setup

```bash
npm install
cp .env.example .env.local     # fill in your Shopify values
npm run dev                    # http://localhost:3000
```

Without `.env.local` the app runs in **mock mode** (sample products, checkout disabled)
and shows a yellow "Development mode" banner. Mock mode is never used in production builds.

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_SHOPIFY_STORE_DOMAIN` | e.g. `yourstore.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | **Storefront** API token (public). Never use an Admin token (`shpat_…`). |
| `VITE_SHOPIFY_API_VERSION` | Optional, defaults to `2025-07`. Bump yearly. |

Never commit `.env.local`. If a token was ever committed, rotate it in Shopify Admin.

## Shopify configuration

1. **Storefront API app** — Shopify Admin → Settings → Apps and sales channels → Develop apps →
   create app → Storefront API scopes: `unauthenticated_read_product_listings`,
   `unauthenticated_read_customers`, `unauthenticated_write_customers`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
2. **Payments** — Settings → Payments: enable Razorpay and/or Cash on Delivery.
   Checkout happens on Shopify's hosted checkout page.
3. **Customer accounts** — Settings → Customer accounts → "Legacy" (classic) accounts so that
   email/password login via the Storefront API works.
4. **Product tags** — `bestseller` and `new` tags drive the badges on the site.
5. **Metafields (optional)** — shown on product pages when present:

   | Namespace.key | Type | Used for |
   | --- | --- | --- |
   | `reviews.rating` | Rating | star rating (from a reviews app such as Judge.me) |
   | `reviews.rating_count` | Integer | review count |
   | `custom.key_actives` | List of single line text | "Key actives" chips |
   | `custom.full_ingredients` | Multi-line text | Full INCI list |
   | `custom.benefits` | List of single line text | Benefits accordion |
   | `custom.directions` | Multi-line text | Directions accordion |
   | `custom.skin_type` | List of single line text | Filters |
   | `custom.concern` | List of single line text | Filters / search |
   | `custom.dermatologist_note` | Multi-line text | Quote on product page |

   Ratings and review counts are **only** displayed when these metafields exist.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |

## Deploying

This is a single-page app: every route must fall back to `index.html`.
`public/_redirects` (Netlify) and `vercel.json` (Vercel) are included. For other hosts
(nginx, Cloudflare Pages, S3) configure the equivalent rewrite.

## Project layout

```
src/
  context/      ShopContext (catalog, theme, toasts), CartContext, WishlistContext,
                AuthContext (Shopify customer accounts), UIContext (modals, navigation)
  services/     shopify.ts (Storefront API), shopifyCheckout.ts (cartCreate → checkoutUrl)
  graphql/      queries & mutations
  pages/        route components (Home, Shop, Product)
  components/   layout, home sections, product, cart, wishlist, auth
  data/         mock catalog used only in dev without credentials
```
