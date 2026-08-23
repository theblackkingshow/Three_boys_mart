import React, { useState } from 'react';
import {
  Store,
  Package,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Search,
  Filter,
  Save,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, GroceryCategory, DietaryTag } from '../../types';

export const VendorPortal: React.FC = () => {
  const {
    vendors,
    products,
    updateProductStock,
    updateProductBasePrice,
    addNewProduct,
    orders,
    updateOrderStatus,
    showToast,
  } = useApp();

  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || 'vendor-1');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState<GroceryCategory>('Fresh Produce');
  const [newBasePrice, setNewBasePrice] = useState(4.5);
  const [newStock, setNewStock] = useState(30);
  const [newUnit, setNewUnit] = useState('1 kg');
  const [newOrigin, setNewOrigin] = useState('Australia');
  const [newBrand, setNewBrand] = useState('Farm Fresh');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
  );
  const [newImageFile, setNewImageFile] = useState<File | undefined>();

  const vendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  const filteredVendorProducts = vendorProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Store orders
  const storeOrders = orders.filter((o) => o.vendorIds.includes(vendor.id));

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    await addNewProduct({
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: newProductName,
      category: newCategory,
      description: `Premium quality ${newProductName} supplied by ${vendor.name}.`,
      basePrice: Number(newBasePrice),
      stock: Number(newStock),
      initialStock: Number(newStock),
      lowStockThreshold: 6,
      surplusThreshold: 35,
      unit: newUnit,
      origin: newOrigin,
      brand: newBrand,
      image: newImage,
      dietary: ['Australian Grown'],
    }, newImageFile);

    setIsAddProductOpen(false);
    setNewProductName('');
    setNewImageFile(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Vendor Header Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900">{vendor.name}</h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {vendor.type}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {vendor.address} • {vendor.phone}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">
              ✓ Dynamic Inventory Pricing Formula Active
            </span>
          </div>
        </div>

        {/* Store Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-stone-500">
            <span>Manage Store:</span>
            <select
              id="select-vendor-store"
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="ml-1.5 bg-stone-50 border border-stone-200 text-stone-900 font-bold rounded-xl px-3 py-2 focus:outline-none cursor-pointer text-xs"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-open-add-product"
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Sections: Store Fulfillment Queue & Real-time Inventory Pricing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Real-time Inventory & Price Adjustment Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>Store Product Inventory & Dynamic Pricing</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Changing stock units immediately recalculates customer prices across the website.
                </p>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-vendor-search"
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter store items..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold text-[10px]">
                    <th className="pb-2.5">Product</th>
                    <th className="pb-2.5">Base Price</th>
                    <th className="pb-2.5">Inventory Stock</th>
                    <th className="pb-2.5">Dynamic Customer Price</th>
                    <th className="pb-2.5 text-right">Pricing Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredVendorProducts.map((p) => {
                    const isSurplus = p.pricingTierInfo?.status === 'surplus_discount';
                    const isScarcity = p.pricingTierInfo?.status === 'scarcity_surge';

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                              <span className="text-[10px] text-stone-400">{p.category} • {p.unit}</span>
                            </div>
                          </div>
                        </td>

                        {/* Base Price input */}
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-1">
                            <span className="text-stone-400">$</span>
                            <input
                              id={`input-base-price-${p.id}`}
                              type="number"
                              step="0.1"
                              value={p.basePrice}
                              onChange={(e) => updateProductBasePrice(p.id, Number(e.target.value))}
                              className="w-16 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Inventory stock control */}
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2">
                            <input
                              id={`slider-stock-${p.id}`}
                              type="range"
                              min={0}
                              max={60}
                              value={p.stock}
                              onChange={(e) => updateProductStock(p.id, Number(e.target.value))}
                              className="w-20 accent-emerald-700 cursor-pointer"
                            />
                            <span
                              className={`w-7 text-center font-bold font-mono px-1.5 py-0.5 rounded text-xs ${
                                p.stock < 6
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.stock > 35
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-100 text-stone-800'
                              }`}
                            >
                              {p.stock}
                            </span>
                          </div>
                        </td>

                        {/* Computed Dynamic Customer Price */}
                        <td className="py-3 pr-2">
                          <div className="font-black text-stone-900 font-mono text-sm">
                            ${p.currentPrice.toFixed(2)} AUD
                          </div>
                        </td>

                        {/* Pricing Tier badge */}
                        <td className="py-3 text-right">
                          {isSurplus && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              <TrendingDown className="w-3 h-3" />
                              <span>-{p.pricingTierInfo?.discountPercent}% Surplus</span>
                            </span>
                          )}
                          {isScarcity && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              <span>+{p.pricingTierInfo?.surgePercent}% Scarcity</span>
                            </span>
                          )}
                          {!isSurplus && !isScarcity && (
                            <span className="text-[10px] font-medium text-stone-500">
                              Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Store Fulfillment Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Store Orders Queue ({storeOrders.length})</span>
            </h3>

            <div className="space-y-3">
              {storeOrders.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">
                  No active orders for this store right now.
                </p>
              ) : (
                storeOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 font-mono">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Items to pack */}
                    <div className="space-y-1 text-xs">
                      {ord.items
                        .filter((i) => i.vendorId === vendor.id)
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-[11px] text-stone-700"
                          >
                            <span>{item.quantity}x {item.productName}</span>
                            <span className="font-mono text-stone-900">${item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>

                    {/* Store fulfillment action */}
                    {ord.status === 'order_placed' && (
                      <button
                        id={`btn-vendor-accept-${ord.id}`}
                        onClick={() =>
                          updateOrderStatus(ord.id, 'vendor_accepted', `${vendor.name} accepted order.`)
                        }
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Accept & Start Picking
                      </button>
                    )}

                    {ord.status === 'vendor_accepted' && (
                      <button
                        id={`btn-vendor-pack-${ord.id}`}
                        onClick={() =>
                          updateOrderStatus(ord.id, 'packing_items', 'Chilled bags packed and sealed.')
                        }
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Mark as Packed
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div
            id="modal-add-product"
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Add Product to {vendor.name}</h3>
              <button
                id="btn-close-add-product"
                onClick={() => setIsAddProductOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Name</label>
                <input
                  id="input-new-prod-name"
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="E.g., Organic Honey Crisp Apples"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    id="select-new-prod-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Pantry & Staples">Pantry & Staples</option>
                    <option value="Beverages & Juices">Beverages & Juices</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unit / Pack</label>
                  <input
                    id="input-new-prod-unit"
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="1 kg bag / each"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Base Price ($ AUD)</label>
                  <input
                    id="input-new-prod-price"
                    type="number"
                    step="0.1"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Initial Stock Units</label>
                  <input
                    id="input-new-prod-stock"
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1" htmlFor="product-image">Product Image</label>
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setNewImageFile(file);
                    if (file) setNewImage(URL.createObjectURL(file));
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
                <span className="text-[10px] text-stone-400">Choose from camera or gallery on mobile.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-new-product"
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
