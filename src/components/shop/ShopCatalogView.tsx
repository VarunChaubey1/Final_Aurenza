import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { Filter, SlidersHorizontal, Search, RotateCcw, X } from 'lucide-react';

interface ShopCatalogViewProps {
  products: Product[];
  initialCategory?: string;
  initialSubcategory?: string;
  initialIngredient?: string;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  initialCategory = 'All',
  initialSubcategory = 'All',
  initialIngredient = 'All',
  onQuickView,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedIngredient, setSelectedIngredient] = useState<string>(initialIngredient);
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low-high' | 'price-high-low' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique concerns and ingredients
  const concernsList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.concern.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [products]);

  const ingredientsList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.ingredients.keyActives.forEach((i) => set.add(i)));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.ingredients.keyActives.some((i) => i.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory !== 'All') {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (selectedConcern !== 'All') {
      result = result.filter((p) => p.concern.includes(selectedConcern));
    }

    if (selectedIngredient !== 'All') {
      result = result.filter((p) =>
        p.ingredients.keyActives.some((i) =>
          i.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      );
    }

    // Sort
    if (sortBy === 'price-low-high') {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'price-high-low') {
      result.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedConcern, selectedIngredient, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedIngredient('All');
    setSelectedConcern('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div id="shop-catalog-view" className="py-12 bg-[#FFF9F4] dark:bg-[#121816] transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-10 text-left">
          <span className="text-xs font-bold text-[#D6A34A] uppercase tracking-[0.2em] block mb-2">
            Aurenza Botanical Store
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2F5D50] dark:text-[#F3F4F6]">
            {selectedCategory === 'All' ? 'Complete Collection' : `${selectedCategory} Formulations`}
          </h1>
          <p className="text-xs sm:text-sm text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 mt-2 max-w-xl">
            Explore high-potency Vitamin C, Glutathione, Niacinamide, and Rosemary formulas engineered for maximum skin and scalp health.
          </p>
        </div>

        {/* Top Control Bar: Search, Mobile Filter Toggle, Sort Selector */}
        <div className="bg-white dark:bg-[#1B2320] p-4 rounded-3xl border border-[#2F5D50]/15 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by active or concern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFF9F4] dark:bg-[#121816] pl-10 pr-4 py-2.5 rounded-2xl text-xs border border-[#2F5D50]/10 focus:outline-none focus:border-[#2F5D50]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Mobile Filter Toggle */}
            <button
              id="btn-mobile-filter-toggle"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Results count text */}
            <span className="hidden sm:inline text-xs font-semibold text-[#6B7280]">
              Showing <strong>{filteredProducts.length}</strong> products
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FFF9F4] dark:bg-[#121816] border border-[#2F5D50]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#1F1F1F] dark:text-[#F3F4F6] focus:outline-none"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter Panel (Desktop & Mobile Drawer) */}
          <aside
            className={`lg:col-span-1 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white dark:bg-[#1B2320] p-6 rounded-3xl border border-[#2F5D50]/15 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2F5D50]/10">
                <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-[#2F5D50] dark:text-[#D6A34A]">
                  <Filter className="w-4 h-4" />
                  Filter Catalog
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#D6A34A] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>

              {/* Filter 1: Main Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-2.5">
                  Category
                </h4>
                <div className="space-y-1">
                  {['All', 'Skin Care', 'Hair Care'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory('All');
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#2F5D50] text-white'
                          : 'text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Subcategory */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-2.5">
                  Product Type
                </h4>
                <div className="space-y-1">
                  {['All', 'Face Serum', 'Face Wash', 'Sunscreen', 'Moisturizer', 'Hair Oil', 'Shampoo', 'Hair Serum'].map(
                    (sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedSubcategory === sub
                            ? 'bg-[#2F5D50] text-white'
                            : 'text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 hover:bg-[#FFF9F4] dark:hover:bg-[#2C3834]'
                        }`}
                      >
                        {sub}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Filter 3: Primary Concern */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-2.5">
                  Skin / Hair Concern
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedConcern('All')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                      selectedConcern === 'All'
                        ? 'bg-[#D6A34A] text-[#1F1F1F] border-[#D6A34A]'
                        : 'border-[#2F5D50]/20 text-[#1F1F1F]/70'
                    }`}
                  >
                    All Concerns
                  </button>
                  {concernsList.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedConcern(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        selectedConcern === c
                          ? 'bg-[#2F5D50] text-white border-[#2F5D50]'
                          : 'border-[#2F5D50]/20 text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Key Active Ingredient */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] dark:text-[#F3F4F6] mb-2.5">
                  Key Actives Spotlight
                </h4>
                <div className="space-y-1">
                  {['All', 'Vitamin C', 'Glutathione', 'Niacinamide', 'Hyaluronic Acid', 'Rosemary', 'Onion', 'Biotin', 'Keratin'].map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setSelectedIngredient(ing)}
                      className={`block w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedIngredient === ing
                          ? 'bg-[#D6A34A] text-[#1F1F1F] font-bold'
                          : 'text-[#1F1F1F]/70 dark:text-[#F3F4F6]/70 hover:bg-[#FFF9F4]'
                      }`}
                    >
                      ✨ {ing}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#1B2320] rounded-3xl p-12 text-center border border-[#2F5D50]/15 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-[#2F5D50]">
                  No products matched your exact filter
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  Try relaxing your ingredient or concern filters to browse our standard formulation lineup.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#2F5D50] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#1a382f]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
