import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StoreSelector } from './components/customer/StoreSelector';
import { CategoryList } from './components/customer/CategoryList';
import { SearchFilterBar } from './components/customer/SearchFilterBar';
import { ProductCard } from './components/customer/ProductCard';
import { ProductModal } from './components/customer/ProductModal';
import { AiRecipeAssistant } from './components/customer/AiRecipeAssistant';
import { UserProfileModal } from './components/customer/UserProfileModal';
import { UserProfilePage } from './components/customer/UserProfilePage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { DriverPortal } from './components/driver/DriverPortal';
import { VendorPortal } from './components/vendor/VendorPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  Sparkles,
  TrendingDown,
  Clock,
  ShieldCheck,
  ShoppingBag,
  ChefHat,
  Truck,
  ArrowRight,
  Store,
  CheckCircle2,
} from 'lucide-react';

const MarketplaceView: React.FC = () => {
  const { filteredProducts, selectedVendorId, vendors, setActiveModal } = useApp();

  const activeVendor = selectedVendorId
    ? vendors.find((v) => v.id === selectedVendorId)
    : null;

  // Count items on surplus discount
  const surplusCount = filteredProducts.filter(
    (p) => p.pricingTierInfo?.status === 'surplus_discount'
  ).length;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Seasonal Banner / AI Recipe Quick Prompt */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Subtle background glow / graphics */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div className="max-w-xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Real-Time Inventory Dynamic Pricing Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              Fresh Local Groceries, Supermarket Aisles & Hot Kitchen Meals
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Shop directly from Metro Supermarkets, Organic Growers, Woodfired Pizzerias, Sushi Bars and Artisan Bakeries with chilled van delivery in 20-35 mins.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <TrendingDown className="w-4 h-4 text-amber-300" />
                {surplusCount} Surplus Deals Live Today
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Truck className="w-4 h-4 text-emerald-300" />
                Live GPS Courier Tracking
              </span>
            </div>
          </div>

          {/* Quick AI Recipe CTA Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:w-80 shrink-0 relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400 text-stone-950">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Smart Meal Planner</h4>
                <p className="text-[11px] text-emerald-200">Auto-match ingredients to cart</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100">
              Pick popular Australian dinner recipes or type your craving to add all fresh ingredients with 1 click.
            </p>
            <button
              id="btn-banner-open-recipe"
              onClick={() => setActiveModal('recipe_ai')}
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 py-2.5 px-4 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Explore AI Meal Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Supermarkets & Vendors Carousel */}
      <StoreSelector />

      {/* Category Navigation Bar */}
      <CategoryList />

      {/* Search, Filter & Sorting Bar */}
      <SearchFilterBar />

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              {activeVendor ? `${activeVendor.name} Catalog` : 'Available Groceries & Prepared Meals'}
            </h3>
            <span className="text-xs font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>

          {surplusCount > 0 && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{surplusCount} Surplus Discounts Available</span>
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-800">No matching groceries found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your category, price range, dietary tags, or search query.
            </p>
          </div>
        ) : (
          <div
            id="products-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-900 font-sans antialiased">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast"
          className="fixed bottom-6 right-6 z-60 animate-in slide-in-from-bottom duration-300"
        >
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white ${
              toastMessage.type === 'success'
                ? 'bg-emerald-800'
                : toastMessage.type === 'warning'
                ? 'bg-amber-800'
                : 'bg-stone-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Role-Based Primary Dedicated Pages */}
      <div className="flex-1">
        {activeTab === 'store' && <MarketplaceView />}
        {activeTab === 'user_profile' && <UserProfilePage />}
        {activeTab === 'tracking' && <OrderTrackingView />}
        {activeTab === 'driver_portal' && <DriverPortal />}
        {activeTab === 'vendor_portal' && <VendorPortal />}
        {activeTab === 'admin_dashboard' && <AdminDashboard />}
      </div>

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <UserProfileModal />
      <AiRecipeAssistant />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
