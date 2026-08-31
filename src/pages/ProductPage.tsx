import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useUI } from '../context/UIContext';
import { getProductByHandle } from '../services/shopify';
import { Product } from '../types';
import { ProductDetailPage } from '../components/product/ProductDetailPage';
import { CatalogStatus } from '../components/common/CatalogStatus';

export const ProductPage: React.FC = () => {
  const { handle = '' } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { products, loadingProducts } = useShop();
  const { setQuickViewProduct, goToProduct } = useUI();

  const fromCatalog = products.find(p => p.handle === handle) || null;
  const [fetched, setFetched] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fall back to a direct fetch when the product is not in the first page of the catalog.
  useEffect(() => {
    setFetched(null);
    setNotFound(false);
    if (fromCatalog || loadingProducts) return;
    let cancelled = false;
    getProductByHandle(handle)
      .then(p => {
        if (cancelled) return;
        if (p) setFetched(p);
        else setNotFound(true);
      })
      .catch(() => !cancelled && setNotFound(true));
    return () => {
      cancelled = true;
    };
  }, [handle, fromCatalog, loadingProducts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handle]);

  const product = fromCatalog || fetched;

  if (!product) {
    if (notFound) {
      return (
        <div className="py-24 text-center space-y-4">
          <h1 className="text-2xl font-serif font-bold text-[#2F5D50] dark:text-[#D6A34A]">Product not found</h1>
          <Link to="/shop" className="inline-block text-xs font-bold uppercase tracking-wider underline">
            Back to shop
          </Link>
        </div>
      );
    }
    return <CatalogStatus loading error={null} />;
  }

  return (
    <ProductDetailPage
      key={product.id}
      product={product}
      allProducts={products}
      onBackToShop={() => navigate('/shop')}
      onQuickView={setQuickViewProduct}
      onSelectProduct={goToProduct}
    />
  );
};
