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
  Home,
  Gift,
  Gamepad2,
  Shirt,
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
  Home: <Home className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
};

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory, selectedSector, setSelectedSector } = useApp();

  const excludedCategories = new Set([
    'Fresh Produce',
    'Dairy & Eggs', 'Bakery & Bread', 'Meat & Seafood', 'Deli & Prepared',
    'Pantry & Staples', 'Beverages & Juices', 'Snacks & Treats', 'Frozen Foods',
    'Household & Cleaning', 'Organic & Specialty', 'Hot Meals & Kitchen',
    'Sushi & Asian Bowls', 'Artisan Pizza & Pasta',
  ]);
  const displayedCategories = GROCERY_CATEGORIES.filter((cat) => !excludedCategories.has(cat.name) && selectedSector !== 'grocery');

  const chooseDepartment = (department: 'all' | 'groceries' | 'fashion' | 'hair_beauty') => {
    if (department === 'all') {
      setSelectedSector('all');
      setSelectedCategory('All');
    } else if (department === 'groceries') {
      setSelectedSector('grocery');
      setSelectedCategory('Fresh Produce');
    } else if (department === 'fashion') {
      setSelectedSector('lifestyle');
      setSelectedCategory('All');
    } else {
      setSelectedSector('lifestyle');
      setSelectedCategory('Hair & Beauty');
    }
  };

  return (
    <div className="category-strip">
      <div className="category-strip-heading">
        <div className="flex items-center gap-2">
          <h3>
            <span>
              {selectedSector === 'grocery'
                ? 'Groceries'
                : selectedSector === 'lifestyle'
                ? 'Fashion & Hair Beauty'
                : 'Three Boys Mart departments'}
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
      <div className="category-scroll">
        {/* Marketplace departments */}
        <button
          id="btn-category-all"
          onClick={() => chooseDepartment('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All items</span>
        </button>
        <button id="btn-category-groceries" onClick={() => chooseDepartment('groceries')} className="department-button"><Apple className="w-4 h-4" /> Groceries</button>
        <button id="btn-category-fashion" onClick={() => chooseDepartment('fashion')} className="department-button"><Shirt className="w-4 h-4" /> Fashion</button>
        <button id="btn-category-hair-beauty" onClick={() => chooseDepartment('hair_beauty')} className="department-button"><Heart className="w-4 h-4" /> Hair &amp; Beauty</button>
      </div>
    </div>
  );
};
