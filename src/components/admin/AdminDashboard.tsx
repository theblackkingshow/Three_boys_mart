import React, { useState } from 'react';
import {
  Shield,
  ShoppingBag,
  Truck,
  Store,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  ArrowRight,
  Filter,
  CreditCard,
  Layers,
  Sparkles,
  Plus,
  X,
  ImagePlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GroceryCategory, OrderStatus, PaymentMethodType } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    vendors,
    products,
    drivers,
    pricingConfig,
    updatePricingConfig,
    updateOrderStatus,
    assignDriverToOrder,
    cancelOrder,
    updateProductStock,
    updateProductBasePrice,
    updateProductImage,
    addNewProduct,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'orders' | 'catalog' | 'fleet' | 'pricing_engine' | 'vendors' | 'payments'
  >('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(5);
  const [newProductStock, setNewProductStock] = useState(20);
  const [newProductCategory, setNewProductCategory] = useState<GroceryCategory>('Fresh Produce');
  const [newProductImage, setNewProductImage] = useState<File | undefined>();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Dynamic pricing rule draft state
  const [surplusDiscount, setSurplusDiscount] = useState(pricingConfig.surplusDiscountPercentage);
  const [surplusThreshold, setSurplusThreshold] = useState(pricingConfig.surplusThreshold);
  const [scarcitySurge, setScarcitySurge] = useState(pricingConfig.scarcitySurgePercentage);
  const [scarcityThreshold, setScarcityThreshold] = useState(pricingConfig.scarcityThreshold);

  // Financial KPI calculations
  const totalGMV = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );
  const activeFleetCount = drivers.filter((d) => d.status !== 'offline').length;

  const filteredOrders = orders.filter((o) => {
    const matchQuery =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.vendorNames.some((v) => v.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchStatus = selectedStatusFilter === 'all' || o.status === selectedStatusFilter;
    return matchQuery && matchStatus;
  });

  const filteredCatalog = products.filter((product) =>
    `${product.name} ${product.category} ${product.vendorName}`
      .toLowerCase()
      .includes(productSearch.toLowerCase())
  );

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    const vendor = vendors[0];
    if (!newProductName.trim() || !vendor) return;
    await addNewProduct({
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: newProductName.trim(),
      category: newProductCategory,
      itemType: 'grocery',
      description: `Premium quality ${newProductName.trim()} supplied by ${vendor.name}.`,
      basePrice: Number(newProductPrice),
      stock: Number(newProductStock),
      initialStock: Number(newProductStock),
      lowStockThreshold: 6,
      surplusThreshold: 35,
      dietary: [],
      origin: 'Australia',
      brand: 'FreshMarket',
      unit: 'each',
      image: newProductImage ? URL.createObjectURL(newProductImage) : '',
    }, newProductImage);
    setNewProductName('');
    setNewProductImage(undefined);
    setIsAddProductOpen(false);
  };

  const handleSavePricingConfig = () => {
    updatePricingConfig({
      surplusDiscountPercentage: Number(surplusDiscount),
      surplusThreshold: Number(surplusThreshold),
      scarcitySurgePercentage: Number(scarcitySurge),
      scarcityThreshold: Number(scarcityThreshold),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Admin Title & Overview KPIs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 font-serif">Central Admin Command Hub</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time platform operations, multi-vendor catalog, dynamic pricing engine & driver dispatch
          </p>
        </div>

        <span className="text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
          <span>System Healthy • All Gateways Active</span>
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Gross Marketplace Volume
          </span>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
            ${totalGMV.toFixed(2)} AUD
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            ↑ +18.4% vs last week
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Total Orders Logged
          </span>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
            {orders.length}
          </div>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            {totalItemsSold} grocery items processed
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Active Driver Fleet
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-900 font-mono">
            {activeFleetCount} / {drivers.length} Online
          </div>
          <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
            Real-time GPS telemetry active
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Active Stores & Vendors
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
            {vendors.length} Stores
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            {products.length} live catalog items
          </span>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        <button
          id="btn-admin-tab-orders"
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'orders'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>All Orders ({orders.length})</span>
        </button>

        <button
          id="btn-admin-tab-pricing"
          onClick={() => setActiveAdminTab('pricing_engine')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'pricing_engine'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Dynamic Pricing Rules</span>
        </button>

        <button
          id="btn-admin-tab-catalog"
          onClick={() => setActiveAdminTab('catalog')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'catalog'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          id="btn-admin-tab-fleet"
          onClick={() => setActiveAdminTab('fleet')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'fleet'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Driver Fleet ({drivers.length})</span>
        </button>

        <button
          id="btn-admin-tab-vendors"
          onClick={() => setActiveAdminTab('vendors')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'vendors'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Supermarket Directory ({vendors.length})</span>
        </button>

        <button
          id="btn-admin-tab-payments"
          onClick={() => setActiveAdminTab('payments')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'payments'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateways Audit</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-admin-search-orders"
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer, or supermarket..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
              />
            </div>

            <select
              id="select-admin-order-status-filter"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Order Statuses</option>
              <option value="order_placed">Order Placed</option>
              <option value="vendor_accepted">Store Accepted</option>
              <option value="packing_items">Packing</option>
              <option value="driver_assigned">Driver Assigned</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold text-[10px]">
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5">Customer & Destination</th>
                  <th className="pb-2.5">Supermarket Stores</th>
                  <th className="pb-2.5">Amount & Gateway</th>
                  <th className="pb-2.5">Assigned Courier</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-stone-900 font-mono">#{ord.orderNumber}</div>
                      <span className="text-[10px] text-stone-400">{ord.createdAt}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="font-bold text-stone-800">{ord.customerName}</div>
                      <span className="text-[10px] text-stone-500">
                        {ord.deliveryAddress.suburb}, {ord.deliveryAddress.state}
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="text-stone-700 font-medium line-clamp-1">
                        {ord.vendorNames.join(', ')}
                      </div>
                      <span className="text-[10px] text-stone-400">{ord.items.length} items</span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="font-black text-stone-900 font-mono">
                        ${ord.totalAmount.toFixed(2)} AUD
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                        {ord.payment.provider}
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      {ord.driver ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={ord.driver.avatar}
                            alt={ord.driver.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-stone-800">{ord.driver.name}</span>
                        </div>
                      ) : (
                        <select
                          id={`select-reassign-driver-${ord.id}`}
                          onChange={(e) => assignDriverToOrder(ord.id, e.target.value)}
                          className="bg-stone-100 border border-stone-200 text-stone-700 rounded px-1 py-0.5 text-[10px] cursor-pointer"
                        >
                          <option value="">Assign Driver...</option>
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-3 pr-2">
                      <select
                        id={`select-status-${ord.id}`}
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
                      >
                        <option value="order_placed">Order Placed</option>
                        <option value="vendor_accepted">Store Accepted</option>
                        <option value="packing_items">Packing</option>
                        <option value="driver_assigned">Driver Assigned</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      {ord.status !== 'cancelled' && ord.status !== 'delivered' && (
                        <button
                          id={`btn-cancel-order-${ord.id}`}
                          onClick={() => cancelOrder(ord.id)}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Dynamic Pricing Engine Configuration */}
      {activeAdminTab === 'pricing_engine' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Global Dynamic Inventory Pricing Algorithm
              </h3>
              <p className="text-xs text-stone-500">
                Configure automated percentage discounts for high/surplus inventory and demand surge rules for scarce stock across all vendors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Surplus Stock Saver Rule */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Surplus Inventory Discount Rule</span>
                </span>
                <span className="text-sm font-black text-emerald-800 font-mono">
                  -{surplusDiscount}% OFF
                </span>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1">
                  Surplus Discount Percentage: <strong>{surplusDiscount}%</strong>
                </label>
                <input
                  id="slider-surplus-discount"
                  type="range"
                  min={5}
                  max={30}
                  value={surplusDiscount}
                  onChange={(e) => setSurplusDiscount(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1">
                  Trigger Stock Threshold: <strong>≥ {surplusThreshold} items in vendor stock</strong>
                </label>
                <input
                  id="slider-surplus-threshold"
                  type="range"
                  min={20}
                  max={60}
                  value={surplusThreshold}
                  onChange={(e) => setSurplusThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-emerald-800">
                Applies when vendor inventory is high to minimize food waste and offer customers grocery deals.
              </p>
            </div>

            {/* Scarcity Surge Rule */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Scarcity Demand Adjustment Rule</span>
                </span>
                <span className="text-sm font-black text-amber-800 font-mono">
                  +{scarcitySurge}% Surge
                </span>
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1">
                  Scarcity Surge Percentage: <strong>+{scarcitySurge}%</strong>
                </label>
                <input
                  id="slider-scarcity-surge"
                  type="range"
                  min={0}
                  max={20}
                  value={scarcitySurge}
                  onChange={(e) => setScarcitySurge(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-stone-700 block mb-1">
                  Trigger Low Stock Threshold: <strong>≤ {scarcityThreshold} items remaining</strong>
                </label>
                <input
                  id="slider-scarcity-threshold"
                  type="range"
                  min={2}
                  max={12}
                  value={scarcityThreshold}
                  onChange={(e) => setScarcityThreshold(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-amber-800">
                Signals urgency to customer ("Only X left") and adjusts pricing dynamically.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="btn-save-pricing-config"
              onClick={handleSavePricingConfig}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Apply & Re-Calculate All Store Catalog Prices
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Driver Fleet Directory */}
      {(activeAdminTab === 'fleet' || activeAdminTab === 'catalog') && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className={activeAdminTab === 'catalog' ? 'hidden' : ''}>
            <h3 className="text-sm font-bold text-stone-900">Courier Fleet Telemetry & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drivers.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={d.avatar}
                    alt={d.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{d.name}</h4>
                    <span className="text-[10px] text-stone-500 font-mono">{d.phone}</span>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      ★ {d.rating} ({d.totalDeliveries} runs)
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Vehicle:</span>
                    <span className="font-semibold text-stone-800">{d.vehicleModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Plate:</span>
                    <span className="font-mono font-bold text-stone-900">{d.vehiclePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Today Payout:</span>
                    <span className="font-mono font-bold text-emerald-800">${d.todayEarnings.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-stone-500">Status:</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        d.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'busy'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            </div>
          </div>

          {/* Product Catalog Management */}
          {activeAdminTab === 'catalog' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Product Catalog Management</h3>
                    <p className="text-xs text-stone-500 mt-1">Update live inventory and base prices across every store.</p>
                  </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    id="btn-admin-add-product"
                    type="button"
                    onClick={() => setIsAddProductOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product
                  </button>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-admin-search-products"
                      type="search"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products, stores, categories..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                    />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold text-[10px]">
                        <th className="pb-2.5">Product</th>
                        <th className="pb-2.5">Store</th>
                        <th className="pb-2.5">Category</th>
                        <th className="pb-2.5">Base Price</th>
                        <th className="pb-2.5">Stock</th>
                        <th className="pb-2.5">Current Price</th>
                        <th className="pb-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredCatalog.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50/70">
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="relative shrink-0">
                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                <label htmlFor={`product-image-${product.id}`} className="absolute -right-1 -bottom-1 bg-white rounded-full p-1 shadow border border-stone-200 cursor-pointer" title="Replace product image">
                                  <ImagePlus className="w-3 h-3 text-purple-700" />
                                </label>
                                <input
                                  id={`product-image-${product.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) void updateProductImage(product.id, file);
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-bold text-stone-900 max-w-[220px] truncate">{product.name}</div>
                                <div className="text-[10px] text-stone-500">{product.unit}</div>

                          {isAddProductOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
                              <form onSubmit={handleAddProduct} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-base font-bold text-stone-900">Add Product</h3>
                                  <button type="button" onClick={() => setIsAddProductOpen(false)} aria-label="Close add product form"><X className="w-5 h-5 text-stone-500" /></button>
                                </div>
                                <input required value={newProductName} onChange={(event) => setNewProductName(event.target.value)} placeholder="Product name" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm" />
                                <div className="grid grid-cols-2 gap-3">
                                  <select value={newProductCategory} onChange={(event) => setNewProductCategory(event.target.value as GroceryCategory)} className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm">
                                    <option>Fresh Produce</option><option>Dairy & Eggs</option><option>Bakery & Bread</option><option>Meat & Seafood</option><option>Pantry & Staples</option><option>Beverages & Juices</option>
                                  </select>
                                  <input type="number" min="0" step="0.01" value={newProductPrice} onChange={(event) => setNewProductPrice(Number(event.target.value))} aria-label="Base price" className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm" />
                                </div>
                                <input type="number" min="0" step="1" value={newProductStock} onChange={(event) => setNewProductStock(Number(event.target.value))} aria-label="Initial stock" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm" />
                                <label className="block text-xs font-bold text-stone-700">Product image<input type="file" id="product-image" accept="image/*" onChange={(event) => setNewProductImage(event.target.files?.[0])} className="mt-1 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2" /></label>
                                <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl py-2.5 text-sm font-bold">Save Product</button>
                              </form>
                            </div>
                          )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-3 text-stone-700 max-w-[150px]">{product.vendorName}</td>
                          <td className="py-3 pr-3 text-stone-500">{product.category}</td>
                          <td className="py-3 pr-3">
                            <input
                              aria-label={`Base price for ${product.name}`}
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={product.basePrice}
                              onBlur={(e) => {
                                const value = Number(e.target.value);
                                if (Number.isFinite(value) && value >= 0 && value !== product.basePrice) {
                                  updateProductBasePrice(product.id, value);
                                  showToast(`${product.name} price updated`, 'success');
                                }
                              }}
                              className="w-24 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 font-mono text-xs"
                            />
                          </td>
                          <td className="py-3 pr-3">
                            <input
                              aria-label={`Stock for ${product.name}`}
                              type="number"
                              min="0"
                              step="1"
                              defaultValue={product.stock}
                              onBlur={(e) => {
                                const value = Number(e.target.value);
                                if (Number.isInteger(value) && value >= 0 && value !== product.stock) {
                                  updateProductStock(product.id, value);
                                }
                              }}
                              className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 font-mono text-xs"
                            />
                          </td>
                          <td className="py-3 pr-3 font-black text-stone-900">${product.currentPrice.toFixed(2)}</td>
                          <td className="py-3 text-right">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock <= 0 ? 'bg-rose-100 text-rose-700' : product.stock > 35 ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                              {product.stock <= 0 ? 'Out of stock' : product.stock > 35 ? 'Surplus' : 'In stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCatalog.length === 0 && <p className="text-center text-sm text-stone-500 py-10">No products match your search.</p>}
                </div>
              </div>
          )}
        </div>
      )}

      {/* Tab 4: Vendors Directory */}
      {activeAdminTab === 'vendors' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Partner Supermarkets & Artisan Grocers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={v.logo}
                      alt={v.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{v.name}</h4>
                      <span className="text-[10px] font-semibold text-emerald-700">{v.type}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2">{v.address}</p>
                </div>
                <div className="pt-2 border-t border-stone-200 text-[11px] flex justify-between text-stone-600">
                  <span>★ {v.rating} ({v.reviewsCount} reviews)</span>
                  <span className="font-semibold text-stone-900">${v.deliveryFee.toFixed(2)} Delivery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payment Gateway Logs */}
      {activeAdminTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Multi-Gateway Payment Audit Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold text-[10px]">
                  <th className="pb-2">Txn ID</th>
                  <th className="pb-2">Gateway Provider</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-xs">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 text-stone-700">{o.payment.transactionId}</td>
                    <td className="py-2.5 font-sans font-semibold text-stone-900">
                      {o.payment.provider}
                    </td>
                    <td className="py-2.5 font-black text-stone-900">${o.totalAmount.toFixed(2)} AUD</td>
                    <td className="py-2.5 text-stone-500 font-sans">{o.payment.paidAt}</td>
                    <td className="py-2.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-sans font-bold">
                        ✓ {o.payment.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
