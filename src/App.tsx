import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
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
  TrendingDown,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

const MarketplaceView: React.FC = () => {
  const { filteredProducts, selectedVendorId, vendors, setSelectedCategory } = useApp();

  const activeVendor = selectedVendorId
    ? vendors.find((v) => v.id === selectedVendorId)
    : null;

  // Count items on surplus discount
  const surplusCount = filteredProducts.filter(
    (p) => p.pricingTierInfo?.status === 'surplus_discount'
  ).length;

  return (
    <div className="shop-page">
      <section className="shop-intro">
        <div className="shop-breadcrumb">Home <span>/</span> Shop</div>
        <div className="shop-heading-row">
          <div>
            <p className="shop-kicker">Curated for your kitchen</p>
            <h1>Shop all products</h1>
            <p className="shop-description">Fresh groceries, pantry essentials and chef-made favourites, delivered to your door.</p>
          </div>
          <div className="shop-count"><strong>{filteredProducts.length}</strong> products</div>
        </div>
      </section>

      <div className="shop-categories"><CategoryList /></div>

      <section className="shop-catalog-shell">
        <aside className="shop-sidebar">
          <div className="sidebar-title">Browse by</div>
          <button className="sidebar-link sidebar-link-active" onClick={() => setSelectedCategory('All')}>All products</button>
          <button className="sidebar-link" onClick={() => setSelectedCategory('Fresh Produce')}>Fresh produce</button>
          <button className="sidebar-link" onClick={() => setSelectedCategory('Pantry & Staples')}>Pantry & staples</button>
          <button className="sidebar-link" onClick={() => setSelectedCategory('Bakery & Bread')}>Bakery & bread</button>
          <button className="sidebar-link" onClick={() => setSelectedCategory('Personal Care')}>Beauty & care</button>
          <div className="sidebar-note"><TrendingDown size={15} /> Live surplus savings</div>
        </aside>
        <div className="shop-results">
          <SearchFilterBar />

      {/* Product Catalog Grid */}
      <main className="shop-products">
        <div className="shop-results-heading">
          <div className="flex items-center gap-2">
            <h3>
              {activeVendor ? `${activeVendor.name} Catalog` : 'Available Groceries & Prepared Meals'}
            </h3>
            <span className="result-pill">
              {filteredProducts.length} items
            </span>
          </div>

          {surplusCount > 0 && (
            <span className="surplus-pill">
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
            className="shop-grid"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
        </div>
      </section>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, toastMessage, userRole, setActiveModal, setActiveTab } = useApp();
  const isAdminRoute = window.location.pathname === '/admin';

  React.useEffect(() => {
    if (isAdminRoute && userRole !== 'admin') setActiveModal('login');
  }, [isAdminRoute, userRole, setActiveModal]);

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
      {!isAdminRoute && <Navbar />}

      {/* Role-Based Primary Dedicated Pages */}
      <div className="flex-1">
        {isAdminRoute ? (
          userRole === 'admin' ? <AdminDashboard /> : <AdminAccessNotice setActiveTab={setActiveTab} />
        ) : activeTab === 'store' && <MarketplaceView />}
        {activeTab === 'user_profile' && <UserProfilePage />}
        {activeTab === 'tracking' && <OrderTrackingView />}
        {activeTab === 'driver_portal' && <DriverPortal />}
        {activeTab === 'vendor_portal' && <VendorPortal />}
        {!isAdminRoute && activeTab === 'admin_dashboard' && <MarketplaceView />}
      </div>

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <UserProfileModal />
      <AiRecipeAssistant />

      {/* Footer */}
      {!isAdminRoute && <Footer />}
      {isAdminRoute && <AuthModal />}
    </div>
  );
};

const AdminAccessNotice: React.FC<{ setActiveTab: (tab: 'store' | 'tracking' | 'driver_portal' | 'vendor_portal' | 'admin_dashboard' | 'user_profile') => void }> = ({ setActiveTab }) => (
  <div className="min-h-[60vh] flex items-center justify-center p-6">
    <div className="max-w-md text-center bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-xl font-bold text-stone-900">Administrator sign-in required</h1>
      <p className="text-sm text-stone-500 mt-2">This area is restricted to authorised administrators.</p>
      <button onClick={() => setActiveTab('store')} className="mt-6 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">Return to shop</button>
    </div>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
