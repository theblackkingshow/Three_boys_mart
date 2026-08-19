import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Store,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartServiceFee,
    driverTip,
    setDriverTip,
    cartTotal,
    cartUniqueVendors,
  } = useApp();

  if (activeModal !== 'cart') return null;

  const totalSurplusSavings = cart.reduce((sum, item) => {
    if (item.product.basePrice > item.product.currentPrice) {
      return sum + (item.product.basePrice - item.product.currentPrice) * item.quantity;
    }
    return sum;
  }, 0);

  const tips = [2, 3, 5, 8];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="drawer-cart"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Your Fresh Basket</h2>
                <p className="text-xs text-stone-500">
                  {cart.length} unique items across {cartUniqueVendors.length} store(s)
                </p>
              </div>
            </div>

            <button
              id="btn-close-cart-drawer"
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Your basket is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-4">
                  Explore fresh farm produce, woodfired bakery, Tasmanian seafood and pantry essentials.
                </p>
                <button
                  id="btn-empty-cart-explore"
                  onClick={() => setActiveModal(null)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Dynamic Surplus Savings Highlight */}
                {totalSurplusSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-900">
                    <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">
                        You saved ${totalSurplusSavings.toFixed(2)} AUD today
                      </span>{' '}
                      from vendor surplus inventory discounts!
                    </div>
                  </div>
                )}

                {/* Items Grouped by Store */}
                {cartUniqueVendors.map((vendor) => {
                  const vendorItems = cart.filter((i) => i.product.vendorId === vendor.id);
                  return (
                    <div
                      key={vendor.id}
                      className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/40"
                    >
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-emerald-700" />
                          <span className="text-xs font-bold text-stone-900">{vendor.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {vendor.deliveryTimeMin}-{vendor.deliveryTimeMax} min prep
                        </span>
                      </div>

                      <div className="space-y-3">
                        {vendorItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-start justify-between gap-3 bg-white p-2.5 rounded-xl border border-stone-100 shadow-2xs"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                                {item.product.name}
                              </h4>
                              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                                <span>{item.product.unit}</span>
                                <span>•</span>
                                <span className="font-bold text-stone-900 font-mono">
                                  ${item.product.currentPrice.toFixed(2)} ea
                                </span>
                              </div>

                              {/* Substitution Tag */}
                              <div className="text-[10px] text-stone-400 mt-1">
                                Sub: {item.selectedSubstitution.replace(/_/g, ' ')}
                              </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex flex-col items-end justify-between self-stretch">
                              <span className="text-xs font-black text-stone-900 font-mono">
                                ${(item.product.currentPrice * item.quantity).toFixed(2)}
                              </span>

                              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 mt-2">
                                <button
                                  id={`btn-cart-minus-${item.product.id}`}
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="w-5 h-5 rounded-md bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer shadow-2xs text-xs"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-stone-900">
                                  {item.quantity}
                                </span>
                                <button
                                  id={`btn-cart-plus-${item.product.id}`}
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                  className="w-5 h-5 rounded-md bg-white hover:bg-stone-200 disabled:opacity-30 flex items-center justify-center text-stone-700 cursor-pointer shadow-2xs text-xs"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Driver Tip Selector */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Support Your Courier Driver</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      +${driverTip.toFixed(2)} AUD
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {tips.map((amount) => (
                      <button
                        key={amount}
                        id={`btn-tip-${amount}`}
                        onClick={() => setDriverTip(amount)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          driverTip === amount
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                    <button
                      id="btn-tip-custom"
                      onClick={() => setDriverTip(0)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        driverTip === 0
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      No Tip
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              {/* Cost Summary Table */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Groceries Subtotal</span>
                  <span className="font-mono text-stone-900 font-semibold">
                    ${cartSubtotal.toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">
                      Chilled Van
                    </span>
                  </span>
                  <span className="font-mono text-stone-900 font-semibold">
                    ${cartDeliveryFee.toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service & Bagging Fee</span>
                  <span className="font-mono text-stone-900 font-semibold">
                    ${cartServiceFee.toFixed(2)} AUD
                  </span>
                </div>
                {driverTip > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Driver Gratuity Tip</span>
                    <span className="font-mono font-semibold">
                      +${driverTip.toFixed(2)} AUD
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                  <span>Total (incl. GST)</span>
                  <span className="font-mono text-lg text-emerald-800">
                    ${cartTotal.toFixed(2)} AUD
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                id="btn-proceed-to-checkout"
                onClick={() => {
                  setActiveModal('checkout');
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Proceed to Secure Checkout (${cartTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
