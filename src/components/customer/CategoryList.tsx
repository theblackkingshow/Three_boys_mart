import React from 'react';
import {
  Apple,
  Milk,
  Croissant,
  Fish,
  Package,
  Coffee,
  Cookie,
  Snowflake,
  Utensils,
  Sparkles,
  Heart,
  Leaf,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroceryCategory } from '../../types';
import { GROCERY_CATEGORIES } from '../../data/mockData';

const iconMap: Record<string, React.ReactNode> = {
  Apple: <Apple className="w-4 h-4" />,
  Milk: <Milk className="w-4 h-4" />,
  Croissant: <Croissant className="w-4 h-4" />,
  Fish: <Fish className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Cookie: <Cookie className="w-4 h-4" />,
  Snowflake: <Snowflake className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
};

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory, selectedSector, setSelectedSector } = useApp();

  const displayedCategories = GROCERY_CATEGORIES.filter((cat) => {
    if (selectedSector === 'grocery') {
      return (
        cat.name !== 'Hot Meals & Kitchen' &&
        cat.name !== 'Sushi & Asian Bowls' &&
        cat.name !== 'Artisan Pizza & Pasta'
      );
    }
    if (selectedSector === 'food') {
      return (
        cat.name === 'Hot Meals & Kitchen' ||
        cat.name === 'Sushi & Asian Bowls' ||
        cat.name === 'Artisan Pizza & Pasta' ||
        cat.name === 'Bakery & Bread' ||
        cat.name === 'Deli & Prepared' ||
        cat.name === 'Beverages & Juices'
      );
    }
    return true;
  });

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <span>
              {selectedSector === 'food'
                ? '🍕 Hot Food Kitchens, Delis & Fresh Meals'
                : selectedSector === 'grocery'
                ? '🥦 Fresh Supermarket Aisles & Produce'
                : '🛒 Food & Grocery Categories'}
            </span>
          </h3>
          {selectedSector !== 'all' && (
            <button
              onClick={() => setSelectedSector('all')}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>
        {selectedCategory !== 'All' && (
          <button
            id="btn-reset-category"
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Clear Category (View All)
          </button>
        )}
      </div>

      {/* Horizontal scrolling pill carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* 'All' button */}
        <button
          id="btn-category-all"
          onClick={() => setSelectedCategory('All')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All {selectedSector === 'food' ? 'Meals' : selectedSector === 'grocery' ? 'Groceries' : 'Items'}</span>
        </button>

        {displayedCategories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              id={`btn-category-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span className={isSelected ? 'text-emerald-200' : 'text-emerald-600'}>
                {iconMap[cat.icon] || <Apple className="w-3.5 h-3.5" />}
              </span>
              <span>{cat.name}</span>
              {cat.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
