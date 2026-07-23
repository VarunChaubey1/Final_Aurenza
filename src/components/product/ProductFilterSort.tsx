import React from 'react';
import { FilterState } from '../../types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductFilterSortProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
}

export const ProductFilterSort: React.FC<ProductFilterSortProps> = ({ filter, setFilter, totalCount }) => {
  const handleReset = () => {
    setFilter({
      category: 'All',
      subcategory: 'All',
      concern: 'All',
      skinType: 'All',
      keyIngredient: 'All',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      sortBy: 'featured',
      inStockOnly: false
    });
  };

  return (
    <div className="bg-white dark:bg-[#1B2320] p-6 rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834] shadow-sm mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2F5D50] dark:text-white uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#D6A34A]" />
          <span>Refine Botanical Formulations ({totalCount} items)</span>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Category
          </label>
          <select
            value={filter.category}
            onChange={e => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834] font-bold text-[#1F1F1F] dark:text-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Skin Care">Skin Care</option>
            <option value="Hair Care">Hair Care</option>
          </select>
        </div>

        {/* Skin/Hair Concern */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Primary Concern
          </label>
          <select
            value={filter.concern}
            onChange={e => setFilter(prev => ({ ...prev, concern: e.target.value }))}
            className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834] font-bold text-[#1F1F1F] dark:text-white focus:outline-none"
          >
            <option value="All">All Concerns</option>
            <option value="Dark Spots">Dark Spots & Pigmentation</option>
            <option value="Hair Fall">Hair Loss & Hair Fall</option>
            <option value="Sun Damage">Sun Protection</option>
            <option value="Frizz">Frizz & Heat Protection</option>
            <option value="Dryness">Barrier Repair & Dryness</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Sort By
          </label>
          <select
            value={filter.sortBy}
            onChange={e => setFilter(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            className="w-full p-3 text-xs bg-[#FFF9F4] dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834] font-bold text-[#1F1F1F] dark:text-white focus:outline-none"
          >
            <option value="featured">Featured / Best Seller</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Top Rated (4.8+)</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            Max Price: ₹{filter.maxPrice}
          </label>
          <input
            type="range"
            min={800}
            max={3500}
            step={100}
            value={filter.maxPrice}
            onChange={e => setFilter(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-[#2F5D50] cursor-pointer mt-2"
          />
        </div>
      </div>
    </div>
  );
};
