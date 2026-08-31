import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useUI } from '../context/UIContext';
import { ShopCatalogView } from '../components/shop/ShopCatalogView';
import { CatalogStatus } from '../components/common/CatalogStatus';

export const ShopPage: React.FC = () => {
  const [params] = useSearchParams();
  const { products, loadingProducts, catalogError } = useShop();
  const { setQuickViewProduct, goToProduct } = useUI();

  if (products.length === 0) {
    return <CatalogStatus loading={loadingProducts} error={catalogError} />;
  }

  return (
    <ShopCatalogView
      key={params.toString()}
      products={products}
      initialCategory={params.get('category') || 'All'}
      initialSubcategory={params.get('sub') || 'All'}
      initialIngredient={params.get('ingredient') || 'All'}
      onQuickView={setQuickViewProduct}
      onSelectProduct={goToProduct}
    />
  );
};
