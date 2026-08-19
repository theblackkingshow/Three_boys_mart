import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChefHat,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Users,
  Flame,
  ArrowRight,
  TrendingDown,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface PresetRecipe {
  id: string;
  title: string;
  category: string;
  cookingTime: string;
  servings: number;
  calories: string;
  description: string;
  image: string;
  productIds: string[]; // IDs from initial products
}

const PRESET_RECIPES: PresetRecipe[] = [
  {
    id: 'rec-1',
    title: 'Tasmanian Crispy Salmon & Smashed Avocado Feast',
    category: 'Seafood & Healthy Dinners',
    cookingTime: '20 mins',
    servings: 2,
    calories: '520 kcal',
    description: 'Pan-seared skin-on Tasmanian salmon fillets paired with creamy Australian Hass avocado, vine tomatoes and organic baby spinach.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    productIds: ['prod-13', 'prod-1', 'prod-3', 'prod-4', 'prod-17'],
  },
  {
    id: 'rec-2',
    title: 'Artisan Sydney Brunch: Sourdough Avocado Smash',
    category: 'Breakfast & Cafe Style',
    cookingTime: '15 mins',
    servings: 2,
    calories: '440 kcal',
    description: 'Toasted woodfired sourdough bread loaded with freshly smashed avocado, free-range pasture eggs, and cold-pressed extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    productIds: ['prod-10', 'prod-1', 'prod-7', 'prod-17', 'prod-20'],
  },
  {
    id: 'rec-3',
    title: 'Gourmet Angus Scotch Fillet with Roasted Potatoes & Salad',
    category: 'Prime Cuts & Grill',
    cookingTime: '25 mins',
    servings: 2,
    calories: '680 kcal',
    description: 'Marble score 3+ Australian grass-fed ribeye steak basted in butter and served with crisp Pink Lady apple salad and artisanal rigatoni.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    productIds: ['prod-14', 'prod-2', 'prod-3', 'prod-17', 'prod-19'],
  },
  {
    id: 'rec-4',
    title: 'Healthy Morning Boost: Organic Berries & Oat Parfait',
    category: 'Quick Breakfast & Detox',
    cookingTime: '5 mins',
    servings: 2,
    calories: '310 kcal',
    description: 'Layered organic wild blueberries, fresh bananas, Australian rolled oat milk and living ginger kombucha for peak vitality.',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&auto=format&fit=crop&q=80',
    productIds: ['prod-25', 'prod-5', 'prod-9', 'prod-21'],
  },
];

export const AiRecipeAssistant: React.FC = () => {
  const { activeModal, setActiveModal, products, addToCart, showToast } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState<PresetRecipe>(PRESET_RECIPES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (activeModal !== 'recipe_ai') return null;

  // Resolve products for active recipe
  const recipeProducts = selectedRecipe.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const recipeTotal = recipeProducts.reduce((sum, p) => sum + p.currentPrice, 0);

  const handleAddAllToCart = () => {
    recipeProducts.forEach((prod) => {
      addToCart(prod, 1, 'best_match');
    });
    showToast(`Added all ${recipeProducts.length} recipe ingredients to your cart!`, 'success');
    setActiveModal('cart');
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Pick matching products based on prompt keywords
      const query = customPrompt.toLowerCase();
      const matched = products.filter((p) => {
        return (
          query.includes(p.name.toLowerCase()) ||
          query.includes(p.category.toLowerCase()) ||
          p.name.toLowerCase().includes('chicken') ||
          p.name.toLowerCase().includes('organic') ||
          p.name.toLowerCase().includes('milk')
        );
      });

      const matchedIds = matched.length > 0 ? matched.slice(0, 4).map((m) => m.id) : ['prod-15', 'prod-18', 'prod-4', 'prod-17'];

      const generatedRecipe: PresetRecipe = {
        id: `rec-custom-${Date.now()}`,
        title: `AI Chef Custom: ${customPrompt.slice(0, 40)}`,
        category: 'Custom AI Meal Plan',
        cookingTime: '20 mins',
        servings: 4,
        calories: '480 kcal',
        description: `Custom curated recipe based on "${customPrompt}". Automatically matched to current fresh stock across supermarkets.`,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        productIds: matchedIds,
      };

      setSelectedRecipe(generatedRecipe);
      showToast('Custom recipe crafted and matched to store stock!', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-recipe-ai"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-100 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 relative">
          <button
            id="btn-close-recipe-modal"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">Smart Meal-to-Cart Chef</h2>
                <span className="text-[10px] font-black bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Choose a chef-designed recipe or type your craving — we automatically match ingredients from local stores with dynamic pricing!
              </p>
            </div>
          </div>

          {/* Custom Recipe Prompt Bar */}
          <form onSubmit={handleCustomGenerate} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-ai-recipe-prompt"
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., 'Cook garlic butter chicken with jasmine rice and green salad for 4 people'"
                className="w-full pl-10 pr-4 py-2.5 bg-white/15 border border-white/30 rounded-2xl text-xs text-white placeholder-amber-200/80 focus:bg-white focus:text-stone-900 focus:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>
            <button
              id="btn-generate-recipe"
              type="submit"
              disabled={isGenerating}
              className="bg-stone-900 hover:bg-black text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Matching Stock...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Create Recipe</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content Body: Left recipe selector, Right ingredients and 1-click cart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Preset Recipe Cards (Left 5 Cols) */}
          <div className="lg:col-span-5 p-4 border-r border-stone-200 bg-stone-50 space-y-2.5 overflow-y-auto max-h-[420px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block px-1">
              Curated Australian Meals
            </span>
            {PRESET_RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              return (
                <button
                  key={recipe.id}
                  id={`btn-select-recipe-${recipe.id}`}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-700 block">
                      {recipe.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1 leading-snug">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {recipe.cookingTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-2.5 h-2.5" />
                        {recipe.servings} serves
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Recipe Ingredients & 1-Click Cart (Right 7 Cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {selectedRecipe.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 font-serif mt-1">
                    {selectedRecipe.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {selectedRecipe.description}
                  </p>
                </div>
              </div>

              {/* Recipe Meta stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-stone-700 py-2 border-y border-stone-100 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Prep & Cook: {selectedRecipe.cookingTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  Servings: {selectedRecipe.servings}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  {selectedRecipe.calories}
                </span>
              </div>

              {/* Matched Store Ingredients */}
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Matched Store Ingredients ({recipeProducts.length})</span>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  All items currently in stock
                </span>
              </h4>

              <div className="space-y-2 mb-4">
                {recipeProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 leading-tight">
                          {prod.name}
                        </h5>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {prod.unit} • {prod.vendorName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-stone-900 font-mono">
                        ${prod.currentPrice.toFixed(2)}
                      </span>
                      {prod.pricingTierInfo?.status === 'surplus_discount' && (
                        <span className="text-[9px] text-emerald-700 font-bold block">
                          📉 Surplus Deal
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-500 block">Total Recipe Basket:</span>
                <span className="text-xl font-black text-stone-900 font-mono">
                  ${recipeTotal.toFixed(2)} AUD
                </span>
              </div>

              <button
                id="btn-add-recipe-to-cart"
                onClick={handleAddAllToCart}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All ({recipeProducts.length} Items) to Basket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
