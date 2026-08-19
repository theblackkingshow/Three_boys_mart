import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  TrendingDown,
  AlertCircle,
  ShieldCheck,
  Store,
  Tag,
  Check,
  ShoppingBag,
  Leaf,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedProductForModal,
    cart,
    addToCart,
    updateCartQuantity,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [substitution, setSubstitution] = useState<'best_match' | 'contact_me' | 'refund'>(
    'best_match'
  );

  if (activeModal !== 'product_detail' || !selectedProductForModal) {
    return null;
  }

  const product = selectedProductForModal;
  const isOutOfStock = product.stock <= 0;
  const tier = product.pricingTierInfo;
  const isSurplus = tier?.status === 'surplus_discount';
  const isScarcity = tier?.status === 'scarcity_surge';

  const cartItem = cart.find((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, substitution);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-product-detail"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 relative flex flex-col"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-modal"
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image and dynamic badge */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isSurplus && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{tier?.discountPercent}% Surplus Discount</span>
              </div>
            )}
            {isScarcity && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Only {product.stock} items left</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Store header */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit mb-3">
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>{product.vendorName}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg md:text-xl font-bold text-stone-900 leading-snug mb-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                <span>{product.unit}</span>
                {product.unitPriceComparison && (
                  <>
                    <span>•</span>
                    <span>{product.unitPriceComparison}</span>
                  </>
                )}
                <span>•</span>
                <span className="font-semibold text-stone-700">{product.origin}</span>
              </div>

              {/* Price & dynamic breakdown */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-black text-stone-900 font-mono">
                    ${product.currentPrice.toFixed(2)}
                  </span>
                  {isSurplus && product.basePrice > product.currentPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono">
                      ${product.basePrice.toFixed(2)} AUD
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {tier?.reason}
                </p>
                <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between border-t border-stone-200/60 pt-1.5">
                  <span>Vendor Inventory Level:</span>
                  <strong className="text-stone-700 font-bold">{product.stock} in stock</strong>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Dietary Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.dietary.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-1 rounded-md"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Nutrition (if available) */}
              {product.nutrition && (
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Nutrition Highlights
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">Energy</span>
                      <strong className="text-stone-800">{product.nutrition.calories}</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">Protein</span>
                      <strong className="text-stone-800">{product.nutrition.protein}</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">Fat</span>
                      <strong className="text-stone-800">{product.nutrition.fat}</strong>
                    </div>
                    <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">Carbs</span>
                      <strong className="text-stone-800">{product.nutrition.carbs}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Substitution preference */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  If item becomes out of stock during picking:
                </label>
                <select
                  id="select-product-substitution"
                  value={substitution}
                  onChange={(e) => setSubstitution(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                >
                  <option value="best_match">🔄 Replace with best supermarket match</option>
                  <option value="contact_me">📞 Driver/Shopper calls me for replacement</option>
                  <option value="refund">❌ Do not replace (refund item automatically)</option>
                </select>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center bg-stone-100 rounded-2xl p-1">
                <button
                  id="btn-modal-minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 disabled:opacity-30 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-stone-900">
                  {quantity}
                </span>
                <button
                  id="btn-modal-plus"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 disabled:opacity-30 flex items-center justify-center text-stone-800 transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                id="btn-modal-add-to-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 text-white py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Add {quantity} to Basket • ${(product.currentPrice * quantity).toFixed(2)} AUD
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
