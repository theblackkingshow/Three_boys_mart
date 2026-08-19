import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Sparkles,
  User,
  Shield,
  Truck,
  Store,
  ChevronDown,
  TrendingDown,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    setUserRole,
    userProfile,
    cart,
    cartTotal,
    setActiveModal,
    activeTab,
    setActiveTab,
    selectedSector,
    setSelectedSector,
    setSelectedCategory,
    setSelectedVendorId,
    searchQuery,
    setSearchQuery,
    pricingConfig,
    activeDriver,
    activeTrackingOrderId,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const portals: {
    role: UserRole;
    tab: typeof activeTab;
    label: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
  }[] = [
    {
      role: 'customer',
      tab: 'store',
      label: 'Food & Grocery Storefront',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'bg-emerald-600 text-white',
      desc: 'Browse fresh produce, supermarket aisles & hot meals',
    },
    {
      role: 'customer',
      tab: 'user_profile',
      label: 'Customer Account & Orders',
      icon: <User className="w-4 h-4" />,
      color: 'bg-teal-600 text-white',
      desc: 'Order history, addresses & Fresh Club rewards',
    },
    {
      role: 'driver',
      tab: 'driver_portal',
      label: 'Delivery Driver Application',
      icon: <Truck className="w-4 h-4" />,
      color: 'bg-blue-600 text-white',
      desc: 'GPS dispatch route, shift earnings & proof of delivery',
    },
    {
      role: 'vendor',
      tab: 'vendor_portal',
      label: 'Supermarket & Kitchen Portal',
      icon: <Store className="w-4 h-4" />,
      color: 'bg-amber-600 text-white',
      desc: 'Live inventory dynamic pricing & kitchen order prep',
    },
    {
      role: 'admin',
      tab: 'admin_dashboard',
      label: 'Admin Command Center',
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-purple-600 text-white',
      desc: 'GMV financials, fleet dispatch & payment audit',
    },
  ];

  const activeAddress =
    userProfile.addresses.find((a) => a.isDefault) || userProfile.addresses[0];

  const switchPortal = (p: (typeof portals)[0]) => {
    setUserRole(p.role);
    setActiveTab(p.tab);
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Dedicated Driver Portal Header
  if (activeTab === 'driver_portal') {
    return (
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-sans">
                  FreshMarket Driver App
                </h1>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Driver Portal Page
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Driver:{' '}
                <span className="text-white font-medium">
                  {activeDriver?.name || 'Marcus Vance'}
                </span>{' '}
                • {activeDriver?.vehicleType} ({activeDriver?.vehiclePlate})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-stone-400">Today's Earnings:</span>
              <span className="font-black text-emerald-400">
                ${activeDriver?.todayEarnings?.toFixed(2) || '142.50'} AUD
              </span>
            </div>

            <button
              id="btn-driver-exit-to-store"
              onClick={() => {
                setUserRole('customer');
                setActiveTab('store');
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>

            {/* Portal Switcher */}
            <div className="relative">
              <button
                id="btn-portal-switch-from-driver"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-800">
                    Switch Dedicated System Page
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.tab}
                      onClick={() => switchPortal(p)}
                      className="w-full flex items-start gap-2.5 p-2.5 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{p.label}</div>
                        <div className="text-[11px] text-stone-500">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dedicated Admin Command Center Header
  if (activeTab === 'admin_dashboard') {
    return (
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-sans">
                  FreshMarket Admin Center
                </h1>
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full">
                  Admin Page
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Central Operations, Dynamic Pricing Engine & Driver Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-admin-exit-to-store"
              onClick={() => {
                setUserRole('customer');
                setActiveTab('store');
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>

            {/* Portal Switcher */}
            <div className="relative">
              <button
                id="btn-portal-switch-from-admin"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-800">
                    Switch Dedicated System Page
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.tab}
                      onClick={() => switchPortal(p)}
                      className="w-full flex items-start gap-2.5 p-2.5 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{p.label}</div>
                        <div className="text-[11px] text-stone-500">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dedicated Vendor / Supermarket Merchant Header
  if (activeTab === 'vendor_portal') {
    return (
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white font-sans">
                  Merchant Store Portal
                </h1>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Vendor Partner
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Manage Inventory, Dynamic Prices & Kitchen Packing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-vendor-exit-to-store"
              onClick={() => {
                setUserRole('customer');
                setActiveTab('store');
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>

            {/* Portal Switcher */}
            <div className="relative">
              <button
                id="btn-portal-switch-from-vendor"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-800">
                    Switch Dedicated System Page
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.tab}
                      onClick={() => switchPortal(p)}
                      className="w-full flex items-start gap-2.5 p-2.5 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{p.label}</div>
                        <div className="text-[11px] text-stone-500">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dedicated User Profile & Account Page Header
  if (activeTab === 'user_profile') {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-from-profile"
              onClick={() => setActiveTab('store')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-xs py-1.5 px-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>← Back to Food & Grocery Store</span>
            </button>
            <div className="h-5 w-px bg-stone-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <h1 className="text-sm font-bold text-stone-900 leading-none">
                  {userProfile.name}'s Account Page
                </h1>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {userProfile.email} • {userProfile.loyaltyPoints} Fresh Club Pts
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-nav-cart-from-profile"
              onClick={() => setActiveModal('cart')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartItemCount})</span>
            </button>

            {/* Portal Switcher */}
            <div className="relative">
              <button
                id="btn-portal-switch-from-profile"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-800">
                    Switch Dedicated System Page
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.tab}
                      onClick={() => switchPortal(p)}
                      className="w-full flex items-start gap-2.5 p-2.5 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{p.label}</div>
                        <div className="text-[11px] text-stone-500">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dedicated Live Tracking Page Header
  if (activeTab === 'tracking') {
    return (
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-from-tracking"
              onClick={() => setActiveTab('store')}
              className="flex items-center gap-2 text-stone-300 hover:text-white font-semibold text-xs py-1.5 px-3 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <span>← Back to Food & Grocery Store</span>
            </button>
            <div className="h-5 w-px bg-stone-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none flex items-center gap-2">
                  <span>Live GPS Order Tracking</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h1>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Order #{activeTrackingOrderId || 'FM-98421'} • Chilled Express Van
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-view-profile-from-tracking"
              onClick={() => setActiveTab('user_profile')}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </button>

            {/* Portal Switcher */}
            <div className="relative">
              <button
                id="btn-portal-switch-from-tracking"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-800">
                    Switch Dedicated System Page
                  </div>
                  {portals.map((p) => (
                    <button
                      key={p.tab}
                      onClick={() => switchPortal(p)}
                      className="w-full flex items-start gap-2.5 p-2.5 hover:bg-stone-50 text-left cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{p.label}</div>
                        <div className="text-[11px] text-stone-500">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // DEFAULT: Pure Customer Food & Grocery Storefront Navbar
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner: Dynamic Pricing Alert + Portal Gateway Switcher */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-emerald-50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-medium">⚡ Live Dynamic Pricing Active:</span>
            <span className="hidden sm:inline text-emerald-200">
              Save up to {pricingConfig.surplusDiscountPercentage}% on surplus fresh groceries and hot daily chef specials.
            </span>
          </div>

          <div className="flex items-center gap-3 text-emerald-200 text-xs">
            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-top-portal-switch"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-2.5 py-0.5 rounded-full transition-colors font-semibold cursor-pointer text-[11px]"
              >
                <span>Switch Portal</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  id="menu-top-portal-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">Switch Ecosystem Portal</p>
                    <p className="text-[11px] text-stone-500">Each role has its own dedicated page</p>
                  </div>
                  <div className="p-1 space-y-1">
                    {portals.map((p) => (
                      <button
                        key={p.tab}
                        id={`btn-portal-item-${p.tab}`}
                        onClick={() => switchPortal(p)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          activeTab === p.tab
                            ? 'bg-stone-100 text-stone-900 font-medium'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                          {p.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            {p.label}
                            {activeTab === p.tab && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 font-normal">{p.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="btn-logo-home"
              onClick={() => {
                setActiveTab('store');
                setSelectedSector('all');
                setSelectedVendorId(null);
                setSelectedCategory('All');
              }}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-stone-900 font-serif">
                    FreshMarket<span className="text-emerald-600">.</span>
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Food & Groceries
                  </span>
                </div>
              </div>
            </button>

            {/* Delivery Address Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-stone-200">
              <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-stone-400 font-medium leading-none">
                  Deliver to {activeAddress?.label || 'Home'}
                </div>
                <button
                  id="btn-change-address"
                  onClick={() => setActiveTab('user_profile')}
                  className="text-xs font-semibold text-stone-800 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="truncate max-w-[140px]">
                    {activeAddress
                      ? `${activeAddress.suburb}, ${activeAddress.state}`
                      : 'Sydney CBD, NSW'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar (Customer Food & Grocery) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                id="input-navbar-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh groceries, hot woodfired pizza, rotisserie chicken, sushi, bakery..."
                className="w-full bg-stone-50 border border-stone-200 rounded-full pl-10 pr-10 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-xs absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* AI Recipe Assistant Button */}
            <button
              id="btn-ai-recipe-nav"
              onClick={() => setActiveModal('recipe_ai')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Recipe to Cart</span>
            </button>

            {/* User Account / Profile Page Button */}
            <button
              id="btn-nav-profile"
              onClick={() => setActiveTab('user_profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'user_profile'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
              title="Customer Profile & Account Page"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Account</span>
            </button>

            {/* Cart Button with Total */}
            <button
              id="btn-nav-cart"
              onClick={() => setActiveModal('cart')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartItemCount > 0 ? `$${cartTotal.toFixed(2)}` : 'Cart'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-stone-200 text-stone-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              id="input-mobile-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries, hot food, meals..."
              className="w-full bg-stone-50 border border-stone-200 rounded-full pl-10 pr-8 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Pure Customer Shopping Sub-Navigation: Grocery vs Hot Food Selection */}
        <nav className="flex items-center justify-between overflow-x-auto py-2 border-t border-stone-100 scrollbar-none text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* All Food & Grocery */}
            <button
              id="tab-btn-sector-all"
              onClick={() => {
                setSelectedSector('all');
                setSelectedVendorId(null);
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedSector === 'all' && !searchQuery
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>All Food & Groceries</span>
            </button>

            {/* Fresh Groceries & Supermarkets */}
            <button
              id="tab-btn-sector-grocery"
              onClick={() => {
                setSelectedSector('grocery');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedSector === 'grocery'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>🥦 Fresh Groceries & Supermarkets</span>
            </button>

            {/* Hot Food, Kitchens & Delis */}
            <button
              id="tab-btn-sector-food"
              onClick={() => {
                setSelectedSector('food');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedSector === 'food'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>🍕 Hot Food, Kitchens & Delis</span>
            </button>

            {/* Live Order Tracker */}
            <button
              id="tab-btn-customer-tracking"
              onClick={() => setActiveTab('tracking')}
              className="px-3 py-1.5 rounded-lg font-semibold text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer flex items-center gap-1.5 border border-teal-200 ml-1"
            >
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              <span>Track Active Order</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            </button>
          </div>

          {/* Quick Dynamic Price status */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <button
              id="btn-pricing-rules-view"
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin_dashboard');
              }}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-emerald-700 text-xs font-medium cursor-pointer"
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Surplus Dynamic Pricing Active</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-1 text-xs animate-in fade-in">
            <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase">
              Customer Shopping
            </div>
            <button
              onClick={() => {
                setSelectedSector('all');
                setActiveTab('store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold"
            >
              <Store className="w-4 h-4 text-emerald-700" />
              <span>All Food & Groceries</span>
            </button>
            <button
              onClick={() => {
                setSelectedSector('grocery');
                setActiveTab('store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Fresh Groceries & Supermarkets</span>
            </button>
            <button
              onClick={() => {
                setSelectedSector('food');
                setActiveTab('store');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Hot Prepared Food & Kitchens</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('user_profile');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold"
            >
              <User className="w-4 h-4 text-teal-700" />
              <span>My Account & Past Orders</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('tracking');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold"
            >
              <Truck className="w-4 h-4 text-teal-700" />
              <span>Live Order Tracker</span>
            </button>

            <div className="pt-2 px-3 py-1 text-[11px] font-bold text-stone-400 uppercase border-t border-stone-100">
              Staff & Driver Portals
            </div>
            <button
              onClick={() => {
                setUserRole('driver');
                setActiveTab('driver_portal');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 font-semibold"
            >
              <Truck className="w-4 h-4" />
              <span>Delivery Driver Page</span>
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin_dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-50 font-semibold"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Center Page</span>
            </button>
            <button
              onClick={() => {
                setUserRole('vendor');
                setActiveTab('vendor_portal');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 font-semibold"
            >
              <Store className="w-4 h-4" />
              <span>Supermarket Vendor Page</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
