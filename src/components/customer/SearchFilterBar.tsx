import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Tag,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DietaryTag } from '../../types';

const DIETARY_OPTIONS: DietaryTag[] = [
  'Organic',
  'Australian Grown',
  'Gluten-Free',
  'Vegan',
  'Vegetarian',
  'Dairy-Free',
  'Halal',
  'Sugar-Free',
];

export const SearchFilterBar: React.FC = () => {
  const {
    selectedSector,
    setSelectedSector,
    searchQuery,
    setSearchQuery,
    selectedDietary,
    toggleDietaryFilter,
    priceRange,
    setPriceRange,
    onlyInStock,
    setOnlyInStock,
    sortBy,
    setSortBy,
    filteredProducts,
    resetFilters,
  } = useApp();

  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedDietary.length +
    (onlyInStock ? 1 : 0) +
    (selectedSector !== 'all' ? 1 : 0) +
    (priceRange[1] < 50 || priceRange[0] > 0 ? 1 : 0);

  return (
    <div className="catalog-toolbar">
      {/* Sector Quick Tabs: All / Grocery / Food */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-1.5">
          <button
            id="filter-sector-all"
            onClick={() => setSelectedSector('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSector === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Marketplace
          </button>
          <button
            id="filter-sector-grocery"
            onClick={() => setSelectedSector('grocery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSector === 'grocery'
                ? 'bg-emerald-800 text-white shadow-xs ring-1 ring-emerald-900'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🥦 Supermarket Groceries</span>
          </button>
          <button
            id="filter-sector-food"
            onClick={() => setSelectedSector('food')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSector === 'food'
                ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🍕 Hot Food & Kitchens</span>
          </button>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with live clear */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-main-catalog-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, style, beauty, home, gifts and more..."
            className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
          />
          {searchQuery && (
            <button
              id="btn-clear-main-search"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick controls: Sort By, Filter Toggle, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500 font-medium hidden sm:inline">Sort:</span>
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-900 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="popularity">Most Popular</option>
              <option value="discount">Surplus Dynamic Discount</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Stock Freshness</option>
            </select>
          </div>

          {/* Toggle Advanced Filters */}
          <button
            id="btn-toggle-filters"
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isAdvancedFiltersOpen || activeFilterCount > 0
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-emerald-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset Filters button */}
          {activeFilterCount > 0 && (
            <button
              id="btn-reset-all-filters"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer / Expansion */}
      {isAdvancedFiltersOpen && (
        <div
          id="panel-advanced-filters"
          className="mt-4 pt-4 border-t border-stone-100 space-y-4 animate-in fade-in duration-150"
        >
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
              <span>Price Range (AUD)</span>
              <span className="text-emerald-700 font-semibold">
                ${priceRange[0]} — ${priceRange[1]} AUD
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400">$0</span>
              <input
                id="input-price-range"
                type="range"
                min={0}
                max={50}
                step={1}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
              />
              <span className="text-xs text-stone-400">$50+</span>
            </div>
          </div>

          {/* Dietary & Origin Tags */}
          <div>
            <div className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>Dietary Preferences & Australian Grown</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((tag) => {
                const isSelected = selectedDietary.includes(tag);
                return (
                  <button
                    key={tag}
                    id={`btn-dietary-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => toggleDietaryFilter(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-300" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <label htmlFor="toggle-in-stock" className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                id="toggle-in-stock"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Show only items available in vendor inventory</span>
            </label>
            <span className="text-xs text-stone-500 font-medium">
              Found <strong className="text-stone-900">{filteredProducts.length}</strong> items
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
