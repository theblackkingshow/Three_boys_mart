import React from 'react';
import {
  Plus,
  Minus,
  Sparkles,
  TrendingDown,
  AlertCircle,
  Check,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateCartQuantity, openProductDetail } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isOutOfStock = product.stock <= 0;

  // Inventory pricing info
  const tier = product.pricingTierInfo;
  const isSurplus = tier?.status === 'surplus_discount';
  const isScarcity = tier?.status === 'scarcity_surge';

  return (
    <div
      id={`card-product-${product.id}`}
      className="product-tile group"
    >
      {/* Dynamic Inventory Badge Banner */}
      {isSurplus && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-bold px-3 py-1 flex items-center justify-between shadow-2xs">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>{tier?.discountPercent}% Dynamic Surplus Saver</span>
          </span>
          <span className="text-[9px] text-emerald-100 font-normal">High Stock</span>
        </div>
      )}

      {isScarcity && (
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white text-[10px] font-bold px-3 py-1 flex items-center justify-between shadow-2xs">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 animate-pulse" />
            <span>High Demand: Only {product.stock} left</span>
          </span>
          <span className="text-[9px] text-amber-100 font-normal">Low Stock</span>
        </div>
      )}

      <div className="p-3.5">
        {/* Top Product Image & Vendor Tag */}
        <div
          onClick={() => openProductDetail(product)}
          className="product-image-wrap cursor-pointer relative aspect-4/3 overflow-hidden bg-stone-100 mb-3"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
              Sold Out
            </div>
          )}
        </div>

        {/* Dietary / Origin tags */}
        <div className="product-tags flex flex-wrap items-center gap-1 mb-1.5 min-h-[20px]">
          {product.dietary.slice(0, 2).map((d) => (
            <span
              key={d}
              className="text-[9px] font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Title */}
        <h4
          onClick={() => openProductDetail(product)}
          className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-tight mb-1"
        >
          {product.name}
        </h4>

        {/* Unit & Unit comparison price */}
        <div className="text-[11px] text-stone-500 font-medium flex items-center justify-between mb-2">
          <span>{product.unit}</span>
          {product.unitPriceComparison && (
            <span className="text-stone-400 text-[10px]">{product.unitPriceComparison}</span>
          )}
        </div>

        {/* Inventory Stock Indicator */}
        <div className="product-stock-meter mb-3">
          <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium mb-1">
            <span>Vendor Stock: {product.stock} units</span>
            <span
              className={`font-semibold ${
                product.stock < 6
                  ? 'text-rose-600'
                  : product.stock > 35
                  ? 'text-emerald-700'
                  : 'text-stone-600'
              }`}
            >
              {product.stock < 6 ? 'Low Stock' : product.stock > 35 ? 'Surplus' : 'In Stock'}
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                product.stock < 6
                  ? 'bg-rose-500'
                  : product.stock > 35
                  ? 'bg-emerald-500'
                  : 'bg-emerald-600'
              }`}
              style={{
                width: `${Math.min(100, (product.stock / (product.initialStock || 50)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Price & Add To Cart Button */}
      <div className="p-3.5 pt-0 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
              ${product.currentPrice.toFixed(2)}
            </span>
            {isSurplus && product.basePrice > product.currentPrice && (
              <span className="text-xs text-stone-400 line-through font-mono">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 block -mt-1">AUD</span>
        </div>

        {/* Cart controls */}
        {cartItem ? (
          <div className="flex items-center bg-emerald-700 text-white rounded-xl shadow-xs overflow-hidden">
            <button
              id={`btn-minus-${product.id}`}
              onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
              className="p-2 hover:bg-emerald-800 transition-colors cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-bold min-w-[20px] text-center">
              {cartItem.quantity}
            </span>
            <button
              id={`btn-plus-${product.id}`}
              onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
              disabled={cartItem.quantity >= product.stock}
              className="p-2 hover:bg-emerald-800 disabled:opacity-40 transition-colors cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            id={`btn-add-cart-${product.id}`}
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
